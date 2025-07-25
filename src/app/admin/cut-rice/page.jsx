"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

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
        const res = await axios.get(`https://be-student-manager.onrender.com/commander/cutRice`, {
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
          `https://be-student-manager.onrender.com/commander/cutRice?unit=${unit}`,
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
          `https://be-student-manager.onrender.com/commander/cutRice/excel`,
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
                      Cắt cơm học viên
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white rounded-lg w-full">
              <div className="font-bold p-5 flex justify-between">
                <div>CẮT CƠM HỌC VIÊN</div>
                <button
                  class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                  onClick={handleExportFileExcel}
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
                          htmlFor="unit"
                          className="block mb-1 text-sm font-medium dark:text-white"
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
                        className="h-9 bg-gray-50 border hover:text-white hover:bg-blue-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="w-full pl-5 pb-5 pr-5">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-4 px-2"
                      >
                        Lớp
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-2"
                      >
                        Họ và tên
                      </th>

                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-2"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 2</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 3</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className=" border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 4</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className=" border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 5</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className=" border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 6</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className=" border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Thứ 7</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className=" border-e border-neutral-200 py-1"
                      >
                        <div className="flex flex-col">
                          <div>Chủ nhật</div>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <div className="w-full flex-1">Sáng</div>
                            <div className="w-full flex-1">Trưa</div>
                            <div className="w-full flex-1">Tối</div>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cutRice?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {unitMapping[item.unit] || ""}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {item.fullName}
                        </td>

                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.monday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.monday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.monday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.tuesday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.tuesday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.tuesday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.wednesday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.wednesday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.wednesday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.thursday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.thursday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.thursday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.friday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.friday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.friday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.saturday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.saturday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.saturday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-full flex-1">
                              {item.sunday?.breakfast === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.sunday?.lunch === true ? 1 : 0}
                            </div>
                            <div className="w-full flex-1">
                              {item.sunday?.dinner === true ? 1 : 0}
                            </div>
                          </div>
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
    </>
  );
};

export default CutRice;
