"use client";

import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { BASE_URL } from "@/configs";
import { Card, Row, Col, Statistic, Progress, Divider, Typography } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Home() {
  const [learningResult, setLearningResult] = useState(null);
  const [student, setStudent] = useState(null);
  const [cutRice, setCutRice] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [trainingRatings, setTrainingRatings] = useState(null);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const fetchLearningResult = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/learningResultAll`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setLearningResult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchStudent = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/students`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setStudent(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchCutRice = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/cutRiceByDate`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setCutRice(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchAchievement = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/achievementAll`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setAchievement(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTrainingRatings = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/trainingRatings`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setTrainingRatings(res.data);
      } catch (error) {
        console.log(error);
        setTrainingRatings([]);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchLearningResult(),
        fetchStudent(),
        fetchCutRice(),
        fetchAchievement(),
        fetchTrainingRatings(),
      ]);
      setDataIsLoaded(true);
    };

    fetchData();
  }, []);

  if (!dataIsLoaded) {
    return null;
  }

  const totalStudents = student?.length || 0;
  const totalPersonnel = totalStudents + 3; // +3 chỉ huy
  const learningProgress =
    totalStudents > 0
      ? ((learningResult?.learningResults || 0) / totalStudents) * 100
      : 0;

  // Tính toán dữ liệu xếp loại rèn luyện
  const getLatestSchoolYear = () => {
    if (!trainingRatings || trainingRatings.length === 0) return null;
    const schoolYears = [
      ...new Set(trainingRatings.map((item) => item.schoolYear)),
    ];
    return schoolYears.sort((a, b) => b.localeCompare(a))[0];
  };

  const getTrainingRatingStats = () => {
    if (!trainingRatings || trainingRatings.length === 0)
      return {
        total: 0,
        totalStudents: 0,
        good: 0,
        fair: 0,
        average: 0,
        poor: 0,
      };

    const latestYear = getLatestSchoolYear();
    const latestYearData = trainingRatings.filter(
      (item) => item.schoolYear === latestYear
    );

    const stats = {
      total: latestYearData.filter(
        (item) => item.trainingRating && item.trainingRating !== null
      ).length,
      totalStudents: latestYearData.length,
      good: latestYearData.filter((item) => item.trainingRating === "Tốt")
        .length,
      fair: latestYearData.filter((item) => item.trainingRating === "Khá")
        .length,
      average: latestYearData.filter(
        (item) => item.trainingRating === "Trung bình"
      ).length,
      poor: latestYearData.filter((item) => item.trainingRating === "Yếu")
        .length,
    };

    return stats;
  };

  const trainingStats = getTrainingRatingStats();
  const latestSchoolYear = getLatestSchoolYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pt-20 p-4">
        {/* Header bên trái */}
        <div className="mb-6">
          <div className="text-left">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              Dashboard Quản Lý
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Hệ thống quản lý học viên
            </p>
          </div>
        </div>

        {/* Grid Layout - 2x2 Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Card 1: Tổng quan quân số */}
            <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TeamOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      Tổng quan quân số
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      Thống kê tổng thể
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {totalPersonnel}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    tổng quân số
                  </p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                    <UserOutlined className="text-white text-sm" />
                  </div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {totalStudents}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Học viên
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-1">
                    <UserOutlined className="text-white text-sm" />
                  </div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    3
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Chỉ huy
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Kết quả học tập */}
            <Link href="/admin/learning-results" className="block">
              <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        Kết quả học tập
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">
                        {learningResult?.latestSemester
                          ? learningResult.latestSemester
                          : "Chưa có dữ liệu"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {learningResult?.learningResults || 0}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      đạt chuẩn
                    </p>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-16 h-16">
                    <svg
                      className="w-16 h-16 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200 dark:text-slate-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 40 * (1 - learningProgress / 100)
                        }`}
                        className="text-emerald-500 transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {learningProgress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {learningResult?.studentOweSubjects || 0}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Nợ môn
                    </p>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {learningResult?.learningResults || 0}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Khá/Giỏi/XS
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card 3: Lịch cắt cơm */}
            <Link href="/admin/cut-rice" className="block">
              <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <ClockCircleOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        Lịch cắt cơm
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">
                        {daysOfWeek[currentDayIndex]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      {(cutRice?.breakfast || 0) +
                        (cutRice?.lunch || 0) +
                        (cutRice?.dinner || 0)}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      tổng suất
                    </p>
                  </div>
                </div>

                {/* Meal Schedule Cards */}
                <div className="grid grid-cols-3 gap-1">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-md p-2 text-center border border-yellow-200 dark:border-yellow-800">
                    <div className="text-lg font-black text-yellow-600 dark:text-yellow-400">
                      {cutRice?.breakfast || 0}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sáng
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-md p-2 text-center border border-orange-200 dark:border-orange-800">
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      {cutRice?.lunch || 0}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Trưa
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-md p-2 text-center border border-blue-200 dark:border-blue-800">
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {cutRice?.dinner || 0}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tối
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 4: Xếp loại rèn luyện */}
            <Link href="/admin/training-rating" className="block">
              <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrophyOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        Xếp loại rèn luyện
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">
                        {latestSchoolYear
                          ? `Năm học ${latestSchoolYear}`
                          : "Chưa có dữ liệu"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      {trainingStats.total}/{trainingStats.totalStudents}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      đã đánh giá
                    </p>
                  </div>
                </div>

                {/* Training Rating Types */}
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-1">
                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {trainingStats.good}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Tốt
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {trainingStats.fair}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Khá
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {trainingStats.average}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Trung bình
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {trainingStats.poor}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Yếu
                      </p>
                    </div>
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
