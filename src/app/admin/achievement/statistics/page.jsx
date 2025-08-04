"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleNotify } from "../../../../components/notify";
import { BASE_URL } from "@/configs";

const AchievementStatistics = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [loading, setLoading] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({});
  const [selectedStudentForForm, setSelectedStudentForForm] = useState(null);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    studentsWithAchievements: 0,
    totalAchievements: 0,
    totalAdvancedSoldier: 0,
    totalCompetitiveSoldier: 0,
    totalScientificTopics: 0,
    totalScientificInitiatives: 0,
    eligibleForMinistryReward: 0,
    eligibleForNationalReward: 0,
  });

  const fetchStudentsAndAchievements = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/students`, {
          headers: { token: `Bearer ${token}` },
        });
        setStudents(res.data);

        // Fetch achievements for all students
        const achievementsData = {};
        let totalAchievements = 0;
        let totalAdvancedSoldier = 0;
        let totalCompetitiveSoldier = 0;
        let totalScientificTopics = 0;
        let totalScientificInitiatives = 0;
        let eligibleForMinistryReward = 0;
        let eligibleForNationalReward = 0;
        let studentsWithAchievements = 0;

        for (const student of res.data) {
          try {
            const achievementRes = await axios.get(
              `${BASE_URL}/achievement/${student._id}`,
              {
                headers: { token: `Bearer ${token}` },
              }
            );
            const achievement = achievementRes.data;
            achievementsData[student._id] = achievement;

            if (achievement.yearlyAchievements.length > 0) {
              studentsWithAchievements++;
              totalAchievements += achievement.totalYears;
              totalAdvancedSoldier += achievement.totalAdvancedSoldier;
              totalCompetitiveSoldier += achievement.totalCompetitiveSoldier;
              totalScientificTopics += achievement.totalScientificTopics;
              totalScientificInitiatives +=
                achievement.totalScientificInitiatives;

              if (achievement.eligibleForMinistryReward) {
                eligibleForMinistryReward++;
              }
              if (achievement.eligibleForNationalReward) {
                eligibleForNationalReward++;
              }
            }
          } catch (error) {
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
        setStatistics({
          totalStudents: res.data.length,
          studentsWithAchievements,
          totalAchievements,
          totalAdvancedSoldier,
          totalCompetitiveSoldier,
          totalScientificTopics,
          totalScientificInitiatives,
          eligibleForMinistryReward,
          eligibleForNationalReward,
        });
      } catch (error) {
        console.log("Error fetching statistics:", error.message || error);
        handleNotify("danger", "Lỗi!", "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShowStatistics = async () => {
    setLoading(true);
    setShowStatistics(true);
    await fetchStudentsAndAchievements();
  };

  const handleAddYearlyAchievement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASE_URL}/achievement/admin/${selectedStudentForForm._id}`,
        addFormData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      handleNotify("success", "Thành công!", "Thêm khen thưởng thành công");
      setShowFormAdd(false);
      setAddFormData({});
      setSelectedStudentForForm(null);
      fetchStudentsAndAchievements();
    } catch (error) {
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
      fetchStudentsAndAchievements();
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
      fetchStudentsAndAchievements();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const getTitleDisplay = (title) => {
    const titleMap = {
      "chiến sĩ tiên tiến": "Chiến sĩ tiên tiến",
      "chiến sĩ thi đua": "Chiến sĩ thi đua",
    };
    return titleMap[title] || title;
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1">
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
                    <Link
                      href="/admin/achievement"
                      className="ms-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      Quản lý khen thưởng
                    </Link>
                  </div>
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
                      Thống kê khen thưởng
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
                  THỐNG KÊ KHEN THƯỞNG TỔNG QUAN
                </div>
                <div className="flex space-x-2">
                  {!showStatistics && (
                    <button
                      onClick={handleShowStatistics}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Xem thống kê
                    </button>
                  )}
                  {showStatistics && (
                    <button
                      onClick={() => {
                        setSelectedStudentForForm(null);
                        setShowFormAdd(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      + Thêm khen thưởng
                    </button>
                  )}
                  <Link
                    href="/admin/achievement"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    ← Quay lại
                  </Link>
                </div>
              </div>

              {/* Thống kê tổng quan */}
              {!showStatistics ? (
                <div className="p-5 text-center">
                  <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    Bấm nút "Xem thống kê" để hiển thị thống kê tổng quan
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                    Thống kê tổng quan
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {statistics.totalStudents}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng học viên
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {statistics.studentsWithAchievements}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Có khen thưởng
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                        {statistics.totalAchievements}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng khen thưởng
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {statistics.totalAdvancedSoldier}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Chiến sĩ tiên tiến
                      </div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {statistics.totalCompetitiveSoldier}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Chiến sĩ thi đua
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-pink-50 dark:bg-pink-900 rounded-lg">
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                        {statistics.totalScientificTopics}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Đề tài khoa học
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {statistics.totalScientificInitiatives}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sáng kiến khoa học
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {statistics.eligibleForMinistryReward}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Đủ điều kiện BQP
                      </div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 dark:bg-teal-900 rounded-lg">
                      <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                        {statistics.eligibleForNationalReward}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Đủ điều kiện toàn quân
                      </div>
                    </div>
                  </div>

                  {/* Tỷ lệ phần trăm */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Tỷ lệ phần trăm
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Học viên có khen thưởng
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {statistics.totalStudents > 0
                              ? (
                                  (statistics.studentsWithAchievements /
                                    statistics.totalStudents) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                statistics.totalStudents > 0
                                  ? (statistics.studentsWithAchievements /
                                      statistics.totalStudents) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Đủ điều kiện BQP
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {statistics.studentsWithAchievements > 0
                              ? (
                                  (statistics.eligibleForMinistryReward /
                                    statistics.studentsWithAchievements) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${
                                statistics.studentsWithAchievements > 0
                                  ? (statistics.eligibleForMinistryReward /
                                      statistics.studentsWithAchievements) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách tất cả học viên */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Danh sách tất cả học viên
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="border px-3 py-2 text-center">
                              Tên học viên
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Mã học viên
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Đơn vị
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Trạng thái khen thưởng
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {students && students.length > 0 ? (
                            students.map((student) => {
                              const achievement = achievements[student._id];
                              const hasAchievements =
                                achievement &&
                                achievement.yearlyAchievements.length > 0;

                              return (
                                <tr
                                  key={student._id}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <td className="border px-3 py-2 text-center">
                                    {student.fullName || "Không có tên"}
                                  </td>
                                  <td className="border px-3 py-2 text-center">
                                    {student.studentId || "Không có mã"}
                                  </td>
                                  <td className="border px-3 py-2 text-center">
                                    {student.unit || "Không có đơn vị"}
                                  </td>
                                  <td className="border px-3 py-2 text-center">
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        hasAchievements
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                      }`}
                                    >
                                      {hasAchievements
                                        ? "Có khen thưởng"
                                        : "Chưa có khen thưởng"}
                                    </span>
                                  </td>
                                  <td className="border px-3 py-2 text-center">
                                    <div className="flex flex-col space-y-1">
                                      <Link
                                        href={`/admin/achievement/${student._id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center mx-auto w-fit"
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
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                        Quản lý khen thưởng
                                      </Link>
                                      <button
                                        onClick={() => {
                                          setSelectedStudentForForm(student);
                                          setShowFormAdd(true);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center mx-auto w-fit"
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
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                          />
                                        </svg>
                                        Thêm khen thưởng
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                className="border px-3 py-2 text-center text-gray-400"
                                colSpan="5"
                              >
                                Không có dữ liệu học viên
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Danh sách học viên có khen thưởng */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Danh sách học viên có khen thưởng
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="border px-3 py-2 text-center">
                              Tên học viên
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Mã học viên
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Đơn vị
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Tổng năm
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Chiến sĩ tiên tiến
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Chiến sĩ thi đua
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Đủ điều kiện BQP
                            </th>
                            <th className="border px-3 py-2 text-center">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const studentsWithAchievements = students.filter(
                              (student) => {
                                const achievement = achievements[student._id];
                                return (
                                  achievement &&
                                  achievement.yearlyAchievements.length > 0
                                );
                              }
                            );

                            if (studentsWithAchievements.length > 0) {
                              return studentsWithAchievements.map((student) => {
                                const achievement = achievements[student._id];
                                return (
                                  <tr
                                    key={student._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    <td className="border px-3 py-2 text-center">
                                      {student.fullName}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      {student.studentId}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      {student.unit}
                                    </td>
                                    <td className="border px-3 py-2 text-center font-bold">
                                      {achievement.totalYears}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      {achievement.totalAdvancedSoldier}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      {achievement.totalCompetitiveSoldier}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      <span
                                        className={`px-2 py-1 rounded text-xs ${
                                          achievement.eligibleForMinistryReward
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                      >
                                        {achievement.eligibleForMinistryReward
                                          ? "✓"
                                          : "✗"}
                                      </span>
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                      <Link
                                        href={`/admin/achievement/${student._id}`}
                                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm flex items-center"
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
                                    </td>
                                  </tr>
                                );
                              });
                            } else {
                              return (
                                <tr>
                                  <td className="border px-3 py-2 text-center text-gray-400">
                                    Không có dữ liệu
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
                              );
                            }
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form thêm khen thưởng */}
          {showFormAdd && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {selectedStudentForForm
                      ? `Thêm khen thưởng cho ${selectedStudentForForm.fullName}`
                      : "Thêm khen thưởng"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormAdd(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={handleAddYearlyAchievement}
                  className="p-4 space-y-4"
                >
                  {!selectedStudentForForm && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
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
                        className="w-full p-2 border rounded-lg"
                        required
                      >
                        <option value="">Chọn học viên</option>
                        {students &&
                          students.length > 0 &&
                          students.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.fullName} - {student.unit}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Chọn danh hiệu</option>
                      <option value="chiến sĩ tiên tiến">
                        Chiến sĩ tiên tiến
                      </option>
                      <option value="chiến sĩ thi đua">Chiến sĩ thi đua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormAdd(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    Chỉnh sửa khen thưởng cho {selectedStudentForForm.fullName}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormEdit(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
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
                  className="p-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Chọn danh hiệu</option>
                      <option value="chiến sĩ tiên tiến">
                        Chiến sĩ tiên tiến
                      </option>
                      <option value="chiến sĩ thi đua">Chiến sĩ thi đua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormEdit(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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

export default AchievementStatistics;
