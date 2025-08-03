"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

import { BASE_URL } from "@/configs";
const LearningResults = () => {
  const router = useRouter();
  const [learningResults, setLearningResults] = useState(null);
  const [semester, setSemester] = useState("2023.1");

  const fetchLearningResults = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningResults?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchLearningResults();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/learning-results?semester=${semester}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningResults?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setLearningResults([]);

        setLearningResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExportFilePdf = async (e, semester) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/commander/learningResult/pdf?semester=${semester}`,
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
          `Thong_ke_ket_qua_hoc_tap_he5_hoc_ky_${semester}.pdf`
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                  <div className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kết quả học tập
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="font-bold p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div className="text-gray-900 dark:text-white text-lg">
                KẾT QUẢ HỌC TẬP HỌC VIÊN
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                onClick={(e) => handleExportFilePdf(e, semester)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Xuất PDF
              </button>
            </div>
            <div className="w-full p-5">
              <form
                className="flex items-end"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="flex">
                  <div>
                    <label
                      htmlFor="semester"
                      className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Chọn học kỳ
                    </label>
                    <select
                      id="semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border w-56 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10"
                    >
                      <option value="2021.1">2021.1</option>
                      <option value="2021.2">2021.2</option>
                      <option value="2021.3">2021.3</option>
                      <option value="2022.1">2022.1</option>
                      <option value="2022.2">2022.2</option>
                      <option value="2022.3">2022.3</option>
                      <option value="2023.1">2023.1</option>
                      <option value="2023.2">2023.2</option>
                      <option value="2023.3">2023.3</option>
                    </select>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    type="submit"
                    className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 transition-colors duration-200"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>
            <div className="w-full p-5">
              <div className="overflow-x-auto">
                <table className="table-auto w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        HỌC KỲ
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        HỌ VÀ TÊN
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        TRƯỜNG
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        GPA
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        CPA
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        TC TÍCH LŨY
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        TC NỢ ĐĂNG KÝ
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        TRÌNH ĐỘ
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        CẢNH BÁO
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {learningResults && learningResults.length > 0 ? (
                      learningResults.map((item, index) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.university}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.GPA}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.CPA}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.cumulativeCredit} tín chỉ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.totalDebt} tín chỉ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            Năm {item.studentLevel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.warningLevel === 0
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : item.warningLevel === 1
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              Mức {item.warningLevel}
                            </span>
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              Không có dữ liệu
                            </p>
                            <p className="text-sm">
                              Không tìm thấy kết quả học tập nào
                            </p>
                          </div>
                        </td>
                      </tr>
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

export default LearningResults;
