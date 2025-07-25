"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SideBar from "@/components/sidebar";

const ListGuardDetail = ({ params }) => {
  const [listGuardDetail, setListGuardDetail] = useState([]);

  const time = [
    "19h00 - 21h00",
    "21h00 - 22h30",
    "22h30 - 24h00",
    "24h00 - 1h00",
    "1h00 - 2h00",
    "2h00 - 3h00",
    "3h00 - 4h00",
    "4h00 - 5h30",
  ];

  useEffect(() => {
    fetchListGuardDetail();
  }, []);

  const fetchListGuardDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/user/guard/${params.date}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setListGuardDetail(res.data);
      } catch (error) {
        console.log(error);
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
              <li className="inline-flex items-center">
                <Link
                  href="/admin/list-guard"
                  className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
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
                  Danh sách gác đêm
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
                    Chi tiết
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">
              CHI TIẾT DANH SÁCH GÁC ĐÊM
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="text-sm flex font-medium">
                Ngày:{" "}
                <div className="pl-1 font-bold">
                  {dayjs(
                    listGuardDetail ? listGuardDetail[0]?.dayGuard : ""
                  ).format("DD/MM/YYYY")}
                </div>
              </div>

              <div className="flex text-sm">
                <div className="text-sm font-medium">Mật khẩu: </div>
                <div className="flex font-medium pl-8">
                  Hỏi:{" "}
                  <div className="pl-1 font-bold">
                    {listGuardDetail
                      ? listGuardDetail[0]?.guardPassword?.question
                      : ""}
                  </div>
                </div>
                <div className="pl-8">
                  <div className="flex font-medium">
                    Đáp:{" "}
                    <div className="pl-1 font-bold">
                      {listGuardDetail
                        ? listGuardDetail[0]?.guardPassword?.answer
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                        <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                          <tr>
                            <th
                              scope="col"
                              className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Thời gian
                            </th>
                            <th
                              scope="col"
                              className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Vọng 1 (Cầu thang tòa S1)
                            </th>
                            <th
                              scope="col"
                              className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Vọng 2 (Đối diện tòa S2)
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Vọng 3 (Đằng sau tòa S3)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {listGuardDetail
                            ? listGuardDetail[0]?.location1?.map(
                                (item, index) => (
                                  <tr
                                    key={listGuardDetail[0]._id + Math.random()}
                                    className="border-b border-neutral-200 dark:border-white/10"
                                  >
                                    <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                                      {time[index]}
                                    </td>
                                    <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                                      {item}
                                    </td>
                                    <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                                      {listGuardDetail[0].location2[index]}
                                    </td>
                                    <td className="whitespace-nowrap font-medium px-6 py-4">
                                      {listGuardDetail[0].location3[index]}
                                    </td>
                                  </tr>
                                )
                              )
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGuardDetail;
