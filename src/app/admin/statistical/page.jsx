"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Link from "next/link";
import SideBar from "@/components/sidebar";

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
          `https://be-student-manager.onrender.com/commander/learningClassification`,
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
          `https://be-student-manager.onrender.com/commander/learningResultBySemester`,
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
          `https://be-student-manager.onrender.com/commander/listSuggestedReward`,
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
          `https://be-student-manager.onrender.com/commander/listSuggestedReward/word`,
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
      <div>
        <SideBar />
      </div>
      <div className="w-full ml-64">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                  <div className="ms-1 text-sm pointer-events-none text-custom text-opacity-70 font-medium md:ms-2 dark:text-gray-400 dark:hover:text-white">
                    Thống kê
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-2">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold p-5 flex justify-between">
              <div>THỐNG KÊ KẾT QUẢ HỌC TẬP</div>
            </div>
            <div className="flex px-4 justify-around pb-1.5">
              <div className="text-center">
                <canvas id="acquisitions1" width="450" height="395"></canvas>
                <div className="text-sm font-bold text-blue-500 pt-1 pb-1">
                  Biểu đồ thống kê kết quả học tập toàn khóa
                </div>
              </div>
              <div className="text-center ml-8">
                <canvas id="acquisitions2" width="450" height="395"></canvas>
                <div className="text-sm font-bold text-red-500 pt-1 pb-1">
                  Biểu đồ thống kê kết quả học tập theo học kỳ{" "}
                  {learningResultBySemester?.maxSemester}
                </div>
              </div>
            </div>
            <div className="w-full pt-10 pb-5 pl-5 pr-6 mb-5">
              <div className="flex justify-between">
                <div className="font-bold">
                  Gợi ý danh sách khen thưởng học viên học kỳ{" "}
                  {listSuggestedReward?.maxSemester}
                </div>
                <button
                  class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded mr-5"
                  onClick={(e) =>
                    handleExportFileWord(e, listSuggestedReward?.maxSemester)
                  }
                >
                  Xuất
                </button>
              </div>
              <div className="w-full pl-5 pb-5 pr-5 mt-2">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-2"
                      >
                        STT
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Họ và tên
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Đơn vị
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Trường
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-4 px-2"
                      >
                        Điểm trung bình
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Kết quả rèn luyện
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listSuggestedReward?.suggestedRewards?.map(
                      (item, index) => (
                        <tr
                          key={item._id}
                          className="border-b border-neutral-200 dark:border-white/10"
                        >
                          <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                            {item.fullName}
                          </td>
                          <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                            {item.unit}
                          </td>
                          <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                            {item.university}
                          </td>
                          <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                            {item.GPA}
                          </td>
                          <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
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
  );
};

export default Statictical;
