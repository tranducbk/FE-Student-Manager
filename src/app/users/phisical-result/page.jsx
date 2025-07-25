"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

const PhisicalResult = () => {
  const [phisicalResult, setPhisicalResult] = useState(null);
  const [violation, setViolation] = useState(null);

  const fetchViolation = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/violation/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setViolation(res.data);
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

  useEffect(() => {
    fetchViolation();
    fetchPhisicalResult();
  }, []);

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
                  href="/users"
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
                    Rèn luyện
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">
              KẾT QUẢ RÈN LUYỆN THỂ LỰC
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-1.5 min-w-8 dark:border-white/10"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Học kỳ
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Chạy 100m
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Chạy 3000m
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Xà đơn
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Bơi 100m
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Xếp loại
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {phisicalResult?.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-neutral-200 dark:border-white/10"
                    >
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.semester}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.run100m}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.run3000m}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.pullUpBar}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.swimming100m}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.practise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">LỖI VI PHẠM</div>
            <div className="w-full pl-5 pb-5 pr-5">
              <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 min-w-8 dark:border-white/10"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Nội dung vi phạm
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Hình thức xử lý
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Ngày vi phạm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {violation?.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-neutral-200 dark:border-white/10"
                    >
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.content}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.penalty}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {dayjs(item.dateOfViolation).format("DD/MM/YYYY")}
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

export default PhisicalResult;
