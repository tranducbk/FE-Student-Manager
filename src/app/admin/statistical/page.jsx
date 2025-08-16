"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Link from "next/link";
import SideBar from "@/components/sidebar";
import { BASE_URL } from "@/configs";
const Statictical = () => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [learningClassification, setLearningClassification] = useState([]);
  const [learningResultBySemester, setLearningResultBySemester] = useState([]);
  const [listSuggestedReward, setListSuggestedReward] = useState([]);

  const fetchLearningClassification = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningClassification`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningClassification(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchLearningResultBySemester = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningResultBySemester`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningResultBySemester(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchListSuggestedReward = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/listSuggestedReward`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setListSuggestedReward(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchLearningClassification();
    fetchLearningResultBySemester();
    fetchListSuggestedReward();
  }, []);

  useEffect(() => {
    const ctx1 = document.getElementById("acquisitions1").getContext("2d");
    const ctx2 = document.getElementById("acquisitions2").getContext("2d");

    if (chartRef1.current !== null) {
      chartRef1.current.destroy();
    }

    if (chartRef2.current !== null) {
      chartRef2.current.destroy();
    }

    chartRef1.current = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: learningClassification?.map((row) => row.classification) || [],
        datasets: [
          {
            label: "Số học viên",
            data: learningClassification?.map((row) => row.count) || [],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    chartRef2.current = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: learningResultBySemester?.data?.map(
          (row) => row.classification
        ),
        datasets: [
          {
            label: "Số học viên",
            data: learningResultBySemester?.data?.map((row) => row.count),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef1.current !== null) {
        chartRef1.current.destroy();
      }
      if (chartRef2.current !== null) {
        chartRef2.current.destroy();
      }
    };
  }, [learningClassification, learningResultBySemester]);

  const handleExportFileWord = async (e, maxSemester) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/commander/listSuggestedReward/word`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Danh_sach_goi_y_khen_thuong_hoc_ky_${maxSemester}.docx`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Lỗi tải xuống file", error);
      }
    }
  };

  return (
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
                    Thống kê
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-600">
              <div className="text-gray-900 dark:text-white text-lg">
                THỐNG KÊ KẾT QUẢ HỌC TẬP
              </div>
            </div>
            <div className="flex px-6 py-6 justify-around">
              <div className="text-center">
                <canvas id="acquisitions1" width="450" height="395"></canvas>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 pt-2 pb-1">
                  Biểu đồ thống kê kết quả học tập toàn khóa
                </div>
              </div>
              <div className="text-center ml-8">
                <canvas id="acquisitions2" width="450" height="395"></canvas>
                <div className="text-sm font-bold text-red-600 dark:text-red-400 pt-2 pb-1">
                  Biểu đồ thống kê kết quả học tập theo học kỳ{" "}
                  {learningResultBySemester?.maxSemester}
                </div>
              </div>
            </div>
            <div className="w-full pt-6 pb-5 pl-6 pr-6 mb-5">
              <div className="flex justify-between items-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  Gợi ý danh sách khen thưởng học viên học kỳ{" "}
                  {listSuggestedReward?.maxSemester}
                </div>
                {/* <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center mr-5"
                  onClick={(e) =>
                    handleExportFileWord(e, listSuggestedReward?.maxSemester)
                  }
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Xuất Word
                </button> */}
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
                          Họ và tên
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Đơn vị
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Trường
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Điểm trung bình
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Kết quả rèn luyện
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {listSuggestedReward?.suggestedRewards?.map(
                        (item, index) => (
                          <tr
                            key={item._id}
                            className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {item.fullName}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {item.unit}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {item.university}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {item.GPA}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {item.practise}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statictical;
