"use client";

import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { BASE_URL } from "@/configs";

export default function Home() {
  const [learningResult, setLearningResult] = useState(null);
  const [phisicalResult, setPhisicalResult] = useState(null);
  const [vacationSchedule, setVacationSchedule] = useState([]);
  const [student, setStudent] = useState(null);
  const [helpCooking, setHelpCooking] = useState([]);
  const [cutRice, setCutRice] = useState(null);
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

  const fetchPhisicalResult = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/physicalResults`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setPhisicalResult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchVacationSchedule = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/vacationScheduleByDate`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        console.log();
        setVacationSchedule(res.data);
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

  const fetchHelpCooking = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/helpCookingByDate`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setHelpCooking(res.data);
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

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchLearningResult(),
        fetchPhisicalResult(),
        fetchVacationSchedule(),
        fetchStudent(),
        fetchHelpCooking(),
        fetchCutRice(),
      ]);
      setDataIsLoaded(true);
    };

    fetchData();
  }, []);

  if (!dataIsLoaded) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 pt-20 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trang chủ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tổng quan hệ thống quản lý học viên
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/list-user" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
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
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {student?.length || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quân số
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Chỉ huy:</span>
                  <span className="font-medium">3 đồng chí</span>
                </div>
                <div className="flex justify-between">
                  <span>Học viên:</span>
                  <span className="font-medium">
                    {student?.length || 0} đồng chí
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/learning-results" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {learningResult?.learningResults || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Học tập
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Nợ môn:</span>
                  <span className="font-medium">
                    {learningResult?.studentOweSubjects} đồng chí
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Khá/Giỏi/Xuất sắc:</span>
                  <span className="font-medium">
                    {learningResult?.learningResults} đồng chí
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/physical-results" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
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
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {phisicalResult?.filter(
                    (item) =>
                      item.semester === phisicalResult[0]?.semester &&
                      (item.practise === "Khá" ||
                        item.practise === "Tốt" ||
                        item.practise === "Xuất sắc")
                  ).length || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Rèn luyện
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Học kỳ:</span>
                  <span className="font-medium">
                    {phisicalResult ? phisicalResult[0]?.semester : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đạt:</span>
                  <span className="font-medium">
                    {
                      phisicalResult?.filter(
                        (item) =>
                          item.semester === phisicalResult[0]?.semester &&
                          (item.practise === "Khá" ||
                            item.practise === "Tốt" ||
                            item.practise === "Xuất sắc")
                      ).length
                    }{" "}
                    đồng chí
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/vacation-schedules" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-rose-600 dark:text-rose-400"
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
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {vacationSchedule || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tranh thủ
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Tổng:</span>
                  <span className="font-medium">
                    {vacationSchedule} đồng chí
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày:</span>
                  <span className="font-medium">
                    {dayjs(new Date()).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/cut-rice" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {(cutRice?.breakfast || 0) +
                    (cutRice?.lunch || 0) +
                    (cutRice?.dinner || 0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Cắt cơm
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="font-medium">{cutRice?.breakfast || 0}</div>
                    <div className="text-xs">Sáng</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{cutRice?.lunch || 0}</div>
                    <div className="text-xs">Trưa</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{cutRice?.dinner || 0}</div>
                    <div className="text-xs">Tối</div>
                  </div>
                </div>
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs">{daysOfWeek[currentDayIndex]}</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/list-help-cooking" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {helpCooking || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Giúp bếp
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Tổng:</span>
                  <span className="font-medium">{helpCooking} đồng chí</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày:</span>
                  <span className="font-medium">
                    {dayjs(new Date()).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thống kê nhanh
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Tổng quân số:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(student?.length || 0) + 3} đồng chí
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Học viên:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {student?.length || 0} đồng chí
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Chỉ huy:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  3 đồng chí
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hoạt động hôm nay
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Cắt cơm:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(cutRice?.breakfast || 0) +
                    (cutRice?.lunch || 0) +
                    (cutRice?.dinner || 0)}{" "}
                  đ/c
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Giúp bếp:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {helpCooking} đ/c
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Tranh thủ:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {vacationSchedule} đ/c
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
