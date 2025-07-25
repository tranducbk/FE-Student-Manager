"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

const TuitionFees = () => {
  const router = useRouter();
  const [tuitionFees, setTuitionFees] = useState(null);
  const [semester, setSemester] = useState("2023.2");

  const fetchTuitionFees = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/tuitionFees?semester=${semester}`,
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
    fetchTuitionFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/tuition-fees?semester=${semester}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/tuitionFees?semester=${semester}`,
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
          `https://be-student-manager.onrender.com/commander/tuitionFee/pdf?semester=${semester}`,
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
                    Học phí học viên
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold p-5 flex justify-between">
              <div>HỌC PHÍ HỌC VIÊN</div>
              <button
                class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                onClick={(e) => handleExportFilePdf(e, semester)}
              >
                Xuất
              </button>
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="w-full">
                <form
                  className="flex items-end"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex">
                    <div>
                      <label
                        htmlFor="semester"
                        className="block mb-1 text-sm font-medium dark:text-white"
                      >
                        Chọn học kỳ
                      </label>
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="2020.1">2020.1</option>
                        <option value="2020.2">2020.2</option>
                        <option value="2021.1">2021.1</option>
                        <option value="2021.2">2021.2</option>
                        <option value="2022.1">2022.1</option>
                        <option value="2022.2">2022.2</option>
                        <option value="2023.1">2023.1</option>
                        <option value="2023.2">2023.2</option>
                        <option value="2024.1">2024.1</option>
                        <option value="2024.2">2024.2</option>
                      </select>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      type="submit"
                      className="h-9 bg-gray-50 border hover:text-white hover:bg-blue-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full pl-5 pb-1 font-bold pr-5 text-sm  dark:text-white">
              Tổng học phí của học viên trong học kỳ{" "}
              {tuitionFees?.tuitionFees[0]?.semester} là:{" "}
              {formatNumberWithCommas(tuitionFees?.totalAmountSum)}đ
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200"
                    >
                      Học kỳ
                    </th>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200"
                    >
                      Họ và tên
                    </th>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200"
                    >
                      Trường
                    </th>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200"
                    >
                      Loại tiền phải đóng
                    </th>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200"
                    >
                      Số tiền phải đóng
                    </th>
                    <th
                      scope="col"
                      className="border-e py-4 px-2 border-neutral-200 dark:border-white/10"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionFees?.tuitionFees?.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-neutral-200 dark:border-white/10"
                    >
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.semester}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.fullName}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.university}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.content}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.totalAmount}đ
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionFees;
