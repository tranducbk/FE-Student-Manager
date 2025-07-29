"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

import { BASE_URL } from "@/configs";
const CutRice = () => {
  const router = useRouter();
  const [cutRice, setCutRice] = useState(null);
  const [unit, setUnit] = useState("");

  const unitMapping = {
    "L1 - H5": 1,
    "L2 - H5": 2,
    "L3 - H5": 3,
    "L4 - H5": 4,
    "L5 - H5": 5,
    "L6 - H5": 6,
  };

  const fetchCutRice = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/cutRice`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setCutRice(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchCutRice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/cut-rice?unit=${unit}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/cutRice?unit=${unit}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setCutRice([]);

        setCutRice(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExportFileExcel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/commander/cutRice/excel`,
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
        link.setAttribute("download", "danh_sach_cat_com_h5.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  return (
    <>
      <ReactNotifications />
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
                    href="/admin"
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
                      Cắt cơm học viên
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
                  CẮT CƠM HỌC VIÊN
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                  onClick={handleExportFileExcel}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Xuất Excel
                </button>
              </div>
              <div className="w-full pt-2 pl-5 pb-5 pr-5">
                <div className="w-full">
                  <form
                    className="flex items-end mb-4"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="flex">
                      <div>
                        <label
                          htmlFor="unit"
                          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Chọn lớp
                        </label>
                        <select
                          id="unit"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Tất cả</option>
                          <option value="L1 - H5">Lớp 1</option>
                          <option value="L2 - H5">Lớp 2</option>
                          <option value="L3 - H5">Lớp 3</option>
                          <option value="L4 - H5">Lớp 4</option>
                          <option value="L5 - H5">Lớp 5</option>
                          <option value="L6 - H5">Lớp 6</option>
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
              </div>
              <div className="w-full pl-5 pb-5 pr-5">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                    <thead className="border-b bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 font-medium">
                      <tr>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-4 px-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          LỚP
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          HỌ VÀ TÊN
                        </th>

                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-2"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 2
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 3
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 4
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 5
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 6
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              THỨ 7
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-1"
                        >
                          <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              CHỦ NHẬT
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Sáng
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Trưa
                              </div>
                              <div className="w-full flex-1 text-xs text-gray-500 dark:text-gray-300">
                                Tối
                              </div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {cutRice && cutRice.length > 0 ? (
                        cutRice.map((item) => (
                          <tr
                            key={item._id}
                            className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="whitespace-nowrap font-medium border-r py-4 px-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                              {unitMapping[item.unit] || ""}
                            </td>
                            <td className="whitespace-nowrap font-medium border-r py-4 px-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                              {item.fullName}
                            </td>

                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.monday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.monday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.monday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.tuesday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.tuesday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.tuesday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.wednesday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.wednesday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.wednesday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.thursday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.thursday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.thursday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.friday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.friday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.friday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.saturday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.saturday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.saturday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.sunday?.breakfast === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.sunday?.lunch === true ? 1 : 0}
                                </div>
                                <div className="w-full flex-1 text-gray-900 dark:text-white">
                                  {item.sunday?.dinner === true ? 1 : 0}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-lg font-medium">
                                Không có dữ liệu
                              </p>
                              <p className="text-sm">
                                Không tìm thấy thông tin cắt cơm nào
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
    </>
  );
};

export default CutRice;
