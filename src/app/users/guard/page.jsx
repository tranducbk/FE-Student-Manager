"use client";

import SideBar from "@/components/sidebar";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/configs";

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
          `${BASE_URL}/user/guard?year=${year}&month=${parseInt(month)}`,
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
          `${BASE_URL}/user/guard?year=${year}&month=${parseInt(month)}`,
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
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 ml-64">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/users"
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
                    Lịch gác đêm
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="text-gray-900 dark:text-white text-lg">
                LỊCH GÁC ĐÊM
              </div>
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
                        htmlFor="month"
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 transition-colors duration-200"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="text-sm flex font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày:{" "}
                  <span className="pl-1 font-bold text-gray-900 dark:text-white">
                    {dayjs(guard ? guard[index]?.dayGuard : "").format(
                      "DD/MM/YYYY"
                    )}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu:{" "}
                </div>
                <div className="flex text-sm">
                  <div className="flex font-medium text-gray-700 dark:text-gray-300">
                    Hỏi:{" "}
                    <span className="pl-1 font-bold text-gray-900 dark:text-white">
                      {guard ? guard[index]?.guardPassword?.question : ""}
                    </span>
                  </div>
                  <div className="pl-8">
                    <div className="flex font-medium text-gray-700 dark:text-gray-300">
                      Đáp:{" "}
                      <span className="pl-1 font-bold text-gray-900 dark:text-white">
                        {guard ? guard[index]?.guardPassword?.answer : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                          <tr>
                            <th
                              scope="col"
                              className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Thời gian
                            </th>
                            <th
                              scope="col"
                              className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Vọng 1 (Cầu thang tòa S1)
                            </th>
                            <th
                              scope="col"
                              className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Vọng 2 (Đối diện tòa S2)
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Vọng 3 (Đằng sau tòa S3)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              19h00 - 21h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[0] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[0] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[0] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              21h00 - 22h30
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[1] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[1] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[1] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              22h30 - 24h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[2] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[2] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[2] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              24h00 - 1h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[3] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[3] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[3] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              1h00 - 2h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[4] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[4] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[4] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              2h00 - 3h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[5] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[5] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[5] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              3h00 - 4h00
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[6] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[6] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
                              {guard ? guard[index]?.location3[6] : ""}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              4h00 - 5h30
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location1[7] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                              {guard ? guard[index]?.location2[7] : ""}
                            </td>
                            <td className="whitespace-nowrap font-medium py-4 px-4">
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
                    className={`text-sm py-1 px-2 w-24 rounded transition-colors duration-200 ${
                      i === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white"
                    }`}
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
