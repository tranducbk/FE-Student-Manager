"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "@/components/notify";
import { BASE_URL } from "@/configs";
import { TreeSelect, ConfigProvider, theme } from "antd";
import { useState as useThemeState } from "react";

const LearningResults = () => {
  const [learningResults, setLearningResults] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDark, setIsDark] = useThemeState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editedLearningResult, setEditedLearningResult] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    studentId: null,
    learnId: null,
  });

  // Phát hiện theme hiện tại
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    // Kiểm tra theme ban đầu
    checkTheme();

    // Theo dõi thay đổi theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemesters.length > 0) {
      fetchLearningResults();
    }
  }, [selectedSemesters]);

  const fetchSemesters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/semester`, {
        headers: { token: `Bearer ${token}` },
      });
      const list = res.data || [];
      console.log("Semesters data:", list);
      setSemesters(list);
      if (list.length > 0) {
        setSelectedSemesters([list[0].code]);
      }
    } catch (error) {
      console.log("Error fetching semesters:", error);
      setSemesters([]);
      setSelectedSemesters([]);
    }
  };

  const fetchLearningResults = async () => {
    const token = localStorage.getItem("token");
    if (!token || selectedSemesters.length === 0) return;

    setLoading(true);
    try {
      // Tạo array chứa thông tin semester và schoolYear
      const semesterData = selectedSemesters.map((semesterCode) => {
        const semester = semesters.find((s) => s.code === semesterCode);
        return {
          semester: semesterCode,
          schoolYear: semester?.schoolYear || "2024-2025",
        };
      });

      // Tách riêng semester và schoolYear để gửi lên API
      const semesterParam = semesterData.map((item) => item.semester).join(",");
      const schoolYearParam = semesterData
        .map((item) => item.schoolYear)
        .join(",");

      console.log("Fetching with semester and schoolYear:", {
        semesterParam,
        schoolYearParam,
      });

      const res = await axios.get(
        `${BASE_URL}/commander/allStudentsGrades?semester=${semesterParam}&schoolYear=${schoolYearParam}`,
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      console.log("Learning results data:", res.data);
      setLearningResults(res.data || []);
    } catch (error) {
      console.log("Error fetching learning results:", error);
      setLearningResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết 1 SV theo kỳ để xem
  const fetchStudentDetail = async (studentId, semester, schoolYear) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/grade/${studentId}/${semester}/${schoolYear}`,
        { headers: { token: `Bearer ${token}` } }
      );
      setStudentDetail(res.data);
    } catch (error) {
      console.log("Error fetching student detail:", error);
      handleNotify("error", "Lỗi", "Không thể tải chi tiết điểm của sinh viên");
    }
  };

  const handleViewDetail = async (row) => {
    setSelectedStudent(row);
    setShowDetailModal(true);
    await fetchStudentDetail(row.studentId, row.semester, row.schoolYear);
  };

  // Mở modal sửa (giống user): sửa các trường lẻ của learning_information
  const openEditModal = (row) => {
    setEditStudentId(row.studentId);
    setEditedLearningResult({
      semester: row.semester,
      schoolYear: row.schoolYear,
      GPA: row.GPA,
      CPA: row.CPA,
      cumulativeCredit: row.cumulativeCredit,
      totalDebt: row.totalDebt,
      studentLevel: row.studentLevel,
      warningLevel: row.warningLevel,
      learningStatus: row.learningStatus || "Học",
    });
    setShowEditModal(true);
  };

  const handleUpdateLearningResult = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !editStudentId) return;

    try {
      // Tìm learnId từ danh sách theo key kết hợp semester+schoolYear
      const current = learningResults.find(
        (x) =>
          x.studentId === editStudentId &&
          x.semester === editedLearningResult.semester &&
          x.schoolYear === editedLearningResult.schoolYear
      );
      const learnId = current?._id;
      if (!learnId) {
        handleNotify(
          "warning",
          "Thiếu dữ liệu",
          "Không tìm thấy học kỳ cần sửa"
        );
        return;
      }

      await axios.put(
        `${BASE_URL}/student/${editStudentId}/learningResult/${learnId}`,
        editedLearningResult,
        { headers: { token: `Bearer ${token}` } }
      );

      handleNotify(
        "success",
        "Thành công",
        "Cập nhật kết quả học tập thành công"
      );
      setShowEditModal(false);
      setEditStudentId(null);
      setEditedLearningResult({});
      fetchLearningResults();
    } catch (error) {
      handleNotify(
        "error",
        "Lỗi",
        error?.response?.data?.message || "Không thể cập nhật kết quả học tập"
      );
    }
  };

  // Xóa kết quả học tập
  const openConfirmDelete = (row) => {
    setDeleteTarget({ studentId: row.studentId, learnId: row._id });
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !deleteTarget.studentId || !deleteTarget.learnId) return;
    try {
      await axios.delete(
        `${BASE_URL}/student/${deleteTarget.studentId}/learning-information/${deleteTarget.learnId}`,
        { headers: { token: `Bearer ${token}` } }
      );
      handleNotify("success", "Thành công", "Đã xóa kết quả học tập");
      setShowConfirmDelete(false);
      setDeleteTarget({ studentId: null, learnId: null });
      fetchLearningResults();
    } catch (error) {
      handleNotify(
        "error",
        "Lỗi",
        error?.response?.data?.message || "Không thể xóa"
      );
    }
  };

  // (removed duplicate fetchStudentDetail)

  const handleExportPDF = async () => {
    const token = localStorage.getItem("token");
    if (!token || selectedSemesters.length === 0) return;

    try {
      const semesterParam = selectedSemesters.join(",");
      const res = await axios.get(
        `${BASE_URL}/commander/learningResult/pdf?semester=${semesterParam}`,
        {
          headers: { token: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Thong_ke_ket_qua_hoc_tap_${semesterParam}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      handleNotify("success", "Thành công", "Đã xuất file PDF");
    } catch (error) {
      console.log("Error exporting PDF:", error);
      handleNotify("error", "Lỗi", "Không thể xuất file PDF");
    }
  };

  const getSemesterLabel = (s) => {
    if (!s) return "";
    // Hiển thị format: HK1 - 2024-2025
    if (s.schoolYear) return `${s.code} - ${s.schoolYear}`;
    return s.code;
  };

  // Tạo tree data cho TreeSelect
  const treeData = semesters.map((semester) => ({
    title: getSemesterLabel(semester),
    value: semester.code,
    key: semester.code,
  }));

  const getFilteredResults = () => {
    if (!learningResults) return [];

    let filtered = learningResults.filter((item) => {
      const matchesSearch =
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "warning" && item.warningLevel > 0) ||
        (filterStatus === "good" && item.warningLevel === 0);

      return matchesSearch && matchesFilter;
    });

    return filtered;
  };

  // Đếm số sinh viên có điểm F
  const getStudentsWithFGrade = () => {
    return getFilteredResults().filter((item) => {
      // Kiểm tra nếu có subjects và có ít nhất 1 môn có điểm F
      return (
        item.subjects &&
        item.subjects.some(
          (subject) => subject.letterGrade === "F" || subject.gradePoint4 === 0
        )
      );
    }).length;
  };

  return (
    <>
      <ReactNotifications />
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
                      Kết quả học tập
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="font-bold p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  KẾT QUẢ HỌC TẬP HỌC VIÊN
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                    onClick={handleExportPDF}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Xuất PDF
                  </button>
                </div>
              </div>

              <div className="w-full p-5">
                <div className="mb-4">
                  <form className="flex items-end gap-4 flex-wrap">
                    <div>
                      <label
                        htmlFor="semester"
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Chọn học kỳ
                      </label>
                      <ConfigProvider
                        theme={{
                          algorithm: isDark
                            ? theme.darkAlgorithm
                            : theme.defaultAlgorithm,
                          token: {
                            colorPrimary: "#2563eb",
                            borderRadius: 8,
                            controlOutline: "rgba(37,99,235,0.2)",
                          },
                        }}
                      >
                        <TreeSelect
                          treeData={treeData}
                          treeCheckable
                          showCheckedStrategy={TreeSelect.SHOW_PARENT}
                          placeholder="Chọn học kỳ"
                          allowClear
                          showSearch={false}
                          style={{ width: 360 }}
                          dropdownStyle={{
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            color: isDark ? "#e5e7eb" : "#111827",
                            border: `1px solid ${
                              isDark ? "#374151" : "#e5e7eb"
                            }`,
                            borderRadius: 8,
                          }}
                          tagRender={(props) => {
                            const { label, onClose } = props;
                            return (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 mr-1 mb-1"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <span className="text-xs">{label}</span>
                                <button
                                  onClick={onClose}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                                  aria-label="remove"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          }}
                          onChange={(values) => setSelectedSemesters(values)}
                        />
                      </ConfigProvider>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tìm kiếm
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tên hoặc mã sinh viên..."
                        className="bg-gray-50 dark:bg-gray-700 border w-48 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 px-3"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trạng thái
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border w-32 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10"
                      >
                        <option value="all">Tất cả</option>
                        <option value="good">Tốt</option>
                        <option value="warning">Cảnh báo</option>
                      </select>
                    </div>
                    <div>
                      <Link
                        href="/admin/semester-management"
                        className="h-9 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-4 transition-colors duration-200 flex items-center"
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Quản lý học kỳ
                      </Link>
                    </div>
                  </form>
                </div>

                {/* Thống kê tổng quan */}
                {!loading && learningResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {getFilteredResults().length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng số sinh viên
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {
                          getFilteredResults().filter(
                            (item) => item.warningLevel === 0
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sinh viên tốt
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {
                          getFilteredResults().filter(
                            (item) => item.warningLevel > 0
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Cần cảnh báo
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {getStudentsWithFGrade()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sinh viên nợ môn
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {getFilteredResults().reduce(
                          (sum, item) => sum + (item.totalDebt || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng tín chỉ nợ
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="table-auto w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          HỌC KỲ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          HỌ VÀ TÊN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TRƯỜNG
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          GPA
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          CPA
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TC TÍCH LŨY
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TC NỢ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TRÌNH ĐỘ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          CẢNH BÁO
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          THAO TÁC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="10"
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <svg
                                className="animate-spin h-8 w-8 text-blue-500 mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <p>Đang tải dữ liệu...</p>
                            </div>
                          </td>
                        </tr>
                      ) : getFilteredResults().length > 0 ? (
                        getFilteredResults().map((item, index) => (
                          <tr
                            key={item._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleViewDetail(item)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.semester} - {item.schoolYear}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div>
                                <div className="font-medium">
                                  {item.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Mã: {item.studentCode}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.university}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.GPA}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.CPA}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.cumulativeCredit} tín chỉ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.totalDebt} tín chỉ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              Năm {item.studentLevel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.warningLevel === 0
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : item.warningLevel === 1
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                Mức {item.warningLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Xem chi tiết"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetail(item);
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4"
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
                                </button>
                                <button
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Chỉnh sửa"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(item);
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Xóa"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openConfirmDelete(item);
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="10"
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <svg
                                className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
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
                              <p className="text-lg font-medium">
                                Không có dữ liệu
                              </p>
                              <p className="text-sm">
                                Không tìm thấy kết quả học tập nào cho học kỳ
                                này
                              </p>
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

      {/* Modal chỉnh sửa kết quả học tập */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chỉnh sửa kết quả học tập
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form onSubmit={handleUpdateLearningResult} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Học kỳ
                    </label>
                    <input
                      type="text"
                      value={editedLearningResult.semester || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          semester: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Năm học
                    </label>
                    <input
                      type="text"
                      value={editedLearningResult.schoolYear || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          schoolYear: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedLearningResult.GPA || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          GPA: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedLearningResult.CPA || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          CPA: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      TC tích lũy
                    </label>
                    <input
                      type="number"
                      value={editedLearningResult.cumulativeCredit || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          cumulativeCredit: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      TC nợ
                    </label>
                    <input
                      type="number"
                      value={editedLearningResult.totalDebt || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          totalDebt: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trình độ
                    </label>
                    <input
                      type="text"
                      value={editedLearningResult.studentLevel || ""}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          studentLevel: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cảnh báo
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={editedLearningResult.warningLevel || 0}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          warningLevel: Number(e.target.value),
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={editedLearningResult.learningStatus || "Học"}
                      onChange={(e) =>
                        setEditedLearningResult({
                          ...editedLearningResult,
                          learningStatus: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="Học">Học</option>
                      <option value="Cảnh báo học tập (Mức M1)">
                        Cảnh báo học tập (Mức M1)
                      </option>
                      <option value="Cảnh báo học tập (Mức M2)">
                        Cảnh báo học tập (Mức M2)
                      </option>
                      <option value="Cảnh báo học tập (Mức M3)">
                        Cảnh báo học tập (Mức M3)
                      </option>
                      <option value="Buộc thôi học">Buộc thôi học</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xác nhận xóa
              </h2>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bạn có chắc chắn muốn xóa kết quả học tập này?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                  onClick={handleConfirmDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết điểm */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chi tiết điểm - {selectedStudent.fullName} (
                {selectedStudent.studentCode})
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedStudent(null);
                  setStudentDetail(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-6">
              {studentDetail ? (
                <>
                  {/* Thông tin tổng quan */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {studentDetail.totalCredits || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng tín chỉ
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {studentDetail.averageGrade4?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        GPA (Hệ 4)
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {studentDetail.averageGrade10?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        GPA (Hệ 10)
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {studentDetail.subjects?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Số môn học
                      </div>
                    </div>
                  </div>

                  {/* Bảng chi tiết môn học */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Chi tiết các môn học - {studentDetail.semester} -{" "}
                        {studentDetail.schoolYear}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Mã môn
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Tên môn học
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Tín chỉ
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Điểm chữ
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Điểm hệ 4
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Điểm hệ 10
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {studentDetail.subjects?.map((subject, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {subject.subjectCode}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {subject.subjectName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                                {subject.credits}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    subject.letterGrade === "A+" ||
                                    subject.letterGrade === "A"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : subject.letterGrade === "B+" ||
                                        subject.letterGrade === "B"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : subject.letterGrade === "C+" ||
                                        subject.letterGrade === "C"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      : subject.letterGrade === "D+" ||
                                        subject.letterGrade === "D"
                                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }`}
                                >
                                  {subject.letterGrade}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                                {subject.gradePoint4?.toFixed(2) || "0.00"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                                {subject.gradePoint10?.toFixed(2) || "0.00"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Đang tải chi tiết...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LearningResults;
