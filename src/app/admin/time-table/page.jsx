"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

const TimeTable = () => {
  const router = useRouter();
  const [timeTable, setTimeTable] = useState([]);
  const [fullName, setFullName] = useState("");
  const [unit, setUnit] = useState("");

  const fetchTimeTable = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/timeTables`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTimeTable(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchTimeTable();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/time-table?fullName=${fullName}&unit=${unit}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/timeTables?fullName=${fullName}&unit=${unit}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setTimeTable([]);

        setTimeTable(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRowClick = (studentId) => {
    router.push(`/admin/time-table/${studentId}`);
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
                    Lịch học học viên
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">LỊCH HỌC HỌC VIÊN</div>
            <div className="w-full pl-5 pb-5 pr-5">
              <form
                className="flex items-end"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="flex">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-1 text-sm font-medium dark:text-white"
                    >
                      Nhập tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="vd: Nguyễn Văn X"
                    />
                  </div>
                  <div className="ml-4">
                    <label
                      htmlFor="unit"
                      className="block mb-1 text-sm font-medium dark:text-white"
                    >
                      Chọn đơn vị
                    </label>
                    <select
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="L1 - H5">L1 - H5</option>
                      <option value="L2 - H5">L2 - H5</option>
                      <option value="L3 - H5">L3 - H5</option>
                      <option value="L4 - H5">L4 - H5</option>
                      <option value="L5 - H5">L5 - H5</option>
                      <option value="L6 - H5">L6 - H5</option>
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
            <div className="w-full pl-5 pb-5 pr-5">
              <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 py-2"
                    >
                      Thứ
                    </th>
                    <th scope="col" className="border-e border-neutral-200">
                      Họ và tên
                    </th>
                    <th scope="col" className="border-e border-neutral-200">
                      Đơn vị
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 py-4 px-2"
                    >
                      Thời gian
                    </th>
                    <th scope="col" className="border-e border-neutral-200">
                      Phòng học
                    </th>
                    <th scope="col" className="border-e border-neutral-200">
                      Tuần học
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timeTable?.map((item, index) => (
                    <tr
                      key={item._id}
                      onClick={() => handleRowClick(item.studentId)}
                      className="border-b hover:cursor-pointer hover:bg-gray-50  border-neutral-200 dark:border-white/10"
                    >
                      <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                        {item.day}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.fullName}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.unit}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.time}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.classroom}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                        {item.schoolWeek}
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

export default TimeTable;
