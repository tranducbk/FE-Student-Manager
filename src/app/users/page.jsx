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
          `${BASE_URL}/student/${decodedToken.id}/achievement`,
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
    fetchPhisicalResult();
    fetchVacationSchedule();
    fetchAchievement();
    fetchHelpCooking();
    fetchSchedule();
  }, []);

  return (
    <div className="flex">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 ml-64">
        <div className="w-full pt-20 pl-5 pr-6 mb-5">
          <div className="w-full">
            <div className="flex justify-between px-5 pt-5 pb-4">
              <Link href="/users/learning-information" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-blue-900 dark:text-blue-100">
                    HỌC TẬP
                  </div>
                  <div className="mt-10 text-blue-800 dark:text-blue-200">
                    GPA:{" "}
                    {learningResult
                      ? learningResult[learningResult.length - 1]?.GPA
                      : ""}
                    /4.0
                  </div>
                  <div className="mt-4 text-blue-800 dark:text-blue-200">
                    CPA:{" "}
                    {learningResult
                      ? learningResult[learningResult.length - 1]?.CPA
                      : ""}
                    /4.0
                  </div>
                </div>
              </Link>
              <Link href="/users/phisical-result" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-orange-900 dark:text-orange-100">
                    RÈN LUYỆN
                  </div>
                  <div className="mt-4">
                    <div className="mt-10 text-orange-800 dark:text-orange-200">
                      Học kỳ:{" "}
                      {phisicalResult
                        ? phisicalResult[phisicalResult.length - 1]?.semester
                        : ""}
                    </div>
                    <div className="mt-4 text-orange-800 dark:text-orange-200">
                      Xếp loại:{" "}
                      {phisicalResult
                        ? phisicalResult[phisicalResult.length - 1]?.practise
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/vacation-schedule" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                    TRANH THỦ
                  </div>
                  <div className="mt-4">
                    <div className="mt-10 text-indigo-800 dark:text-indigo-200">
                      Đã đi: {vacationSchedule ? vacationSchedule.length : ""}{" "}
                      lần
                    </div>
                    <div className="mt-4 text-indigo-800 dark:text-indigo-200">
                      Lần gần nhất:{" "}
                      {vacationSchedule?.length === 0
                        ? " Chưa có"
                        : dayjs(
                            vacationSchedule[vacationSchedule.length - 1]
                              ?.dayoff
                          ).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex justify-between px-5">
              <Link href="/users/achievement" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-rose-900 dark:text-rose-100">
                    KHEN THƯỞNG
                  </div>
                  <div className="mt-4">
                    <div className="mt-10 text-rose-800 dark:text-rose-200">
                      Đã nhận: {achievement ? achievement.length : ""} lần
                    </div>
                    <div className="mt-4 text-rose-800 dark:text-rose-200">
                      Lần gần nhất:{" "}
                      {achievement.length !== 0
                        ? achievement[achievement.length - 1]?.schoolYear
                        : "Chưa có"}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/commander-duty-schedule" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-purple-900 dark:text-purple-100">
                    TRỰC CHỈ HUY
                  </div>
                  <div className="mt-4">
                    <div className="mt-10 text-purple-800 dark:text-purple-200">
                      Tên:{" "}
                      {commanderDutySchedule
                        ? commanderDutySchedule?.fullName
                        : ""}
                    </div>
                    <div className="mt-4 text-purple-800 dark:text-purple-200">
                      Chức vụ:{" "}
                      {commanderDutySchedule
                        ? commanderDutySchedule?.position
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/help-cooking" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                  <div className="font-sans text-3xl font-bold text-green-900 dark:text-green-100">
                    GIÚP BẾP
                  </div>
                  <div className="mt-4">
                    <div className="mt-10 text-green-800 dark:text-green-200">
                      Đã đi: {helpCooking ? helpCooking.length : ""} lần
                    </div>
                    <div className="mt-4 text-green-800 dark:text-green-200">
                      Lần gần nhất:{" "}
                      {helpCooking?.length === 0
                        ? "Chưa có"
                        : dayjs(
                            helpCooking[helpCooking.length - 1]?.dayHelpCooking
                          ).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
