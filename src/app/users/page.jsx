"use client";

import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

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
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/learning-information`,
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
          `https://be-student-manager.onrender.com/commander/physicalResult/${decodedToken.id}`,
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
          `https://be-student-manager.onrender.com/commander/vacationSchedule/${decodedToken.id}`,
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
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/achievement`,
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
          `https://be-student-manager.onrender.com/commander/helpCooking/${decodedToken.id}`,
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
          `https://be-student-manager.onrender.com/user/commanderDutyScheduleCurrent`,
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
      <div className="w-full ml-64">
        <div className="w-full pt-20 pl-5 pr-6 mb-5">
          <div className="w-full">
            <div className="flex justify-between px-5 pt-5 pb-4">
              <Link href="/users/learning-information" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-blue-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">HỌC TẬP</div>
                  <div className="mt-10">
                    GPA:{" "}
                    {learningResult
                      ? learningResult[learningResult.length - 1]?.GPA
                      : ""}
                    /4.0
                  </div>
                  <div className="mt-4">
                    CPA:{" "}
                    {learningResult
                      ? learningResult[learningResult.length - 1]?.CPA
                      : ""}
                    /4.0
                  </div>
                </div>
              </Link>
              <Link href="/users/phisical-result" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-orange-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">RÈN LUYỆN</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Học kỳ:{" "}
                      {phisicalResult
                        ? phisicalResult[phisicalResult.length - 1]?.semester
                        : ""}
                    </div>
                    <div className="mt-4">
                      Xếp loại:{" "}
                      {phisicalResult
                        ? phisicalResult[phisicalResult.length - 1]?.practise
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/vacation-schedule" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-indigo-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">TRANH THỦ</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Đã đi: {vacationSchedule ? vacationSchedule.length : ""}{" "}
                      lần
                    </div>
                    <div className="mt-4">
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
                <div className="group relative h-60 rounded-3xl border bg-rose-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">
                    KHEN THƯỞNG
                  </div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Đã nhận: {achievement ? achievement.length : ""} lần
                    </div>
                    <div className="mt-4">
                      Lần gần nhất:{" "}
                      {achievement.length !== 0
                        ? achievement[achievement.length - 1]?.schoolYear
                        : "Chưa có"}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/commander-duty-schedule" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-purple-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">
                    TRỰC CHỈ HUY
                  </div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Tên:{" "}
                      {commanderDutySchedule
                        ? commanderDutySchedule?.fullName
                        : ""}
                    </div>
                    <div className="mt-4">
                      Chức vụ:{" "}
                      {commanderDutySchedule
                        ? commanderDutySchedule?.position
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/users/help-cooking" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-green-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">GIÚP BẾP</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Đã đi: {helpCooking ? helpCooking.length : ""} lần
                    </div>
                    <div className="mt-4">
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
