"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleNotify } from "../../../components/notify";

import { BASE_URL } from "@/configs";

const Achievement = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [filterYear, setFilterYear] = useState("");
  const [filterStudentId, setFilterStudentId] = useState("");
  const [filterStudentKeyword, setFilterStudentKeyword] = useState("");
  const [filterClassId, setFilterClassId] = useState("");
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({});
  const [selectedStudentForForm, setSelectedStudentForForm] = useState(null);
  const [recommendations, setRecommendations] = useState({});

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Sử dụng API đúng cho admin
        const res = await axios.get(`${BASE_URL}/achievement/admin/students`, {
          headers: { token: `Bearer ${token}` },
        });

        // Đảm bảo res.data là mảng
        const studentsData = Array.isArray(res.data) ? res.data : [];
        console.log("Students data:", studentsData); // Debug log
        setStudents(studentsData);

        // Sử dụng achievement đã được populate từ API
        const achievementsData = {};
        for (const student of studentsData) {
          console.log("Student with achievement:", student);
          if (student.achievement) {
            achievementsData[student._id] = student.achievement;
          } else {
            // If no achievement exists, create default structure
            achievementsData[student._id] = {
              studentId: student._id,
              yearlyAchievements: [],
              totalYears: 0,
              totalAdvancedSoldier: 0,
              totalCompetitiveSoldier: 0,
              totalScientificTopics: 0,
              totalScientificInitiatives: 0,
              eligibleForMinistryReward: false,
              eligibleForNationalReward: false,
              nextYearRecommendations: {},
            };
          }
        }
        setAchievements(achievementsData);

        // Fetch recommendations for each student
        const recommendationsData = {};
        console.log(
          "Fetching recommendations for students:",
          studentsData.length
        );
        for (const student of studentsData) {
          try {
            console.log(`Fetching recommendations for student: ${student._id}`);
            const recRes = await axios.get(
              `${BASE_URL}/achievement/admin/${student._id}/recommendations`,
              {
                headers: { token: `Bearer ${token}` },
              }
            );
            console.log(`Recommendations for ${student._id}:`, recRes.data);
            recommendationsData[student._id] = recRes.data;
          } catch (error) {
            console.log(
              `Error fetching recommendations for student ${student._id}:`,
              error
            );
            recommendationsData[student._id] = { suggestions: [] };
          }
        }
        console.log("Final recommendations data:", recommendationsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (showFormAdd) {
      console.log(
        "Form opened, selectedStudentForForm:",
        selectedStudentForForm
      );
      console.log("Current addFormData:", addFormData);
    }
  }, [showFormAdd, selectedStudentForForm, addFormData]);

  const handleAddYearlyAchievement = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Selected student:", selectedStudentForForm);
    console.log("Form data:", addFormData);

    if (!selectedStudentForForm) {
      handleNotify("danger", "Lỗi!", "Vui lòng chọn học viên");
      return;
    }

    // Validation form data
    if (!addFormData.year) {
      handleNotify("danger", "Lỗi!", "Vui lòng nhập năm");
      return;
    }

    if (!addFormData.decisionNumber) {
      handleNotify("danger", "Lỗi!", "Vui lòng nhập số quyết định");
      return;
    }

    if (!addFormData.decisionDate) {
      handleNotify("danger", "Lỗi!", "Vui lòng nhập ngày quyết định");
      return;
    }

    if (!addFormData.title) {
      handleNotify("danger", "Lỗi!", "Vui lòng chọn danh hiệu");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      console.log(
        "Adding achievement for student:",
        selectedStudentForForm._id
      );
      console.log("Form data:", addFormData);

      const response = await axios.post(
        `${BASE_URL}/achievement/admin/${selectedStudentForForm._id}`,
        addFormData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      console.log("Response:", response.data);
      const message = response.data.message || "Thêm khen thưởng thành công";
      handleNotify("success", "Thành công!", message);
      setShowFormAdd(false);
      setAddFormData({});
      setSelectedStudentForForm(null);

      // Refresh toàn bộ danh sách students để lấy achievement mới
      fetchStudents();
    } catch (error) {
      console.error("Error adding achievement:", error);
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const handleUpdateYearlyAchievement = async (e, studentId, year) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/achievement/admin/${studentId}/${year}`,
        editFormData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      handleNotify("success", "Thành công!", "Cập nhật khen thưởng thành công");
      setShowFormEdit(false);
      setEditFormData({});
      fetchStudents();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const handleDeleteYearlyAchievement = async (studentId, year) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/achievement/admin/${studentId}/${year}`, {
        headers: { token: `Bearer ${token}` },
      });
      handleNotify("success", "Thành công!", "Xóa khen thưởng thành công");
      fetchStudents();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const getTitleDisplay = (title) => {
    return title || "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getScientificResearchDisplay = (achievement) => {
    if (!achievement || !achievement.scientific) return "Chưa có";

    const { topics, initiatives } = achievement.scientific;

    if (topics && topics.length > 0) {
      const topic = topics[0];
      const statusText =
        topic.status === "approved"
          ? "Đã duyệt"
          : topic.status === "rejected"
          ? "Từ chối"
          : "Chờ duyệt";
      return `Đề tài: ${topic.title || "N/A"} (${statusText})`;
    }

    if (initiatives && initiatives.length > 0) {
      const initiative = initiatives[0];
      const statusText =
        initiative.status === "approved"
          ? "Đã duyệt"
          : initiative.status === "rejected"
          ? "Từ chối"
          : "Chờ duyệt";
      return `Sáng kiến: ${initiative.title || "N/A"} (${statusText})`;
    }

    return "Chưa có";
  };

  const getRewardsDisplay = (achievement) => {
    if (!achievement) return "-";

    const rewards = [];

    if (achievement.hasMinistryReward) {
      rewards.push("🏆 BK BQP");
    }

    if (achievement.hasNationalReward) {
      rewards.push("🥇 CSTĐ TQ");
    }

    if (rewards.length === 0) {
      return "Chưa có";
    }

    return rewards.join(", ");
  };

  // Kiểm tra điều kiện chọn bằng khen Bộ Quốc Phòng
  const canSelectMinistryReward = () => {
    // Cần ít nhất 2 năm chiến sĩ thi đua liên tiếp + có đề tài/sáng kiến đã duyệt
    if (!selectedStudentForForm) return false;

    const achievement = achievements[selectedStudentForForm._id];
    if (!achievement) return false;

    // Kiểm tra đã nhận bằng khen Bộ Quốc Phòng chưa
    const hasMinistryReward = achievement.yearlyAchievements?.some(
      (ya) => ya.hasMinistryReward
    );
    if (hasMinistryReward) return false; // Đã nhận rồi thì không cho chọn nữa

    // Kiểm tra có ít nhất 2 năm chiến sĩ thi đua liên tiếp
    const competitiveYears =
      achievement.yearlyAchievements
        ?.filter((ya) => ya.title === "Chiến sĩ thi đua")
        ?.map((ya) => ya.year)
        ?.sort((a, b) => a - b) || [];

    if (competitiveYears.length < 2) return false;

    // Kiểm tra có chuỗi liên tiếp 2 năm
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let consecutiveStartYear = 0;
    for (let i = 0; i < competitiveYears.length; i++) {
      if (i === 0 || competitiveYears[i] === competitiveYears[i - 1] + 1) {
        if (currentConsecutive === 0) {
          consecutiveStartYear = competitiveYears[i];
        }
        currentConsecutive++;
      } else {
        currentConsecutive = 1;
        consecutiveStartYear = competitiveYears[i];
      }
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
      }
    }

    if (maxConsecutive < 2) return false;

    // Kiểm tra năm hiện tại có phải là năm thứ 2 của chuỗi không
    const currentYear = new Date().getFullYear();
    const secondYearOfStreak = consecutiveStartYear + 1;
    if (currentYear < secondYearOfStreak) return false; // Chưa đến năm thứ 2

    // Kiểm tra có đề tài/sáng kiến đã duyệt
    let hasApprovedScientific = false;
    achievement.yearlyAchievements?.forEach((ya) => {
      if (ya.scientific) {
        // Kiểm tra đề tài đã duyệt
        if (
          ya.scientific.topics?.some((topic) => topic.status === "approved")
        ) {
          hasApprovedScientific = true;
        }
        // Kiểm tra sáng kiến đã duyệt
        if (
          ya.scientific.initiatives?.some(
            (initiative) => initiative.status === "approved"
          )
        ) {
          hasApprovedScientific = true;
        }
      }
    });

    return hasApprovedScientific;
  };

  // Kiểm tra điều kiện chọn bằng khen toàn quân
  const canSelectNationalReward = () => {
    // Cần ít nhất 3 năm chiến sĩ thi đua liên tiếp + có đề tài/sáng kiến đã duyệt
    if (!selectedStudentForForm) return false;

    const achievement = achievements[selectedStudentForForm._id];
    if (!achievement) return false;

    // Kiểm tra đã nhận bằng khen toàn quân chưa
    const hasNationalReward = achievement.yearlyAchievements?.some(
      (ya) => ya.hasNationalReward
    );
    if (hasNationalReward) return false; // Đã nhận rồi thì không cho chọn nữa

    // Kiểm tra có ít nhất 3 năm chiến sĩ thi đua liên tiếp
    const competitiveYears =
      achievement.yearlyAchievements
        ?.filter((ya) => ya.title === "Chiến sĩ thi đua")
        ?.map((ya) => ya.year)
        ?.sort((a, b) => a - b) || [];

    if (competitiveYears.length < 3) return false;

    // Kiểm tra có chuỗi liên tiếp 3 năm
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let consecutiveStartYear = 0;
    for (let i = 0; i < competitiveYears.length; i++) {
      if (i === 0 || competitiveYears[i] === competitiveYears[i - 1] + 1) {
        if (currentConsecutive === 0) {
          consecutiveStartYear = competitiveYears[i];
        }
        currentConsecutive++;
      } else {
        currentConsecutive = 1;
        consecutiveStartYear = competitiveYears[i];
      }
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
      }
    }

    if (maxConsecutive < 3) return false;

    // Kiểm tra năm hiện tại có phải là năm thứ 3 của chuỗi không
    const currentYear = new Date().getFullYear();
    const thirdYearOfStreak = consecutiveStartYear + 2;
    if (currentYear < thirdYearOfStreak) return false; // Chưa đến năm thứ 3

    // Kiểm tra có đề tài/sáng kiến đã duyệt
    let hasApprovedScientific = false;
    achievement.yearlyAchievements?.forEach((ya) => {
      if (ya.scientific) {
        // Kiểm tra đề tài đã duyệt
        if (
          ya.scientific.topics?.some((topic) => topic.status === "approved")
        ) {
          hasApprovedScientific = true;
        }
        // Kiểm tra sáng kiến đã duyệt
        if (
          ya.scientific.initiatives?.some(
            (initiative) => initiative.status === "approved"
          )
        ) {
          hasApprovedScientific = true;
        }
      }
    });

    return hasApprovedScientific;
  };

  return (
    <>
      <div className="flex">
        <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="w-full pt-20 pl-5">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    href="/admin"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                    <div className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      Quản lý khen thưởng học viên
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 pt-2 dark:text-white text-lg">
                  QUẢN LÝ KHEN THƯỞNG THEO HỌC VIÊN
                </div>
                <div className="flex space-x-2">
                  <Link
                    href="/admin/achievement/statistics"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Xem thống kê
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedStudentForForm(null);
                      setShowFormAdd(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    + Thêm khen thưởng
                  </button>
                </div>
              </div>

              <div className="p-5">
                {/* Debug info */}
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Tổng số học viên: {students ? students.length : 0}
                </div>

                {/* Form tìm kiếm */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Tìm theo năm
                      </label>
                      <input
                        type="number"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        placeholder="VD: 2024"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Tìm học viên
                      </label>
                      <input
                        type="text"
                        value={filterStudentKeyword}
                        onChange={(e) => {
                          setFilterStudentKeyword(e.target.value);
                          setFilterStudentId("");
                        }}
                        placeholder="Nhập tên để tìm..."
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        list="student-suggestions"
                      />
                      <datalist id="student-suggestions">
                        {students
                          .filter((s) =>
                            filterStudentKeyword
                              ? s.fullName
                                  .toLowerCase()
                                  .includes(filterStudentKeyword.toLowerCase())
                              : true
                          )
                          .slice(0, 10)
                          .map((s) => (
                            <option key={s._id} value={s.fullName} />
                          ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Chọn đơn vị
                      </label>
                      <select
                        value={filterClassId}
                        onChange={(e) => setFilterClassId(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Tất cả</option>
                        <option value="L1 - H5">L1 - H5</option>
                        <option value="L2 - H5">L2 - H5</option>
                        <option value="L3 - H5">L3 - H5</option>
                        <option value="L4 - H5">L4 - H5</option>
                        <option value="L5 - H5">L5 - H5</option>
                        <option value="L6 - H5">L6 - H5</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // kích hoạt re-render theo filter hiện có
                          setFilterYear(String(filterYear || ""));
                          setFilterStudentId(String(filterStudentId || ""));
                        }}
                        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Tìm kiếm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterYear("");
                          setFilterStudentId("");
                          setFilterStudentKeyword("");
                          setFilterClassId("");
                        }}
                        className="h-10 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Đặt lại
                      </button>
                    </div>
                  </div>
                </div>

                {students && students.length > 0 ? (
                  <div className="space-y-6">
                    {students
                      .filter((s) =>
                        filterStudentId
                          ? s._id === filterStudentId
                          : filterStudentKeyword
                          ? s.fullName
                              .toLowerCase()
                              .includes(filterStudentKeyword.toLowerCase())
                          : true
                      )
                      .filter((s) =>
                        !filterClassId
                          ? true
                          : (s.unit || "")
                              .toLowerCase()
                              .includes(filterClassId.toLowerCase())
                      )
                      .map((student) => {
                        const achievement = achievements[student._id] || {
                          yearlyAchievements: [],
                          totalYears: 0,
                          totalAdvancedSoldier: 0,
                          totalCompetitiveSoldier: 0,
                          totalScientificTopics: 0,
                          totalScientificInitiatives: 0,
                          eligibleForMinistryReward: false,
                          eligibleForNationalReward: false,
                          nextYearRecommendations: {},
                        };
                        const rows = Array.isArray(
                          achievement.yearlyAchievements
                        )
                          ? achievement.yearlyAchievements
                              .filter((ya) =>
                                filterYear
                                  ? String(ya.year) === String(filterYear)
                                  : true
                              )
                              .slice()
                              .sort((a, b) => (a.year || 0) - (b.year || 0))
                          : [];

                        return (
                          <div
                            key={student._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {student?.fullName || "Không có tên"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {student?.unit || "Không có đơn vị"} -{" "}
                                  {student?.studentId || "Không có mã"}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/achievement/${student._id}`}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
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
                                </Link>
                                <button
                                  onClick={() => {
                                    setSelectedStudentForForm(student);
                                    setShowFormAdd(true);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  + Thêm khen thưởng
                                </button>
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm text-center">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                  <tr>
                                    <th className="border px-3 py-2 text-center">
                                      Năm
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Số quyết định
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Ngày quyết định
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Danh hiệu
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Nghiên cứu khoa học
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Bằng khen
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Ghi chú
                                    </th>
                                    <th className="border px-3 py-2 text-center">
                                      Thao tác
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rows && rows.length > 0 ? (
                                    rows.map((ya, index) => {
                                      console.log(
                                        "Rendering yearly achievement:",
                                        ya
                                      );
                                      return (
                                        <tr
                                          key={index}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                          <td className="border px-3 py-2">
                                            {ya.year || "-"}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {ya.decisionNumber || "-"}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {formatDate(ya.decisionDate)}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {ya.title
                                              ? getTitleDisplay(ya.title)
                                              : "-"}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {getScientificResearchDisplay(ya)}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {getRewardsDisplay(ya)}
                                          </td>
                                          <td className="border px-3 py-2">
                                            {ya.notes || "-"}
                                          </td>
                                          <td className="border px-3 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                              <Link
                                                href={`/admin/achievement/${student._id}`}
                                                className="text-green-600 hover:text-green-800 p-1"
                                                title="Xem chi tiết"
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
                                              </Link>
                                              <button
                                                onClick={() => {
                                                  setEditFormData(ya);
                                                  setSelectedStudentForForm(
                                                    student
                                                  );
                                                  setShowFormEdit(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1"
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
                                                onClick={() =>
                                                  handleDeleteYearlyAchievement(
                                                    student._id,
                                                    ya.year
                                                  )
                                                }
                                                className="text-red-600 hover:text-red-800 p-1"
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
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                      <td className="border px-3 py-2 text-center text-gray-400">
                                        -
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Hiển thị suggestions */}
                            {(() => {
                              console.log(
                                `Checking suggestions for student ${student._id}:`,
                                recommendations[student._id]
                              );
                              return recommendations[student._id]
                                ?.suggestions &&
                                recommendations[student._id].suggestions
                                  .length > 0 ? (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    💡 Đề xuất khen thưởng:
                                  </h4>
                                  <ul className="space-y-1">
                                    {recommendations[
                                      student._id
                                    ].suggestions.map((suggestion, index) => (
                                      <li
                                        key={index}
                                        className="text-sm text-blue-700 dark:text-blue-300 flex items-start"
                                      >
                                        <span className="mr-2">•</span>
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        Không có dữ liệu học viên
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {students === null || students === undefined
                          ? "Đang tải dữ liệu..."
                          : "Không tìm thấy học viên nào trong hệ thống"}
                      </p>
                      <button
                        onClick={fetchStudents}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form thêm khen thưởng */}
          {showFormAdd && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pt-16">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedStudentForForm
                      ? `Thêm khen thưởng cho ${selectedStudentForForm.fullName}`
                      : "Thêm khen thưởng"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormAdd(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddYearlyAchievement} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cột trái - Thông tin khen thưởng */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                        Thông tin khen thưởng
                      </h3>

                      {!selectedStudentForForm && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Chọn học viên
                          </label>
                          <select
                            value={selectedStudentForForm?._id || ""}
                            onChange={(e) => {
                              const student = students.find(
                                (s) => s._id === e.target.value
                              );
                              setSelectedStudentForForm(student);
                            }}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          >
                            <option value="">Chọn học viên</option>
                            {students.map((student) => (
                              <option key={student._id} value={student._id}>
                                {student.fullName} - {student.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Năm
                        </label>
                        <input
                          type="number"
                          value={addFormData.year || ""}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              year: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Số quyết định
                        </label>
                        <input
                          type="text"
                          value={addFormData.decisionNumber || ""}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              decisionNumber: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Ngày quyết định
                        </label>
                        <input
                          type="date"
                          value={addFormData.decisionDate || ""}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              decisionDate: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Danh hiệu
                        </label>
                        <select
                          value={addFormData.title || ""}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Chọn danh hiệu</option>
                          <option value="Chiến sĩ tiên tiến">
                            Chiến sĩ tiên tiến
                          </option>
                          <option value="Chiến sĩ thi đua">
                            Chiến sĩ thi đua
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Bằng khen
                        </label>
                        <select
                          value={
                            addFormData.hasMinistryReward
                              ? "bằng khen bộ quốc phòng"
                              : addFormData.hasNationalReward
                              ? "bằng khen toàn quân"
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setAddFormData({
                              ...addFormData,
                              hasMinistryReward:
                                value === "bằng khen bộ quốc phòng",
                              hasNationalReward:
                                value === "bằng khen toàn quân",
                            });
                          }}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Không có bằng khen</option>
                          <option
                            value="bằng khen bộ quốc phòng"
                            disabled={!canSelectMinistryReward()}
                          >
                            🏆 Bằng khen Bộ Quốc Phòng
                            {!canSelectMinistryReward() &&
                              " (Chưa đủ điều kiện)"}
                          </option>
                          <option
                            value="bằng khen toàn quân"
                            disabled={!canSelectNationalReward()}
                          >
                            🥇 Bằng khen toàn quân
                            {!canSelectNationalReward() &&
                              " (Chưa đủ điều kiện)"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Cột phải - Nghiên cứu khoa học */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                        Nghiên cứu khoa học
                      </h3>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Loại khoa học
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="scientificType"
                              value="none"
                              checked={
                                !addFormData.scientific?.topics?.length &&
                                !addFormData.scientific?.initiatives?.length
                              }
                              onChange={() =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    topics: [],
                                    initiatives: [],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Không có
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="scientificType"
                              value="topic"
                              checked={
                                addFormData.scientific?.topics?.length > 0
                              }
                              onChange={() =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    topics: [
                                      {
                                        title: "",
                                        description: "",
                                        year:
                                          parseInt(addFormData.year) ||
                                          new Date().getFullYear(),
                                        status: "pending",
                                      },
                                    ],
                                    initiatives: [],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Đề tài khoa học
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="scientificType"
                              value="initiative"
                              checked={
                                addFormData.scientific?.initiatives?.length > 0
                              }
                              onChange={() =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    topics: [],
                                    initiatives: [
                                      {
                                        title: "",
                                        description: "",
                                        year:
                                          parseInt(addFormData.year) ||
                                          new Date().getFullYear(),
                                        status: "pending",
                                      },
                                    ],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Sáng kiến khoa học
                            </span>
                          </label>
                        </div>
                      </div>

                      {addFormData.scientific?.topics?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Đề tài khoa học
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Tên đề tài khoa học"
                              value={
                                addFormData.scientific?.topics?.[0]?.title || ""
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    topics: [
                                      {
                                        ...addFormData.scientific.topics[0],
                                        title: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <textarea
                              placeholder="Mô tả đề tài"
                              value={
                                addFormData.scientific?.topics?.[0]
                                  ?.description || ""
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    topics: [
                                      {
                                        ...addFormData.scientific.topics[0],
                                        description: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              rows="5"
                            />
                            <select
                              value={
                                addFormData.scientific?.topics?.[0]?.status ||
                                "pending"
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    topics: [
                                      {
                                        ...addFormData.scientific.topics[0],
                                        status: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="pending">Chờ duyệt</option>
                              <option value="approved">Đã duyệt</option>
                              <option value="rejected">Từ chối</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {addFormData.scientific?.initiatives?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Sáng kiến khoa học
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Tên sáng kiến khoa học"
                              value={
                                addFormData.scientific?.initiatives?.[0]
                                  ?.title || ""
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    initiatives: [
                                      {
                                        ...addFormData.scientific
                                          .initiatives[0],
                                        title: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <textarea
                              placeholder="Mô tả sáng kiến"
                              value={
                                addFormData.scientific?.initiatives?.[0]
                                  ?.description || ""
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    initiatives: [
                                      {
                                        ...addFormData.scientific
                                          .initiatives[0],
                                        description: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              rows="5"
                            />
                            <select
                              value={
                                addFormData.scientific?.initiatives?.[0]
                                  ?.status || "pending"
                              }
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  scientific: {
                                    ...addFormData.scientific,
                                    initiatives: [
                                      {
                                        ...addFormData.scientific
                                          .initiatives[0],
                                        status: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="pending">Chờ duyệt</option>
                              <option value="approved">Đã duyệt</option>
                              <option value="rejected">Từ chối</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ghi chú - 1 hàng ngang dài bằng 2 cột */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Ghi chú
                    </label>
                    <textarea
                      value={addFormData.notes || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormAdd(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Form chỉnh sửa khen thưởng */}
          {showFormEdit && selectedStudentForForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pt-16 ">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chỉnh sửa khen thưởng cho {selectedStudentForForm.fullName}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormEdit(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={(e) =>
                    handleUpdateYearlyAchievement(
                      e,
                      selectedStudentForForm._id,
                      editFormData.year
                    )
                  }
                  className="p-4"
                >
                  {/* Layout 2 cột */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Cột trái - Thông tin cơ bản */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                        Thông tin cơ bản
                      </h3>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Học viên
                        </label>
                        <input
                          type="text"
                          value={selectedStudentForForm?.fullName || ""}
                          disabled
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Năm
                        </label>
                        <input
                          type="number"
                          value={editFormData.year || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              year: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Số quyết định
                        </label>
                        <input
                          type="text"
                          value={editFormData.decisionNumber || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              decisionNumber: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Ngày quyết định
                        </label>
                        <input
                          type="date"
                          value={
                            editFormData.decisionDate
                              ? new Date(editFormData.decisionDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              decisionDate: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Danh hiệu
                        </label>
                        <select
                          value={editFormData.title || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Chọn danh hiệu</option>
                          <option value="Chiến sĩ tiên tiến">
                            Chiến sĩ tiên tiến
                          </option>
                          <option value="Chiến sĩ thi đua">
                            Chiến sĩ thi đua
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Bằng khen
                        </label>
                        <select
                          value={
                            editFormData.hasMinistryReward
                              ? "bằng khen bộ quốc phòng"
                              : editFormData.hasNationalReward
                              ? "bằng khen toàn quân"
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditFormData({
                              ...editFormData,
                              hasMinistryReward:
                                value === "bằng khen bộ quốc phòng",
                              hasNationalReward:
                                value === "bằng khen toàn quân",
                            });
                          }}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Không có bằng khen</option>
                          <option
                            value="bằng khen bộ quốc phòng"
                            disabled={!canSelectMinistryReward()}
                          >
                            🏆 Bằng khen Bộ Quốc Phòng
                            {!canSelectMinistryReward() &&
                              " (Chưa đủ điều kiện)"}
                          </option>
                          <option
                            value="bằng khen toàn quân"
                            disabled={!canSelectNationalReward()}
                          >
                            🥇 Bằng khen toàn quân
                            {!canSelectNationalReward() &&
                              " (Chưa đủ điều kiện)"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Cột phải - Nghiên cứu khoa học */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                        Nghiên cứu khoa học
                      </h3>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Loại khoa học
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="editScientificType"
                              value="none"
                              checked={
                                !editFormData.scientific?.topics?.length &&
                                !editFormData.scientific?.initiatives?.length
                              }
                              onChange={() =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    topics: [],
                                    initiatives: [],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Không có
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="editScientificType"
                              value="topic"
                              checked={
                                editFormData.scientific?.topics?.length > 0
                              }
                              onChange={() =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    topics: [
                                      {
                                        title: "",
                                        description: "",
                                        year:
                                          parseInt(editFormData.year) ||
                                          new Date().getFullYear(),
                                        status: "pending",
                                      },
                                    ],
                                    initiatives: [],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Đề tài khoa học
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="editScientificType"
                              value="initiative"
                              checked={
                                editFormData.scientific?.initiatives?.length > 0
                              }
                              onChange={() =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    topics: [],
                                    initiatives: [
                                      {
                                        title: "",
                                        description: "",
                                        year:
                                          parseInt(editFormData.year) ||
                                          new Date().getFullYear(),
                                        status: "pending",
                                      },
                                    ],
                                  },
                                })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Sáng kiến khoa học
                            </span>
                          </label>
                        </div>
                      </div>

                      {editFormData.scientific?.topics?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Đề tài khoa học
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Tên đề tài khoa học"
                              value={
                                editFormData.scientific?.topics?.[0]?.title ||
                                ""
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    topics: [
                                      {
                                        ...editFormData.scientific.topics[0],
                                        title: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <textarea
                              placeholder="Mô tả đề tài"
                              value={
                                editFormData.scientific?.topics?.[0]
                                  ?.description || ""
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    topics: [
                                      {
                                        ...editFormData.scientific.topics[0],
                                        description: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              rows="5"
                            />
                            <select
                              value={
                                editFormData.scientific?.topics?.[0]?.status ||
                                "pending"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    topics: [
                                      {
                                        ...editFormData.scientific.topics[0],
                                        status: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="pending">Chờ duyệt</option>
                              <option value="approved">Đã duyệt</option>
                              <option value="rejected">Từ chối</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {editFormData.scientific?.initiatives?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Sáng kiến khoa học
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Tên sáng kiến khoa học"
                              value={
                                editFormData.scientific?.initiatives?.[0]
                                  ?.title || ""
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    initiatives: [
                                      {
                                        ...editFormData.scientific
                                          .initiatives[0],
                                        title: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <textarea
                              placeholder="Mô tả sáng kiến"
                              value={
                                editFormData.scientific?.initiatives?.[0]
                                  ?.description || ""
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    initiatives: [
                                      {
                                        ...editFormData.scientific
                                          .initiatives[0],
                                        description: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              rows="5"
                            />
                            <select
                              value={
                                editFormData.scientific?.initiatives?.[0]
                                  ?.status || "pending"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  scientific: {
                                    ...editFormData.scientific,
                                    initiatives: [
                                      {
                                        ...editFormData.scientific
                                          .initiatives[0],
                                        status: e.target.value,
                                      },
                                    ],
                                  },
                                })
                              }
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="pending">Chờ duyệt</option>
                              <option value="approved">Đã duyệt</option>
                              <option value="rejected">Từ chối</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ghi chú - 1 hàng ngang dài bằng 2 cột */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Ghi chú
                    </label>
                    <textarea
                      value={editFormData.notes || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormEdit(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Achievement;
