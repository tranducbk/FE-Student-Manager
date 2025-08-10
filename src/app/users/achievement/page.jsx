"use client";

import Link from "next/link";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SideBar from "@/components/sidebar";
import { BASE_URL } from "@/configs";

const Achievement = () => {
  const [achievement, setAchievement] = useState(null);
  const searchParams = useSearchParams();

  const fetchAchievement = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const studentIdParam = searchParams?.get("studentId");
        const targetStudentId = studentIdParam || decodedToken.id;
        const res = await axios.get(
          `${BASE_URL}/achievement/${targetStudentId}`,
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

  useEffect(() => {
    fetchAchievement();
    // Re-fetch when the query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 ml-64">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/users"
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
                    Khen thưởng
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="text-gray-900 dark:text-white text-lg">
                THÀNH TÍCH
              </div>
            </div>
            <div className="w-full pl-6 pb-6 pr-6 mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <tr>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Năm
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Số quyết định
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Ngày quyết định
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Danh hiệu
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Nghiên cứu khoa học
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        BK BQP
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        CSTĐ TQ
                      </th>
                      <th
                        scope="col"
                        className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {achievement?.yearlyAchievements &&
                    achievement.yearlyAchievements.length > 0 ? (
                      achievement.yearlyAchievements.map((item, index) => (
                        <tr
                          key={item._id}
                          className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.year}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.decisionNumber || "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.decisionDate
                              ? new Date(item.decisionDate).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.title || "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.scientific?.topics?.length > 0
                              ? `Đề tài: ${item.scientific.topics[0].title} (${
                                  item.scientific.topics[0].status ===
                                  "approved"
                                    ? "Đã duyệt"
                                    : item.scientific.topics[0].status ===
                                      "rejected"
                                    ? "Từ chối"
                                    : "Chờ duyệt"
                                })`
                              : item.scientific?.initiatives?.length > 0
                              ? `Sáng kiến: ${
                                  item.scientific.initiatives[0].title
                                } (${
                                  item.scientific.initiatives[0].status ===
                                  "approved"
                                    ? "Đã duyệt"
                                    : item.scientific.initiatives[0].status ===
                                      "rejected"
                                    ? "Từ chối"
                                    : "Chờ duyệt"
                                })`
                              : "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.hasMinistryReward ? "✓" : "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.hasNationalReward ? "✓" : "-"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.notes || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
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
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              Không có dữ liệu
                            </p>
                            <p className="text-sm">
                              Không tìm thấy thành tích nào
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phần đề xuất */}
              {achievement?.nextYearRecommendations && (
                <div className="w-full pl-6 pb-6 pr-6 mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Đề xuất khen thưởng
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          Chuỗi thi đua liên tiếp:
                        </span>
                        <span>
                          {
                            achievement.nextYearRecommendations
                              .consecutiveCompetitiveYears
                          }{" "}
                          năm
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          Năm thi đua cuối:
                        </span>
                        <span>
                          {
                            achievement.nextYearRecommendations
                              .lastCompetitiveYear
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Năm tiếp theo:</span>
                        <span>
                          {achievement.nextYearRecommendations.nextYear}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          Có thể tiếp tục chuỗi:
                        </span>
                        <span>
                          {achievement.nextYearRecommendations.canContinueStreak
                            ? "Có"
                            : "Không"}
                        </span>
                      </div>
                      {!achievement.eligibleForMinistryReward && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            Cần thêm năm thi đua để đạt BQP:
                          </span>
                          <span>
                            {
                              achievement.nextYearRecommendations
                                .yearsToMinistryReward
                            }{" "}
                            năm
                          </span>
                        </div>
                      )}
                      {!achievement.eligibleForNationalReward && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            Cần thêm năm thi đua để đạt toàn quân:
                          </span>
                          <span>
                            {
                              achievement.nextYearRecommendations
                                .yearsToNationalReward
                            }{" "}
                            năm
                          </span>
                        </div>
                      )}
                      {achievement.nextYearRecommendations
                        .needScientificTopic && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            Cần đề tài/sáng kiến:
                          </span>
                          <span>Có</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
