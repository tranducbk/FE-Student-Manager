"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "@/components/notify";
import { BASE_URL } from "@/configs";
import { TreeSelect, ConfigProvider, theme, Input, Select } from "antd";
import { useState as useThemeState } from "react";

const YearlyStatistics = () => {
  const [yearlyResults, setYearlyResults] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [availableUnits, setAvailableUnits] = useState([]);

  const [isDark, setIsDark] = useThemeState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    partyRating: "",
    trainingRating: "",
    decisionNumber: "",
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      // Gọi API để lấy dữ liệu thống kê năm học (không có tham số schoolYear)
      const res = await axios.get(`${BASE_URL}/commander/yearlyStatistics`, {
        headers: { token: `Bearer ${token}` },
      });

      console.log("Yearly results data:", res.data);

      // Xử lý dữ liệu từ API
      const processedData = res.data || [];

      // Lấy danh sách năm học từ dữ liệu
      const allSchoolYears = new Set();
      processedData.forEach((item) => {
        if (item.schoolYear && item.schoolYear !== "Tất cả") {
          allSchoolYears.add(item.schoolYear);
        }
      });

      const uniqueSchoolYears = Array.from(allSchoolYears).sort((a, b) =>
        b.localeCompare(a)
      );
      setSchoolYears(uniqueSchoolYears);

      // Dữ liệu đã được xử lý từ backend, chỉ cần set
      setYearlyResults(processedData);

      // Lấy danh sách các đơn vị có sẵn từ dữ liệu
      const units = [
        ...new Set(
          processedData
            .map((item) => item.unit)
            .filter((unit) => unit && unit.trim())
        ),
      ];
      setAvailableUnits(units);

      // Mặc định chọn "Tất cả các năm"
      setSelectedSchoolYear("all");
    } catch (error) {
      console.log("Error fetching initial data:", error);
      setYearlyResults([]);
      setSchoolYears([]);
      setSelectedSchoolYear("");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng thay đổi năm học
  const handleSchoolYearChange = (newSchoolYear) => {
    setSelectedSchoolYear(newSchoolYear);

    if (newSchoolYear === "all") {
      // Nếu chọn "Tất cả các năm", gọi lại API để lấy tất cả dữ liệu
      fetchInitialData();
      return;
    }

    // Nếu chọn năm học cụ thể, gọi API để lấy dữ liệu cho năm đó
    fetchYearlyResultsForYear(newSchoolYear);
  };

  const fetchYearlyResultsForYear = async (year) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/commander/yearlyStatistics?schoolYear=${year}`,
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      console.log(`Yearly results data for ${year}:`, res.data);
      setYearlyResults(res.data || []);
    } catch (error) {
      console.log("Error fetching yearly results for year:", error);
      setYearlyResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyResults = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedSchoolYear) return;

    setLoading(true);
    try {
      let res;

      // Lấy tất cả dữ liệu thống kê năm học
      res = await axios.get(`${BASE_URL}/commander/yearlyStatistics`, {
        headers: { token: `Bearer ${token}` },
      });

      console.log("Yearly results data:", res.data);

      // Xử lý dữ liệu để hiển thị đúng format
      let processedData = res.data || [];

      if (selectedSchoolYear === "all") {
        // Nếu chọn "Tất cả các năm", cần xử lý để hiển thị từng năm học riêng biệt
        const allYearlyData = [];

        processedData.forEach((student) => {
          if (student.yearlyResults && student.yearlyResults.length > 0) {
            student.yearlyResults.forEach((yearlyResult) => {
              allYearlyData.push({
                ...student,
                schoolYear: yearlyResult.schoolYear,
                averageGrade4: yearlyResult.averageGrade4,
                averageGrade10: yearlyResult.averageGrade10,
                cumulativeGrade4: yearlyResult.cumulativeGrade4,
                cumulativeGrade10: yearlyResult.cumulativeGrade10,
                cumulativeCredits: yearlyResult.cumulativeCredits,
                totalCredits: yearlyResult.totalCredits,
                totalDebt: yearlyResult.totalDebt || 0,
                semesterCount: yearlyResult.semesters?.length || 0,
                semesters: yearlyResult.semesters,
                subjects: yearlyResult.subjects || [],
                partyRating: yearlyResult.partyRating,
                trainingRating: yearlyResult.trainingRating,
                academicStatus: yearlyResult.academicStatus,
                totalSubjects: yearlyResult.totalSubjects,
                passedSubjects: yearlyResult.passedSubjects,
                failedSubjects: yearlyResult.failedSubjects,
              });
            });
          }
        });

        // Sắp xếp theo năm học (mới nhất trước)
        allYearlyData.sort((a, b) => b.schoolYear.localeCompare(a.schoolYear));
        processedData = allYearlyData;
      } else {
        // Nếu chọn năm học cụ thể, lọc dữ liệu cho năm đó
        const filteredData = [];

        processedData.forEach((student) => {
          const yearlyResult = student.yearlyResults?.find(
            (result) => result.schoolYear === selectedSchoolYear
          );

          if (yearlyResult) {
            filteredData.push({
              ...student,
              schoolYear: yearlyResult.schoolYear,
              averageGrade4: yearlyResult.averageGrade4,
              averageGrade10: yearlyResult.averageGrade10,
              cumulativeGrade4: yearlyResult.cumulativeGrade4,
              cumulativeGrade10: yearlyResult.cumulativeGrade10,
              cumulativeCredits: yearlyResult.cumulativeCredits,
              totalCredits: yearlyResult.totalCredits,
              totalDebt: yearlyResult.totalDebt || 0,
              semesterCount: yearlyResult.semesters?.length || 0,
              semesters: yearlyResult.semesters,
              subjects: yearlyResult.subjects || [],
              partyRating: yearlyResult.partyRating,
              trainingRating: yearlyResult.trainingRating,
              academicStatus: yearlyResult.academicStatus,
              totalSubjects: yearlyResult.totalSubjects,
              passedSubjects: yearlyResult.passedSubjects,
              failedSubjects: yearlyResult.failedSubjects,
            });
          }
        });

        processedData = filteredData;
      }

      setYearlyResults(processedData);

      // Lấy danh sách các đơn vị có sẵn từ dữ liệu
      const units = [
        ...new Set(
          processedData
            .map((item) => item.unit)
            .filter((unit) => unit && unit.trim())
        ),
      ];
      setAvailableUnits(units);
    } catch (error) {
      console.log("Error fetching yearly results:", error);
      setYearlyResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết 1 SV theo kỳ để xem
  const fetchStudentDetail = async (studentId, semester, schoolYear) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Sử dụng dữ liệu đã có từ yearlyResults
      const studentData = yearlyResults.find(
        (item) => item.studentId === studentId && item.schoolYear === schoolYear
      );

      if (studentData) {
        setStudentDetail({
          ...studentData,
          totalCredits: studentData.totalCredits || 0,
          averageGrade4: parseFloat(studentData.averageGrade4) || 0,
          averageGrade10: parseFloat(studentData.averageGrade10) || 0,
          cumulativeGrade4: parseFloat(studentData.cumulativeGrade4) || 0,
          cumulativeGrade10: parseFloat(studentData.cumulativeGrade10) || 0,
          cumulativeCredits: parseFloat(studentData.cumulativeCredits) || 0,
          subjects: studentData.subjects || [],
          partyRating: studentData.partyRating,
          trainingRating: studentData.trainingRating,
          academicStatus: studentData.academicStatus,
        });
      } else {
        // Fallback: gọi API nếu không tìm thấy dữ liệu
        const res = await axios.get(
          `${BASE_URL}/grade/student/${studentId}/${semester}/${schoolYear}`,
          { headers: { token: `Bearer ${token}` } }
        );

        const data = res.data;
        if (data && data.subjects) {
          setStudentDetail({
            ...data,
            totalCredits:
              data.totalCredits ||
              data.subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0),
            averageGrade4:
              data.averageGrade4 ||
              data.subjects.reduce(
                (sum, sub) => sum + (sub.gradePoint4 || 0),
                0
              ) / data.subjects.length,
            averageGrade10:
              data.averageGrade10 ||
              data.subjects.reduce(
                (sum, sub) => sum + (sub.gradePoint10 || 0),
                0
              ) / data.subjects.length,
          });
        } else {
          setStudentDetail(data);
        }
      }
    } catch (error) {
      console.log("Error fetching student detail:", error);
      handleNotify("error", "Lỗi", "Không thể tải chi tiết điểm của sinh viên");
    }
  };

  const handleViewDetail = async (row) => {
    setSelectedStudent(row);
    setShowDetailModal(true);
    await fetchStudentDetail(row.studentId, row.semesterCount, row.schoolYear);
  };

  const handleUpdateRating = (row) => {
    setSelectedStudent(row);
    setUpdateFormData({
      partyRating: row.partyRating?.rating || "",
      trainingRating: row.trainingRating || "",
      decisionNumber: row.partyRating?.decisionNumber || "",
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedStudent) return;

    try {
      // Sử dụng _id trực tiếp từ dữ liệu API
      const yearlyResultId = selectedStudent._id;

      if (!yearlyResultId) {
        handleNotify("danger", "Lỗi!", "Không tìm thấy kết quả năm học");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/commander/updateStudentRating/${yearlyResultId}`,
        {
          partyRating: updateFormData.partyRating,
          trainingRating: updateFormData.trainingRating,
          decisionNumber: updateFormData.decisionNumber,
          studentId: selectedStudent.studentId,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        handleNotify("success", "Thành công", "Cập nhật xếp loại thành công");
        setShowUpdateModal(false);
        // Refresh data
        if (selectedSchoolYear === "all") {
          fetchInitialData();
        } else {
          fetchYearlyResultsForYear(selectedSchoolYear);
        }
      }
    } catch (error) {
      console.log("Error updating rating:", error);
      handleNotify("error", "Lỗi", "Không thể cập nhật xếp loại");
    }
  };

  // Tạo options cho Select năm học
  const schoolYearOptions = [
    { label: "Tất cả các năm", value: "all" },
    ...schoolYears.map((year) => ({
      label: `Năm học ${year}`,
      value: year,
    })),
  ];

  const getFilteredResults = () => {
    if (!yearlyResults) return [];

    let filtered = yearlyResults.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnit =
        selectedUnit === "all" ||
        item.unit === selectedUnit ||
        item.className === selectedUnit;

      return matchesSearch && matchesUnit;
    });

    // Sắp xếp theo thứ tự: năm học → đơn vị → tên
    return filtered.sort((a, b) => {
      // 1. Sắp xếp theo năm học (mới nhất trước)
      if (a.schoolYear !== b.schoolYear) {
        return b.schoolYear.localeCompare(a.schoolYear);
      }

      // 2. Trong cùng năm học, sắp xếp theo đơn vị từ L1-H5 đến L6-H5
      const unitOrder = {
        "L1 - H5": 1,
        "L2 - H5": 2,
        "L3 - H5": 3,
        "L4 - H5": 4,
        "L5 - H5": 5,
        "L6 - H5": 6,
      };
      const unitA = unitOrder[a.unit] || 999;
      const unitB = unitOrder[b.unit] || 999;
      if (unitA !== unitB) return unitA - unitB;

      // 3. Trong cùng đơn vị, sắp xếp theo tên học viên A-Z
      return a.fullName.localeCompare(b.fullName, "vi");
    });
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

  // Tính tổng GPA trung bình của năm học
  const getAverageYearlyGPA = () => {
    const results = getFilteredResults();
    if (results.length === 0) return 0;

    const totalGPA = results.reduce((sum, item) => {
      return sum + (parseFloat(item.averageGrade4) || 0);
    }, 0);

    return (totalGPA / results.length).toFixed(2);
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
                      Thống kê theo năm
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
                  THỐNG KÊ KẾT QUẢ HỌC TẬP THEO NĂM
                </div>
                {/* <div className="flex gap-2">
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
                </div> */}
              </div>

              <div className="w-full p-5">
                <div className="mb-4">
                  <form className="flex items-end gap-4 flex-wrap">
                    <div>
                      <label
                        htmlFor="schoolYear"
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Chọn năm học
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
                        <Select
                          value={selectedSchoolYear}
                          onChange={handleSchoolYearChange}
                          placeholder="Chọn năm học"
                          style={{ width: 200 }}
                          options={schoolYearOptions}
                        />
                      </ConfigProvider>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Đơn vị
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
                        <Select
                          value={selectedUnit}
                          onChange={setSelectedUnit}
                          style={{ width: 128 }}
                          options={[
                            { value: "all", label: "Tất cả đơn vị" },
                            { value: "L1 - H5", label: "L1 - H5" },
                            { value: "L2 - H5", label: "L2 - H5" },
                            { value: "L3 - H5", label: "L3 - H5" },
                            { value: "L4 - H5", label: "L4 - H5" },
                            { value: "L5 - H5", label: "L5 - H5" },
                            { value: "L6 - H5", label: "L6 - H5" },
                          ]}
                        />
                      </ConfigProvider>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tìm kiếm
                      </label>
                      <input
                        size="small"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tên hoặc mã sinh viên..."
                        className="bg-gray-50 dark:bg-gray-700 border w-48 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 px-3"
                      />
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedUnit("all");
                        }}
                        className="h-9 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-4 transition-colors duration-200 flex items-center mr-2"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Xóa bộ lọc
                      </button>
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
                {!loading && yearlyResults.length > 0 && (
                  <div
                    className={`grid grid-cols-1 gap-4 mb-6 ${
                      selectedSchoolYear === "all"
                        ? "md:grid-cols-4"
                        : "md:grid-cols-6"
                    }`}
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {getFilteredResults().length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSchoolYear === "all"
                          ? "Tổng số bản ghi"
                          : "Tổng số sinh viên"}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {(() => {
                          const results = getFilteredResults();
                          if (results.length === 0) return "0.00";

                          const totalGPA = results.reduce((sum, item) => {
                            return sum + (parseFloat(item.averageGrade4) || 0);
                          }, 0);

                          return (totalGPA / results.length).toFixed(2);
                        })()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSchoolYear === "all"
                          ? "GPA trung bình tất cả năm"
                          : "GPA trung bình năm"}
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {selectedSchoolYear === "all"
                          ? getFilteredResults().reduce(
                              (sum, item) => sum + (item.totalCredits || 0),
                              0
                            )
                          : getFilteredResults().filter(
                              (item) => parseFloat(item.averageGrade4) >= 3.0
                            ).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSchoolYear === "all"
                          ? "Tổng tín chỉ tất cả năm"
                          : "Sinh viên xuất sắc (GPA ≥ 3.0)"}
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {selectedSchoolYear === "all"
                          ? getFilteredResults()[
                              getFilteredResults().length - 1
                            ]?.totalDebt || 0
                          : getStudentsWithFGrade()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSchoolYear === "all"
                          ? "Tổng tín chỉ nợ hiện tại"
                          : "Sinh viên nợ môn"}
                      </div>
                    </div>
                    {selectedSchoolYear !== "all" && (
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
                    )}
                    {selectedSchoolYear !== "all" && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        {(() => {
                          const partyRating =
                            getFilteredResults()[0]?.partyRating;
                          const positionParty =
                            getFilteredResults()[0]?.positionParty;
                          const displayText =
                            positionParty === "Không"
                              ? "Chưa là Đảng viên"
                              : partyRating?.rating || "Chưa cập nhật";
                          const isSmallText =
                            displayText === "Chưa cập nhật" ||
                            displayText === "Chưa là Đảng viên";

                          return (
                            <div
                              className={`${
                                isSmallText
                                  ? "text-sm font-bold mb-2"
                                  : "text-2xl font-bold"
                              } text-orange-600 dark:text-orange-400 flex items-center justify-center h-8`}
                            >
                              {displayText}
                            </div>
                          );
                        })()}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Xếp loại Đảng viên
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="table-auto w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          ĐƠN VỊ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          HỌ VÀ TÊN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          LỚP
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          NĂM HỌC
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          GPA NĂM
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          CPA TÍCH LŨY
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TC TÍCH LŨY
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          TC NỢ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          XẾP LOẠI ĐẢNG VIÊN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                          XẾP LOẠI RÈN LUYỆN
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
                        getFilteredResults().map((item) => (
                          <tr
                            key={`${item._id}-${item.schoolYear}`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.unit || "Chưa có đơn vị"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div>
                                <div className="font-medium">
                                  {item.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Mã: {item.studentCode || "Chưa có mã SV"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.className || "Chưa có lớp"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div>
                                <div className="font-medium">
                                  {item.schoolYear}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.semesterIds?.length ||
                                    item.semesters?.length ||
                                    item.semesterCount ||
                                    0}{" "}
                                  học kỳ
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div className="font-medium text-blue-600 dark:text-blue-400">
                                {item.yearlyGPA &&
                                !isNaN(parseFloat(item.yearlyGPA))
                                  ? parseFloat(item.yearlyGPA).toFixed(2)
                                  : "0.00"}
                              </div>
                              <div className="font-medium text-purple-600 dark:text-purple-400">
                                {item.yearlyGrade10 &&
                                !isNaN(parseFloat(item.yearlyGrade10))
                                  ? parseFloat(item.yearlyGrade10).toFixed(2)
                                  : "0.00"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div className="font-medium text-green-600 dark:text-green-400">
                                {item.cumulativeGPA &&
                                !isNaN(parseFloat(item.cumulativeGPA))
                                  ? parseFloat(item.cumulativeGPA).toFixed(2)
                                  : "0.00"}
                              </div>
                              <div className="font-medium text-green-600 dark:text-green-400">
                                {item.cumulativeGrade10 &&
                                !isNaN(parseFloat(item.cumulativeGrade10))
                                  ? parseFloat(item.cumulativeGrade10).toFixed(
                                      2
                                    )
                                  : "0.00"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div className="font-medium">
                                {item.cumulativeCredit || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.totalDebt || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div className="font-medium text-orange-600 dark:text-orange-400">
                                {item.partyRating
                                  ? item.partyRating.rating
                                  : "Chưa cập nhật"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              <div className="font-medium text-purple-600 dark:text-purple-400">
                                {item.trainingRating || "Chưa cập nhật"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Xem chi tiết"
                                  onClick={() => handleViewDetail(item)}
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
                                  title="Cập nhật xếp loại"
                                  onClick={() => handleUpdateRating(item)}
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

      {/* Modal chi tiết điểm */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chi tiết điểm năm học {selectedStudent.schoolYear} -{" "}
                {selectedStudent.fullName} ({selectedStudent.studentCode})
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
                        Chi tiết các môn học năm học {studentDetail.schoolYear}
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

      {/* Modal cập nhật xếp loại */}
      {showUpdateModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cập nhật xếp loại - {selectedStudent.fullName}
              </h2>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedStudent(null);
                  setUpdateFormData({
                    partyRating: "",
                    trainingRating: "",
                    decisionNumber: "",
                  });
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
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xếp loại rèn luyện
                  </label>
                  <ConfigProvider
                    theme={{
                      algorithm: isDark
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                    }}
                  >
                    <Select
                      value={updateFormData.trainingRating}
                      onChange={(value) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          trainingRating: value,
                        }))
                      }
                      placeholder="Chọn xếp loại rèn luyện"
                      style={{ width: "100%" }}
                      options={[
                        { value: "", label: "Hãy chọn xếp loại rèn luyện" },
                        { value: "Tốt", label: "Tốt" },
                        { value: "Khá", label: "Khá" },
                        { value: "Trung bình", label: "Trung bình" },
                        { value: "Yếu", label: "Yếu" },
                      ]}
                    />
                  </ConfigProvider>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xếp loại đảng viên
                    {selectedStudent &&
                      selectedStudent.positionParty &&
                      selectedStudent.positionParty !== "Không" && (
                        <span className="text-green-600 ml-2">(Đảng viên)</span>
                      )}
                    {selectedStudent &&
                      (!selectedStudent.positionParty ||
                        selectedStudent.positionParty === "Không") && (
                        <span className="text-red-600 ml-2">
                          (Chưa là Đảng viên)
                        </span>
                      )}
                  </label>
                  <ConfigProvider
                    theme={{
                      algorithm: isDark
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                    }}
                  >
                    <Select
                      value={updateFormData.partyRating}
                      onChange={(value) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          partyRating: value,
                        }))
                      }
                      placeholder={
                        selectedStudent &&
                        selectedStudent.positionParty &&
                        selectedStudent.positionParty !== "Không"
                          ? "Chọn xếp loại đảng viên"
                          : "Chỉ cập nhật được khi là đảng viên"
                      }
                      style={{ width: "100%" }}
                      disabled={
                        !selectedStudent ||
                        !selectedStudent.positionParty ||
                        selectedStudent.positionParty === "Không"
                      }
                      options={[
                        { value: "", label: "Hãy chọn xếp loại đảng viên" },
                        {
                          value: "HTXSNV",
                          label: "Hoàn thành xuất sắc nhiệm vụ",
                        },
                        { value: "HTTNV", label: "Hoàn thành tốt nhiệm vụ" },
                        { value: "HTNV", label: "Hoàn thành nhiệm vụ" },
                        { value: "KHTNV", label: "Không hoàn thành nhiệm vụ" },
                      ]}
                    />
                  </ConfigProvider>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số quyết định
                  </label>
                  <input
                    type="text"
                    value={updateFormData.decisionNumber}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        decisionNumber: e.target.value,
                      }))
                    }
                    placeholder={
                      selectedStudent &&
                      selectedStudent.positionParty &&
                      selectedStudent.positionParty !== "Không"
                        ? "Nhập số quyết định"
                        : "Chỉ cập nhật được khi là đảng viên"
                    }
                    disabled={
                      !selectedStudent ||
                      !selectedStudent.positionParty ||
                      selectedStudent.positionParty === "Không"
                    }
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedStudent(null);
                    setUpdateFormData({
                      partyRating: "",
                      trainingRating: "",
                      decisionNumber: "",
                    });
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSubmitUpdate}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default YearlyStatistics;
