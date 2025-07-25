"use client";

import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

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
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/learningResultAll`,
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
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/physicalResults`,
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
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/vacationScheduleByDate`,
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
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/students`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

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
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/helpCookingByDate`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
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
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/cutRiceByDate`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

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
    <div className="flex">
      <div>
        <SideBar />
      </div>
      <div className="w-full ml-64">
        <div className="w-full pt-20 pl-5 pr-6 mb-5">
          <div className="w-full">
            <div className="flex justify-between px-5 pt-5 pb-4">
              <Link href="/admin/list-user" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-blue-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">QUÂN SỐ</div>
                  <div className="mt-10">Chỉ huy: 3 đồng chí</div>
                  <div className="mt-4">Học viên: {student} đồng chí </div>
                </div>
              </Link>
              <Link href="/admin/learning-results" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-orange-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">HỌC TẬP</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Nợ môn: {learningResult?.studentOweSubjects} đồng chí
                    </div>
                    <div className="mt-4">
                      Khá/Giỏi/XuấtSắc: {learningResult?.learningResults} đồng
                      chí
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/admin/physical-results" className="w-80">
                <div className="group relative mb-4 h-60 rounded-3xl border bg-indigo-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">RÈN LUYỆN</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Học kỳ:{" "}
                      {phisicalResult ? phisicalResult[0]?.semester : ""}
                    </div>
                    <div className="mt-4">
                      Đạt:{" "}
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
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex justify-between px-5">
              <Link href="/admin/vacation-schedules" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-rose-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">TRANH THỦ</div>
                  <div className="mt-4">
                    <div className="mt-10">
                      Tổng: {vacationSchedule} đồng chí
                    </div>
                    <div className="mt-4">
                      Ngày: {dayjs(new Date()).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/admin/cut-rice" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-purple-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">CẮT CƠM</div>
                  <div className="mt-4">
                    <div className="mt-10 flex justify-between">
                      <div>Sáng: {cutRice?.breakfast} đ/c</div>
                      <div>Trưa: {cutRice?.lunch} đ/c</div>
                      <div>Tối: {cutRice?.dinner} đ/c</div>
                    </div>
                    <div className="mt-4">
                      Ngày: {daysOfWeek[currentDayIndex]}
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/admin/list-help-cooking" className="w-80">
                <div className="group relative h-60 rounded-3xl border bg-green-100 pt-8 px-8 shadow-lg transition-all duration-200 ease-in-out">
                  <div className="font-sans text-3xl font-bold">GIÚP BẾP</div>
                  <div className="mt-4">
                    <div className="mt-10">Tổng: {helpCooking} đồng chí</div>
                    <div className="mt-4">
                      Ngày: {dayjs(new Date()).format("DD/MM/YYYY")}
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
