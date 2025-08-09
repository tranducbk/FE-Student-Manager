"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

import { BASE_URL } from "@/configs";
const TuitionFees = () => {
  const router = useRouter();
  const [tuitionFees, setTuitionFees] = useState(null);
  const [semester, setSemester] = useState("2023.2");
  const [semesters, setSemesters] = useState([]);

  const getSemesterLabel = (s) => {
    if (!s) return "";
    const code = s.code || "";
    // code có thể là HK1/HK2/HK3 hoặc dạng năm.kỳ cũ
    if (code.startsWith("HK")) {
      return s.schoolYear ? `${code} - ${s.schoolYear}` : code;
    }
    const parts = code.split(".");
    const term = parts.length > 1 ? parts[1] : "";
    return s.schoolYear && term ? `HK${term} - ${s.schoolYear}` : code;
  };

  const fetchTuitionFees = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/tuitionFees?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTuitionFees(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSemesters();
      await fetchTuitionFees();
    };
    init();
  }, []);

  const fetchSemesters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/semester`, {
        headers: { token: `Bearer ${token}` },
      });
      const list = res.data || [];
      setSemesters(list);
      if (list.length > 0) {
        const exists = list.find((s) => s.code === semester);
        if (!exists) setSemester(list[0].code);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/tuition-fees?semester=${semester}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/tuitionFees?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setTuitionFees([]);

        setTuitionFees(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatNumberWithCommas = (number) => {
    if (number == null) {
      return "0";
    }
    // Chuyển đổi số thành chuỗi
    let numStr = number.toString();

    // Tách chuỗi thành các mảng con với 3 ký tự
    let parts = [];
    while (numStr.length > 3) {
      parts.unshift(numStr.slice(-3));
      numStr = numStr.slice(0, -3);
    }
    parts.unshift(numStr);

    return parts.join(".");
  };

  const handleExportFilePdf = async (e, semester) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/commander/tuitionFee/pdf?semester=${semester}`,
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
          `Thong_ke_hoc_phi_he5_hoc_ky_${semester}.pdf`
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
                    Học phí học viên
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
                HỌC PHÍ HỌC VIÊN
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
                      {semesters.length === 0 && (
                        <option value="" disabled>
                          Chưa có học kỳ
                        </option>
                      )}
                      {semesters.map((s) => (
                        <option key={s._id} value={s.code}>
                          {getSemesterLabel(s)}
                        </option>
                      ))}
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
            {tuitionFees?.tuitionFees && tuitionFees.tuitionFees.length > 0 && (
              <div className="w-full px-5 pb-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="text-blue-800 dark:text-blue-200 font-semibold text-sm">
                    Tổng học phí của học viên trong học kỳ{" "}
                    <span className="font-bold">
                      {tuitionFees?.tuitionFees[0]?.semester}
                    </span>{" "}
                    là:{" "}
                    <span className="font-bold text-lg">
                      {formatNumberWithCommas(tuitionFees?.totalAmountSum)}đ
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                        LOẠI TIỀN
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                      >
                        SỐ TIỀN
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        TRẠNG THÁI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tuitionFees?.tuitionFees &&
                    tuitionFees.tuitionFees.length > 0 ? (
                      tuitionFees.tuitionFees.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.semester}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.fullName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.university}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                            {item.content}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center font-medium">
                            {formatNumberWithCommas(item.totalAmount)}đ
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === "Đã đóng"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : item.status === "Chưa đóng"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              Không có dữ liệu
                            </p>
                            <p className="text-sm">
                              Không tìm thấy thông tin học phí nào
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

export default TuitionFees;
