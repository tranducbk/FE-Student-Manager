"use client";

import SideBar from "@/components/sidebar";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Guard = () => {
  const [guard, setGuard] = useState(null);
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { query } = router;
  const monthParam = query?.month || new Date().getMonth() + 1;
  const yearParam = query?.year || new Date().getFullYear();
  const [month, setMonth] = useState(monthParam);
  const [year, setYear] = useState(yearParam);

  useEffect(() => {
    fetchGuard();
  }, [index]);

  const fetchGuard = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/user/guard?year=${year}&month=${parseInt(
            month
          )}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setGuard([]);

        setGuard(res.data);
        router.push(`/users/guard?year=${year}&month=${month}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/user/guard?year=${year}&month=${parseInt(
            month
          )}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setGuard([]);

        setGuard(res.data);

        router.push(`/users/guard?year=${year}&month=${month}`);
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
                    Lịch gác đêm
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">LỊCH GÁC ĐÊM</div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="w-full">
                <form
                  className="flex items-end"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex">
                    <div>
                      <label
                        htmlFor="month"
                        className="block mb-1 text-sm font-medium dark:text-white"
                      >
                        Chọn tháng
                      </label>
                      <select
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="1">Tháng 1</option>
                        <option value="2">Tháng 2</option>
                        <option value="3">Tháng 3</option>
                        <option value="4">Tháng 4</option>
                        <option value="5">Tháng 5</option>
                        <option value="6">Tháng 6</option>
                        <option value="7">Tháng 7</option>
                        <option value="8">Tháng 8</option>
                        <option value="9">Tháng 9</option>
                        <option value="10">Tháng 10</option>
                        <option value="11">Tháng 11</option>
                        <option value="12">Tháng 12</option>
                      </select>
                    </div>
                    <div className="ml-4">
                      <label
                        htmlFor="enrollment"
                        className="block mb-1 text-sm font-medium dark:text-white"
                      >
                        Chọn năm
                      </label>
                      <input
                        type="number"
                        id="enrollment"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        aria-describedby="helper-text-explanation"
                        className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 px-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="2024"
                        min="2024"
                        required
                      />
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
            <div className="text-sm pl-5 flex font-medium">
              Ngày:{" "}
              <div className="pl-1 font-bold">
                {dayjs(guard ? guard[index]?.dayGuard : "").format(
                  "DD/MM/YYYY"
                )}
              </div>
            </div>
            <div className="text-sm pl-5 font-medium">Mật khẩu: </div>
            <div className="flex text-sm pl-5">
              <div className="flex font-medium">
                Hỏi:{" "}
                <div className="pl-1 font-bold">
                  {guard ? guard[index]?.guardPassword?.question : ""}
                </div>
              </div>
              <div className="pl-8">
                <div className="flex font-medium">
                  Đáp:{" "}
                  <div className="pl-1 font-bold">
                    {guard ? guard[index]?.guardPassword?.answer : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
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
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              19h00 - 21h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[0] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[0] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[0] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              21h00 - 22h30
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[1] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[1] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[1] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              22h30 - 24h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[2] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[2] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[2] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              24h00 - 1h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[3] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[3] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[3] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              1h00 - 2h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[4] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[4] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[4] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              2h00 - 3h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[5] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[5] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[5] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              3h00 - 4h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location1[6] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              {guard ? guard[index]?.location2[6] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[6] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-neutral-200 dark:border-white/10">
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              4h00 - 5h30
                            </td>
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              {guard ? guard[index]?.location1[7] : ""}
                            </td>
                            <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              {guard ? guard[index]?.location2[7] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium px-6 py-4">
                              {guard ? guard[index]?.location3[7] : ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="flex flex-wrap gap-4">
                {guard?.map((item, i) => (
                  <button
                    key={item._id}
                    onClick={() => setIndex(i)}
                    className="bg-gray-50 border hover:text-white hover:bg-blue-700 text-sm py-1 px-2 w-24 rounded"
                  >
                    {dayjs(item.dayGuard).format("DD/MM/YYYY")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guard;
