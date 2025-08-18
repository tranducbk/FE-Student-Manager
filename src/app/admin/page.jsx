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
  FireOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Home() {
  const [learningResult, setLearningResult] = useState(null);
  const [phisicalResult, setPhisicalResult] = useState(null);
  const [vacationSchedule, setVacationSchedule] = useState([]);
  const [student, setStudent] = useState(null);
  const [helpCooking, setHelpCooking] = useState([]);
  const [cutRice, setCutRice] = useState(null);
  const [achievement, setAchievement] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchLearningResult(),
        fetchPhisicalResult(),
        fetchVacationSchedule(),
        fetchStudent(),
        fetchHelpCooking(),
        fetchCutRice(),
        fetchAchievement(),
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
  const physicalProgress =
    totalStudents > 0
      ? ((phisicalResult?.filter(
          (item) =>
            item.semester === phisicalResult[0]?.semester &&
            (item.practise === "Khá" ||
              item.practise === "Tốt" ||
              item.practise === "Xuất sắc")
        ).length || 0) /
          totalStudents) *
        100
      : 0;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex-1 pt-20 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title
                level={1}
                className="text-gray-900 dark:text-white mb-2 font-black tracking-wide"
              >
                Trang tổng quan
              </Title>
              <Text className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                Tổng quan hệ thống quản lý học viên
              </Text>
            </div>
            <div className="text-right">
              <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {daysOfWeek[currentDayIndex]}
              </Text>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-wider">
                {dayjs(new Date()).format("HH:mm")}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-500 to-blue-600">
              <Statistic
                title={
                  <span className="text-white text-lg font-black tracking-wide">
                    Tổng quân số
                  </span>
                }
                value={totalPersonnel}
                valueStyle={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  letterSpacing: "0.1em",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-500 to-green-600">
              <Statistic
                title={
                  <span className="text-white text-lg font-black tracking-wide">
                    Học viên
                  </span>
                }
                value={totalStudents}
                valueStyle={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  letterSpacing: "0.1em",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-500 to-orange-600">
              <Statistic
                title={
                  <span className="text-white text-lg font-black tracking-wide">
                    Chỉ huy
                  </span>
                }
                value={3}
                valueStyle={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  letterSpacing: "0.1em",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-purple-600">
              <Statistic
                title={
                  <span className="text-white text-lg font-black tracking-wide">
                    Hoạt động hôm nay
                  </span>
                }
                value={
                  (cutRice?.breakfast || 0) +
                  (cutRice?.lunch || 0) +
                  (cutRice?.dinner || 0) +
                  (helpCooking || 0) +
                  (vacationSchedule || 0)
                }
                valueStyle={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  letterSpacing: "0.1em",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Dashboard Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={12}>
            <Link href="/admin/learning-results" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                      <BookOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Kết quả học tập
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        Học kỳ hiện tại
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-orange-600 dark:text-orange-400 tracking-wider">
                      {learningResult?.learningResults || 0}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Đạt chuẩn
                    </Text>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Tỷ lệ đạt chuẩn
                    </span>
                    <span className="font-black text-orange-600 dark:text-orange-400 tracking-wide">
                      {learningProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    percent={learningProgress}
                    strokeColor="#f97316"
                    trailColor="#e5e7eb"
                    showInfo={false}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Nợ môn
                    </div>
                    <div className="text-xl font-black text-orange-600 dark:text-orange-400 tracking-wide">
                      {learningResult?.studentOweSubjects || 0} đồng chí
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Khá/Giỏi/XS
                    </div>
                    <div className="text-xl font-black text-green-600 dark:text-green-400 tracking-wide">
                      {learningResult?.learningResults || 0} đồng chí
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} lg={12}>
            <Link href="/admin/physical-results" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <FireOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Kết quả rèn luyện
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        {phisicalResult
                          ? phisicalResult[0]?.semester
                          : "Chưa có dữ liệu"}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {phisicalResult?.filter(
                        (item) =>
                          item.semester === phisicalResult[0]?.semester &&
                          (item.practise === "Khá" ||
                            item.practise === "Tốt" ||
                            item.practise === "Xuất sắc")
                      ).length || 0}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Đạt chuẩn
                    </Text>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Tỷ lệ đạt chuẩn
                    </span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 tracking-wide">
                      {physicalProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    percent={physicalProgress}
                    strokeColor="#6366f1"
                    trailColor="#e5e7eb"
                    showInfo={false}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Học kỳ
                    </div>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-wide">
                      {phisicalResult
                        ? phisicalResult[0]?.semester
                        : "Chưa có dữ liệus"}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Đạt chuẩn
                    </div>
                    <div className="text-xl font-black text-green-600 dark:text-green-400 tracking-wide">
                      {phisicalResult?.filter(
                        (item) =>
                          item.semester === phisicalResult[0]?.semester &&
                          (item.practise === "Khá" ||
                            item.practise === "Tốt" ||
                            item.practise === "Xuất sắc")
                      ).length || 0}{" "}
                      đồng chí
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={12}>
            <Link href="/admin/cut-rice" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4">
                      <ClockCircleOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Lịch cắt cơm
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        {daysOfWeek[currentDayIndex]}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-purple-600 dark:text-purple-400 tracking-wider">
                      {(cutRice?.breakfast || 0) +
                        (cutRice?.lunch || 0) +
                        (cutRice?.dinner || 0)}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Suất
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400 tracking-wide">
                      {cutRice?.breakfast || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Sáng
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-orange-600 dark:text-orange-400 tracking-wide">
                      {cutRice?.lunch || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Trưa
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-wide">
                      {cutRice?.dinner || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Tối
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} lg={12}>
            <Link href="/admin/vacation-schedules" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                      <CalendarOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Lịch tranh thủ
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        Ngày {dayjs(new Date()).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-rose-600 dark:text-rose-400 tracking-wider">
                      {vacationSchedule || 0}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Đồng chí
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Tổng số
                    </div>
                    <div className="text-xl font-black text-rose-600 dark:text-rose-400 tracking-wide">
                      {vacationSchedule || 0} đồng chí
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Ngày
                    </div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-wide">
                      {dayjs(new Date()).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Daily Activities */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Link href="/admin/list-help-cooking" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Lịch giúp bếp
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        Ngày {dayjs(new Date()).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-green-600 dark:text-green-400 tracking-wider">
                      {helpCooking || 0}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Đồng chí
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Tổng số
                    </div>
                    <div className="text-xl font-black text-green-600 dark:text-green-400 tracking-wide">
                      {helpCooking || 0} đồng chí
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Ngày
                    </div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-wide">
                      {dayjs(new Date()).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} lg={12}>
            <Link href="/admin/achievement" className="block h-full">
              <Card
                className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm h-full"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title
                        level={3}
                        className="text-gray-900 dark:text-white mb-1 font-black tracking-wide"
                      >
                        Khen thưởng
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        Năm {new Date().getFullYear()}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 tracking-wider">
                      {achievement?.length || 0}
                    </div>
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                      Lần khen thưởng
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Tổng số
                    </div>
                    <div className="text-xl font-black text-yellow-600 dark:text-yellow-400 tracking-wide">
                      {achievement?.length || 0} lần
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Danh hiệu gần nhất
                    </div>
                    <div className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-wide">
                      {achievement && achievement.length > 0
                        ? achievement[achievement.length - 1]?.title ||
                          "Chưa có"
                        : "Chưa có"}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}
