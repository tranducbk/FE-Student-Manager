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

        setAllStudents(students);
        setFilteredStudents(students);
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

  // Lọc tự động khi thay đổi giá trị
  useEffect(() => {
    filterData();
  }, [fullName, unit]);

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
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setFullName("");
                      setUnit("");
                    }}
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
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Tổng số học viên
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {filteredStudents.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Tổng số lịch học
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {timeTable.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Môn học
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {
                          new Set(
                            timeTable
                              .map((item) => item.subject)
                              .filter(Boolean)
                          ).size
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                      <svg
                        className="w-6 h-6 text-orange-600 dark:text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        Tuần học
                      </p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
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
            </div>

            <div className="w-full pl-5 pb-5 pr-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Họ và tên
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Đơn vị
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Số lịch học
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Môn học
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Phòng học
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                      >
                        Tuần học
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
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
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6 font-medium">
                            {student.fullName}
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              {student.unit}
                            </span>
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {student.scheduleCount} lịch
                            </span>
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {student.subjects.length > 0 ? (
                                <>
                                  {student.subjects
                                    .slice(0, 3)
                                    .map((subject, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-r border-green-300 dark:border-green-700 pr-2 last:border-r-0"
                                      >
                                        {subject}
                                      </span>
                                    ))}
                                  {student.subjects.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-l border-gray-300 dark:border-gray-600 pl-2">
                                      +{student.subjects.length - 3}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {student.classrooms.length > 0 ? (
                                <>
                                  {student.classrooms
                                    .slice(0, 3)
                                    .map((classroom, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-r border-purple-300 dark:border-purple-700 pr-2 last:border-r-0"
                                      >
                                        {classroom}
                                      </span>
                                    ))}
                                  {student.classrooms.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-l border-gray-300 dark:border-gray-600 pl-2">
                                      +{student.classrooms.length - 3}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center py-4 px-6">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {student.weeks.length > 0 ? (
                                <>
                                  {student.weeks
                                    .slice(0, 3)
                                    .map((week, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-r border-orange-300 dark:border-orange-700 pr-2 last:border-r-0"
                                      >
                                        Tuần {week}
                                      </span>
                                    ))}
                                  {student.weeks.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-l border-gray-300 dark:border-gray-600 pl-2">
                                      +{student.weeks.length - 3}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap text-sm text-gray-900 dark:text-white text-center py-4 px-6">
                            <button
                              onClick={() => handleRowClick(student.studentId)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
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
