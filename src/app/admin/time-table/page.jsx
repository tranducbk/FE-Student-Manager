"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { handleNotify } from "../../../components/notify";

import { BASE_URL } from "@/configs";

const TimeTable = () => {
  const router = useRouter();
  const [timeTable, setTimeTable] = useState([]);
  const [fullName, setFullName] = useState("");
  const [unit, setUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const fetchTimeTable = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/commander/timeTables`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setTimeTable(res.data);

        // Nhóm dữ liệu theo học viên
        const studentsMap = new Map();
        res.data.forEach((item) => {
          if (!studentsMap.has(item.studentId)) {
            studentsMap.set(item.studentId, {
              studentId: item.studentId,
              fullName: item.fullName,
              unit: item.unit,
              scheduleCount: 0,
              subjects: [],
              classrooms: [],
              weeks: [],
            });
          }

          const student = studentsMap.get(item.studentId);
          student.scheduleCount++;
          if (item.subject) student.subjects.push(item.subject);
          if (item.classroom) student.classrooms.push(item.classroom);
          if (item.schoolWeek) student.weeks.push(item.schoolWeek);

          // Debug log để kiểm tra dữ liệu
          console.log(
            `Student: ${item.fullName}, Classroom: ${item.classroom}, All classrooms:`,
            student.classrooms
          );
        });

        const students = Array.from(studentsMap.values()).map((student) => ({
          ...student,
          subjects: [...new Set(student.subjects)], // Loại bỏ trùng lặp cho môn học
          classrooms: [...new Set(student.classrooms)], // Loại bỏ trùng lặp cho phòng học
          weeks: [...new Set(student.weeks)], // Loại bỏ trùng lặp cho tuần học
        }));

        // Sắp xếp theo đơn vị từ L1-H5 đến L6-H5
        const sortedStudents = students.sort((a, b) => {
          const unitOrder = {
            "L1 - H5": 1,
            "L2 - H5": 2,
            "L3 - H5": 3,
            "L4 - H5": 4,
            "L5 - H5": 5,
            "L6 - H5": 6,
          };
          return (unitOrder[a.unit] || 999) - (unitOrder[b.unit] || 999);
        });

        setAllStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
      } catch (error) {
        console.log(error);
        handleNotify("danger", "Lỗi!", "Không thể tải dữ liệu lịch học");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTimeTable();
  }, []);

  // Hàm lọc dữ liệu theo tên và đơn vị
  const filterData = () => {
    let filtered = [...allStudents];

    if (fullName) {
      filtered = filtered.filter((item) =>
        item.fullName?.toLowerCase().includes(fullName.toLowerCase())
      );
    }

    if (unit) {
      filtered = filtered.filter((item) => item.unit === unit);
    }

    setFilteredStudents(filtered);
  };

  // Hàm xử lý tìm kiếm khi bấm nút
  const handleSearch = () => {
    filterData();
  };

  // Hàm xóa bộ lọc
  const handleClearFilter = () => {
    setFullName("");
    setUnit("");
    setFilteredStudents(allStudents);
  };

  const handleRowClick = (studentId) => {
    router.push(`/admin/time-table/${studentId}`);
  };

  const handleGenerateAutoCutRice = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Hiển thị loading
        handleNotify(
          "info",
          "Đang xử lý...",
          "Đang tạo lịch cắt cơm tự động cho tất cả học viên"
        );

        const response = await axios.post(
          `${BASE_URL}/commander/cutRice/auto-generate`,
          {},
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          handleNotify("success", "Thành công!", response.data.message);
        }
      } catch (error) {
        handleNotify(
          "danger",
          "Lỗi!",
          error.response?.data?.message ||
            "Có lỗi xảy ra khi tạo lịch cắt cơm tự động"
        );
      }
    }
  };

  const handleExportTimeTableWithCutRice = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Hiển thị loading
        handleNotify(
          "info",
          "Đang xử lý...",
          "Đang tạo file Excel thời khóa biểu kèm lịch cắt cơm"
        );

        const unitParam = unit ? `?unit=${encodeURIComponent(unit)}` : "";

        const response = await axios.get(
          `${BASE_URL}/commander/time-table-with-cut-rice/excel${unitParam}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "thoikhoabieu.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        handleNotify(
          "success",
          "Thành công!",
          "Xuất file Excel thời khóa biểu kèm lịch cắt cơm thành công"
        );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi xuất file Excel";
        handleNotify("danger", "Lỗi!", errorMessage);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <div className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Lịch học học viên
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="font-bold pt-5 pl-5 pb-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 dark:text-white">
                  <h1 className="text-2xl font-bold">LỊCH HỌC HỌC VIÊN</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Quản lý và xem lịch học của tất cả học viên
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                    onClick={fetchTimeTable}
                    disabled={isLoading}
                  >
                    <svg
                      className={`w-4 h-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {isLoading ? "Đang tải..." : "Làm mới"}
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 border border-green-600 hover:border-green-700 rounded-lg transition-colors duration-200 flex items-center"
                    onClick={handleGenerateAutoCutRice}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Tạo lịch cắt cơm tự động
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-2 mr-4 border border-purple-600 hover:border-purple-700 rounded-lg transition-colors duration-200 flex items-center"
                    onClick={handleExportTimeTableWithCutRice}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Xuất TKB + Cắt cơm
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full pt-2 pl-5 pb-5 pr-5">
              <div className="flex items-end gap-4">
                <div className="flex gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Tìm theo tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border w-56 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10"
                      placeholder="Nhập tên học viên..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="unit"
                      className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Lọc theo đơn vị
                    </label>
                    <select
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border w-56 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10"
                    >
                      <option value="">Tất cả đơn vị</option>
                      <option value="L1 - H5">L1 - H5</option>
                      <option value="L2 - H5">L2 - H5</option>
                      <option value="L3 - H5">L3 - H5</option>
                      <option value="L4 - H5">L4 - H5</option>
                      <option value="L5 - H5">L5 - H5</option>
                      <option value="L6 - H5">L6 - H5</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Tìm kiếm
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="h-9 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg text-sm px-5 transition-colors duration-200"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Thống kê */}
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Tổng số học viên
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredStudents.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Tổng số lịch học
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {timeTable.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Môn học
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        new Set(
                          timeTable.map((item) => item.subject).filter(Boolean)
                        ).size
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Tuần học
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        new Set(
                          timeTable
                            .map((item) => item.schoolWeek)
                            .filter(Boolean)
                        ).size
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pl-5 pb-5 pr-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Đơn vị
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Họ và tên
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Số lịch học
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Môn học
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Phòng học
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Tuần học
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents && filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr
                          key={student.studentId || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleRowClick(student.studentId)}
                        >
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            {student.unit}
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6 font-medium">
                            {student.fullName}
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            {student.scheduleCount}
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            {student.subjects.length > 0 ? (
                              <div className="space-y-1">
                                {student.subjects
                                  .slice(0, 3)
                                  .map((subject, idx) => (
                                    <div key={idx} className="text-xs">
                                      {subject}
                                    </div>
                                  ))}
                                {student.subjects.length > 3 && (
                                  <div className="text-xs text-gray-500">
                                    +{student.subjects.length - 3} môn khác
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            {student.classrooms.length > 0 ? (
                              <div className="space-y-1">
                                {student.classrooms
                                  .slice(0, 3)
                                  .map((classroom, idx) => (
                                    <div key={idx} className="text-xs">
                                      {classroom}
                                    </div>
                                  ))}
                                {student.classrooms.length > 3 && (
                                  <div className="text-xs text-gray-500">
                                    +{student.classrooms.length - 3} phòng khác
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-2">
                            {student.weeks.length > 0 ? (
                              <div className="space-y-1">
                                {student.weeks.slice(0, 3).map((week, idx) => (
                                  <div key={idx} className="text-xs">
                                    Tuần {week}
                                  </div>
                                ))}
                                {student.weeks.length > 3 && (
                                  <div className="text-xs text-gray-500">
                                    +{student.weeks.length - 3} tuần khác
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white text-center py-4 px-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(student.studentId);
                              }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-12 text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center">
                            <svg
                              className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-lg font-medium mb-2">
                              Không có dữ liệu
                            </p>
                            <p className="text-sm text-gray-400">
                              {fullName || unit
                                ? "Không tìm thấy học viên phù hợp với bộ lọc"
                                : "Chưa có học viên nào có lịch học"}
                            </p>
                            {fullName || unit ? (
                              <button
                                onClick={() => {
                                  setFullName("");
                                  setUnit("");
                                  fetchTimeTable();
                                }}
                                className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                              >
                                Xóa bộ lọc
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
