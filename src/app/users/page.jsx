"use client";

import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { BASE_URL } from "@/configs";

export default function Home() {
  const [learningResult, setLearningResult] = useState(null);
  const [phisicalResult, setPhisicalResult] = useState(null);
  const [vacationSchedule, setVacationSchedule] = useState([]);
  const [achievement, setAchievement] = useState([]);
  const [helpCooking, setHelpCooking] = useState([]);
  const [commanderDutySchedule, setCommanderDutySchedule] = useState(null);
  const [semesterResults, setSemesterResults] = useState([]);
  const [tuitionFee, setTuitionFee] = useState([]);
  const [timeTable, setTimeTable] = useState([]);

  const fetchLearningResult = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/student/${decodedToken.id}/learning-information`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningResult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchSemesterResults = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(`${BASE_URL}/grade/${decodedToken.id}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setSemesterResults(res.data.semesterResults || []);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTuitionFee = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/student/${decodedToken.id}/tuition-fee`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTuitionFee(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTimeTable = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/student/${decodedToken.id}/time-table`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTimeTable(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchPhisicalResult = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/physicalResult/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setPhisicalResult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchVacationSchedule = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/vacationSchedule/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setVacationSchedule(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchAchievement = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const res = await axios.get(
          `${BASE_URL}/achievement/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setAchievement(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchHelpCooking = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/helpCooking/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setHelpCooking(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchSchedule = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/commanderDutyScheduleCurrent`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        // Lấy dữ liệu của phần tử có ngày là ngày hiện tại
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0

        const currentSchedule = res.data.find((schedule) => {
          const scheduleDate = new Date(schedule.workDay);
          scheduleDate.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0

          return scheduleDate.getTime() === currentDate.getTime();
        });

        setCommanderDutySchedule(currentSchedule);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchLearningResult();
    fetchSemesterResults();
    fetchTuitionFee();
    fetchTimeTable();
    fetchPhisicalResult();
    fetchVacationSchedule();
    fetchAchievement();
    fetchHelpCooking();
    fetchSchedule();
  }, []);

  // Tính toán thống kê
  const getLatestSemester = () => {
    if (semesterResults.length > 0) {
      const latest = semesterResults[semesterResults.length - 1];
      return {
        semester: latest.semester,
        gpa4: latest.averageGrade4?.toFixed(2) || "0.00",
        gpa10: latest.averageGrade10?.toFixed(2) || "0.00",
        credits: latest.totalCredits || 0,
        subjects: latest.subjects?.length || 0,
      };
    }
    return null;
  };

  const getUnpaidTuition = () => {
    return tuitionFee.filter(
      (fee) =>
        fee.status?.toLowerCase().includes("chưa thanh toán") ||
        fee.status?.toLowerCase().includes("chưa đóng")
    ).length;
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString("vi-VN", { weekday: "long" });
    const dayMap = {
      "Thứ Hai": "Thứ 2",
      "Thứ Ba": "Thứ 3",
      "Thứ Tư": "Thứ 4",
      "Thứ Năm": "Thứ 5",
      "Thứ Sáu": "Thứ 6",
      "Thứ Bảy": "Thứ 7",
      "Chủ Nhật": "Chủ nhật",
    };
    const todayKey = dayMap[today] || today;
    return timeTable.filter((item) => item.day === todayKey).length;
  };

  // Tính toán thống kê khen thưởng
  const getAchievementStats = () => {
    if (!achievement || !achievement.yearlyAchievements) {
      return {
        totalCount: 0,
        currentYearTitle: "Chưa có",
        latestTitle: "Chưa có",
        latestYear: "N/A",
      };
    }

    const currentYear = new Date().getFullYear();
    const currentYearAchievements = achievement.yearlyAchievements.filter(
      (item) => item.year === currentYear
    );

    const latestAchievement =
      achievement.yearlyAchievements.length > 0
        ? achievement.yearlyAchievements[
            achievement.yearlyAchievements.length - 1
          ]
        : null;

    // Lấy danh hiệu của năm hiện tại (nếu có nhiều thì lấy cái đầu tiên)
    const currentYearTitle =
      currentYearAchievements.length > 0
        ? currentYearAchievements[0].title
        : "Chưa có";

    return {
      totalCount: achievement.yearlyAchievements.length,
      currentYearTitle: currentYearTitle,
      latestTitle: latestAchievement?.title || "Chưa có",
      latestYear: latestAchievement?.year || "N/A",
    };
  };

  const latestSemester = getLatestSemester();
  const unpaidCount = getUnpaidTuition();
  const todayClasses = getTodayClasses();
  const achievementStats = getAchievementStats();

  return (
    <div className="flex">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 ml-64">
        <div className="w-full pt-20 pl-5 pr-6 mb-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tổng quan học tập và rèn luyện
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Chào mừng bạn trở lại! Đây là tổng quan về tình hình học tập và
              rèn luyện của bạn.
            </p>
          </div>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    GPA hiện tại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {latestSemester ? latestSemester.gpa4 : "0.00"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tín chỉ tích lũy
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {latestSemester ? latestSemester.credits : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Học phí chưa đóng
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {unpaidCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Lớp học hôm nay
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {todayClasses}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Các module chính */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Học tập */}
            <Link href="/users/learning-information" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  Học tập
                </h3>
                <div className="space-y-2 text-blue-800 dark:text-blue-200">
                  <div className="flex justify-between">
                    <span>GPA hiện tại:</span>
                    <span className="font-semibold">
                      {latestSemester ? latestSemester.gpa4 : "0.00"}/4.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Học kỳ - Số môn:</span>
                    <span className="font-semibold">
                      {latestSemester
                        ? `${latestSemester.semester} - ${latestSemester.subjects} môn`
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Rèn luyện */}
            <Link href="/users/phisical-result" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-orange-600 dark:text-orange-400"
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
                  </div>
                  <svg
                    className="w-6 h-6 text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">
                  Rèn luyện
                </h3>
                <div className="space-y-2 text-orange-800 dark:text-orange-200">
                  <div className="flex justify-between">
                    <span>Học kỳ:</span>
                    <span className="font-semibold">
                      {phisicalResult && phisicalResult.length > 0
                        ? phisicalResult[phisicalResult.length - 1]?.semester
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Xếp loại:</span>
                    <span className="font-semibold">
                      {phisicalResult && phisicalResult.length > 0
                        ? phisicalResult[phisicalResult.length - 1]?.practise
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Tranh thủ */}
            <Link href="/users/vacation-schedule" className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg border border-indigo-200 dark:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
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
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                  Tranh thủ
                </h3>
                <div className="space-y-2 text-indigo-800 dark:text-indigo-200">
                  <div className="flex justify-between">
                    <span>Đã đi:</span>
                    <span className="font-semibold">
                      {vacationSchedule ? vacationSchedule.length : 0} lần
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lần gần nhất:</span>
                    <span className="font-semibold">
                      {vacationSchedule?.length > 0
                        ? dayjs(
                            vacationSchedule[vacationSchedule.length - 1]
                              ?.dayoff
                          ).format("DD/MM/YYYY")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Khen thưởng */}
            <Link href="/users/achievement" className="group">
              <div className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border border-rose-200 dark:border-rose-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-rose-600 dark:text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-6 h-6 text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-2">
                  Khen thưởng
                </h3>
                <div className="space-y-2 text-rose-800 dark:text-rose-200">
                  <div className="flex justify-between">
                    <span>Tổng số:</span>
                    <span className="font-semibold">
                      {achievementStats.totalCount} lần
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Danh hiệu gần nhất:</span>
                    <span className="font-semibold text-sm">
                      {achievementStats.latestTitle}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Trực chỉ huy */}
            <Link href="/users/commander-duty-schedule" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-purple-600 dark:text-purple-400"
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
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                  Trực chỉ huy
                  {commanderDutySchedule && (
                    <span className="text-xl font-normal text-purple-700 dark:text-purple-300 ml-2">
                      {" "}
                      {dayjs(commanderDutySchedule?.workDay).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  )}
                </h3>
                <div className="space-y-2 text-purple-800 dark:text-purple-200">
                  <div className="flex justify-between">
                    <span>Tên:</span>
                    <span className="font-semibold">
                      {commanderDutySchedule
                        ? commanderDutySchedule?.fullName
                        : "Chưa có lịch trực"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chức vụ:</span>
                    <span className="font-semibold">
                      {commanderDutySchedule
                        ? commanderDutySchedule?.position
                        : "Chưa có lịch trực"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Giúp bếp */}
            <Link href="/users/help-cooking" className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Giúp bếp
                </h3>
                <div className="space-y-2 text-green-800 dark:text-green-200">
                  <div className="flex justify-between">
                    <span>Đã đi:</span>
                    <span className="font-semibold">
                      {helpCooking ? helpCooking.length : 0} lần
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lần gần nhất:</span>
                    <span className="font-semibold">
                      {helpCooking?.length > 0
                        ? dayjs(
                            helpCooking[helpCooking.length - 1]?.dayHelpCooking
                          ).format("DD/MM/YYYY")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
