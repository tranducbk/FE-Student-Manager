"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const CutRice = () => {
  const [cutRice, setCutRice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formUpdateData, setFormUpdateData] = useState({
    monday: { breakfast: false, lunch: false, dinner: false },
    tuesday: { breakfast: false, lunch: false, dinner: false },
    wednesday: { breakfast: false, lunch: false, dinner: false },
    thursday: { breakfast: false, lunch: false, dinner: false },
    friday: { breakfast: false, lunch: false, dinner: false },
    saturday: { breakfast: false, lunch: false, dinner: false },
    sunday: { breakfast: false, lunch: false, dinner: false },
  });

  const handleAuthenticationModalClick = (event) => {
    if (event.target.id === "authentication-modal") {
      setShowModal(false);
    }
    if (event.target.id === "authentication-modal1") {
      setShowForm(false);
    }
  };

  const fetchCutRice = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const res = await axios.get(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/cut-rice`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setCutRice(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (e, cutRiceId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const response = await axios.put(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/cut-rice/${cutRiceId}`,
          formUpdateData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCutRice(response.data);
          setShowModal(false);
        } else {
          handleNotify(
            "warning",
            "Cảnh báo!",
            "Đã xảy ra lỗi, vui lòng thử lại sau."
          );
        }
        handleNotify(
          "success",
          "Thành công!",
          "Chỉnh sửa lịch cắt cơm thành công"
        );
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const response = await axios.post(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/cut-rice`,
          formUpdateData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setCutRice(response.data);
          setShowForm(false);
        } else {
          handleNotify(
            "warning",
            "Cảnh báo!",
            "Đã xảy ra lỗi, vui lòng thử lại sau."
          );
        }
        handleNotify("success", "Thành công!", "Thêm lịch cắt cơm thành công");
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchCutRice();
  }, []);

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
                      Lịch cắt cơm
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white rounded-lg w-full">
              <div className="font-bold pt-5 pl-5 pb-5 pr-5 flex justify-between">
                <div>LỊCH CẮT CƠM CÁ NHÂN</div>
                {cutRice?.length === 0 ? (
                  <button
                    onClick={() => setShowForm(true)}
                    class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                  >
                    Thêm
                  </button>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                  >
                    Sửa
                  </button>
                )}
              </div>
              <div className="w-full pl-5 pb-5 pr-5">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
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
              {showModal ? (
                <div className="bg-slate-400 z-10 opacity-50 absolute top-0 left-0 right-0 bottom-0"></div>
              ) : (
                ""
              )}
              {showModal ? (
                <div
                  id="authentication-modal"
                  tabIndex="-1"
                  aria-hidden="true"
                  onClick={handleAuthenticationModalClick}
                  className="overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-10 justify-center items-center max-h-full"
                >
                  <div className="bg-white rounded-lg relative mt-32 mx-auto max-w-xl max-h-full">
                    <div className="relative z-20 bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold dark:text-white mx-auto">
                          THAY ĐỔI LỊCH CẮT CƠM
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-custom rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="authentication-modal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <div className="w-full max-w-xl p-5 mb-5">
                        <div className="w-full">
                          <form
                            onSubmit={(e) =>
                              handleUpdate(
                                e,
                                cutRice?.map((item) => item._id)
                              )
                            }
                          >
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 2</div>
                              <div>
                                <label
                                  htmlFor="monday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.monday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="monday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.monday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="monday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.monday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 3</div>
                              <div>
                                <label
                                  htmlFor="tuesday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="tuesday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="tuesday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 4</div>
                              <div>
                                <label
                                  htmlFor="wednesday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="wednesday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="wednesday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 5</div>
                              <div>
                                <label
                                  htmlFor="thursday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="thursday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="thursday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 6</div>
                              <div>
                                <label
                                  htmlFor="friday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.friday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="friday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.friday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="friday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.friday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 7</div>
                              <div>
                                <label
                                  htmlFor="saturday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="saturday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="saturday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-6 w-full justify-around">
                              <div className="w-1/4">Chủ nhật</div>
                              <div>
                                <label
                                  htmlFor="sunday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="sunday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="sunday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="w-full flex justify-center">
                              <div>
                                <button
                                  type="submit"
                                  className="bg-transparent hover:bg-blue-700 font-semibold hover:text-white py-1 px-4 border border-custom hover:border-transparent rounded"
                                >
                                  Cập nhật
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {showForm ? (
                <div className="bg-slate-400 z-10 opacity-50 absolute top-0 left-0 right-0 bottom-0"></div>
              ) : (
                ""
              )}
              {showForm ? (
                <div
                  id="authentication-modal1"
                  tabIndex="-1"
                  aria-hidden="true"
                  onClick={handleAuthenticationModalClick}
                  className="overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-10 justify-center items-center max-h-full"
                >
                  <div className="bg-white rounded-lg relative mt-32 mx-auto max-w-xl max-h-full">
                    <div className="relative z-20 bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold dark:text-white mx-auto">
                          THÊM LỊCH CẮT CƠM
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-custom rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="authentication-modal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <div className="w-full max-w-xl p-5 mb-5">
                        <div className="w-full">
                          <form onSubmit={(e) => handleCreate(e)}>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 2</div>
                              <div>
                                <label
                                  htmlFor="monday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.monday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="monday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.monday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="monday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="monday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.monday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        monday: {
                                          ...prevState.monday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 3</div>
                              <div>
                                <label
                                  htmlFor="tuesday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="tuesday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="tuesday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="tuesday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.tuesday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        tuesday: {
                                          ...prevState.tuesday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 4</div>
                              <div>
                                <label
                                  htmlFor="wednesday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="wednesday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="wednesday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="wednesday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.wednesday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        wednesday: {
                                          ...prevState.wednesday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 5</div>
                              <div>
                                <label
                                  htmlFor="thursday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="thursday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="thursday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="thursday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.thursday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        thursday: {
                                          ...prevState.thursday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 6</div>
                              <div>
                                <label
                                  htmlFor="friday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.friday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="friday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.friday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="friday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="friday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.friday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        friday: {
                                          ...prevState.friday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-4 w-full justify-around">
                              <div className="w-1/4">Thứ 7</div>
                              <div>
                                <label
                                  htmlFor="saturday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="saturday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="saturday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="saturday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.saturday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        saturday: {
                                          ...prevState.saturday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex mb-6 w-full justify-around">
                              <div className="w-1/4">Chủ nhật</div>
                              <div>
                                <label
                                  htmlFor="sunday-breakfast"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-breakfast"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.breakfast}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          breakfast: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="sunday-lunch"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-lunch"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.lunch}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          lunch: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Trưa</span>
                                </label>
                              </div>
                              <div>
                                <label
                                  htmlFor="sunday-dinner"
                                  className="flex items-center"
                                >
                                  <input
                                    id="sunday-dinner"
                                    type="checkbox"
                                    checked={formUpdateData.sunday.dinner}
                                    onChange={(e) =>
                                      setFormUpdateData((prevState) => ({
                                        ...prevState,
                                        sunday: {
                                          ...prevState.sunday,
                                          dinner: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="ml-2">Tối</span>
                                </label>
                              </div>
                            </div>
                            <div className="w-full flex justify-center">
                              <div>
                                <button
                                  type="submit"
                                  className="bg-transparent hover:bg-blue-700 font-semibold hover:text-white py-1 px-4 border border-custom hover:border-transparent rounded"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CutRice;
