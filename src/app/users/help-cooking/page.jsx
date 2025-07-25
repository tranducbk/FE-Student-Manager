"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

const HelpCooking = () => {
  const [helpCooking, setHelpCooking] = useState(null);

  const fetchHelpCooking = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/helpCooking/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setHelpCooking(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchHelpCooking();
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
                    Lịch giúp bếp
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">LỊCH GIÚP BẾP</div>
            <div className="w-full pl-5 pb-5 pr-5">
              <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 max-w-5 dark:border-white/10"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Nơi giúp bếp
                    </th>
                    <th
                      scope="col"
                      className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                    >
                      Ngày giúp bếp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {helpCooking?.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-neutral-200 dark:border-white/10"
                    >
                      <td className="whitespace-nowrap border-e border-neutral-200 font-medium dark:border-white/10">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {item.location}
                      </td>
                      <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                        {dayjs(item.dayHelpCooking).format("DD/MM/YYYY")}
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

export default HelpCooking;
