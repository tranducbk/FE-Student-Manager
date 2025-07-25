"use client";

import SideBar from "@/components/sidebar";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const ListHelpCooking = () => {
  const router = useRouter();
  const [helpCooking, setHelpCooking] = useState([]);
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [id, setId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [addFormData, setAddFormData] = useState({
    dayHelpCooking: format(new Date(), "yyyy-MM-dd"),
  });

  const handleAddFormData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://be-student-manager.onrender.com/commander/helpCooking`,
        addFormData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify(
        "success",
        "Thành công!",
        "Thêm học viên giúp bếp thành công"
      );
      setHelpCooking([...helpCooking, response.data]);
      setShowFormAdd(false);
      fetchHelpCooking();
    } catch (error) {
      handleNotify("danger", "Lỗi!", error);
    }
  };

  const handleShowFormEdit = (id, studentId) => {
    setId(id);
    setStudentId(studentId);
    setShowFormEdit(true);
  };

  const handleUpdate = async (e, studentId, helpCookingId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.put(
          `https://be-student-manager.onrender.com/commander/${studentId}/helpCooking/${helpCookingId}`,
          editFormData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify("success", "Thành công!", "Chỉnh sửa học viên thành công");
        setShowFormEdit(false);
        fetchHelpCooking();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
        setShowFormEdit(false);
      }
    }
  };

  useEffect(() => {
    fetchHelpCooking();
  }, []);

  const fetchHelpCooking = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/helpCooking?fullName=${
            fullName ? fullName : ""
          }&date=${date ? date : ""}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setHelpCooking([]);

        setHelpCooking(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e, fullName, date) => {
    e.preventDefault();
    router.push(`/admin/list-help-cooking?fullName=${fullName}&date=${date}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/helpCooking?fullName=${fullName}&date=${date}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setHelpCooking([]);

        setHelpCooking(res.data);
        fetchHelpCooking();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  const handleDelete = (id, studentId) => {
    setId(id);
    setStudentId(studentId);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleConfirmDelete = (e, id, studentId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(
          `https://be-student-manager.onrender.com/commander/${studentId}/helpCooking/${id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setHelpCooking(
            helpCooking.filter((helpCooking) => helpCooking.id !== id)
          );
          handleNotify(
            "success",
            "Thành công!",
            "Xóa học viên giúp bếp thành công"
          );
          setShowConfirm(false);
          fetchHelpCooking();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error));
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
          {showFormEdit ? (
            <div className="fixed inset-0 mt-16 flex items-center justify-center z-30">
              <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                <button
                  onClick={() => setShowFormEdit(false)}
                  className="absolute top-1 right-1 m-4 p-1 rounded-md text-gray-400 cursor-pointer hover:bg-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <form
                  onSubmit={(e) => handleUpdate(e, studentId, id)}
                  className="px-6 pt-6 pb-3 z-10"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Chỉnh sửa thời gian và địa điểm giúp bếp
                  </h2>

                  <div className="mb-4">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium"
                    >
                      Địa điểm giúp bếp
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editFormData.location}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: e.target.value,
                        })
                      }
                      placeholder="Nhập địa điểm..."
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="dayHelpCooking"
                      className="block text-sm font-medium"
                    >
                      Ngày giúp bếp
                    </label>
                    <DatePicker
                      id="dayHelpCooking"
                      dateFormat="yyyy-MM-dd"
                      selected={editFormData.dayHelpCooking}
                      onChange={(date) =>
                        setEditFormData({
                          ...editFormData,
                          dayHelpCooking: date,
                        })
                      }
                      className="bg-gray-50 border mt-1 w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholderText="Năm-Tháng-Ngày"
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                      onClick={() => setShowFormEdit(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            {showConfirm && (
              <div className="fixed top-0 left-0 z-20 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                  <button
                    onClick={handleCancelDelete}
                    type="button"
                    className="absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="deleteModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <svg
                    className="w-11 h-11 mb-3.5 mx-auto"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p className="mb-4 dark:text-gray-300">
                    Bạn có chắc chắn muốn xóa?
                  </p>
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={handleCancelDelete}
                      data-modal-toggle="deleteModal"
                      type="button"
                      className="py-2 px-3 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={(e) => handleConfirmDelete(e, id, studentId)}
                      type="submit"
                      className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg w-full">
              <div className="font-bold p-5 flex justify-between">
                <div>DANH SÁCH GIÚP BẾP</div>
                <button
                  onClick={() => setShowFormAdd(true)}
                  class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                >
                  Thêm
                </button>
              </div>
              <div className="w-full pl-5 pb-5 pr-5">
                <form
                  className="flex items-end"
                  onSubmit={(e) => handleSubmit(e, fullName, date)}
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
                        htmlFor="date"
                        className="block mb-1 text-sm font-medium dark:text-white"
                      >
                        Chọn ngày
                      </label>

                      <DatePicker
                        id="date"
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="bg-gray-50 border z-20 w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholderText="Năm-Tháng-Ngày"
                        wrapperClassName="w-56"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      type="submit"
                      className="h-9 bg-gray-50 border hover:text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </form>
                <table className="table-auto w-full mt-4 divide-y border border-gray-200 divide-gray-200 overflow-x-auto">
                  <thead className="bg-sky-100">
                    <tr className="border border-gray-200">
                      <th
                        scope="col"
                        className="border py-3 text-sm uppercase "
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm uppercase"
                      >
                        Họ và tên
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm uppercase"
                      >
                        Đơn vị
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm uppercase"
                      >
                        Địa điểm
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm uppercase "
                      >
                        Ngày giúp bếp
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {helpCooking?.map((item, index) => (
                      <tr key={item._id}>
                        <td className="px-4 border py-4 text-center">
                          <div className="text-sm ">{index + 1}</div>
                        </td>
                        <td className="px-6 border py-4 text-center">
                          <div className="text-sm ">{item.fullName}</div>
                        </td>
                        <td className="px-6 border py-4 text-center">
                          <div className="text-sm ">{item.unit}</div>
                        </td>
                        <td className="px-6 border py-4 text-center">
                          <div className="text-sm ">{item.location}</div>
                        </td>
                        <td className="px-6 border py-4 text-center">
                          <div className="text-sm ">
                            {dayjs(item.dayHelpCooking).format("DD/MM/YYYY")}
                          </div>
                        </td>
                        <td className="justify-center text-sm flex">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() =>
                              handleShowFormEdit(item._id, item.studentId)
                            }
                            className="text-indigo-600 hover:text-indigo-900 mt-2 mb-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item._id, item.studentId)
                            }
                            className="ml-2 text-red-600 hover:text-red-900 mt-2 mb-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {showFormAdd ? (
            <div className="fixed inset-0 mt-16 flex items-center justify-center z-30">
              <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                <button
                  onClick={() => setShowFormAdd(false)}
                  className="absolute top-1 right-1 m-4 p-1 rounded-md text-gray-400 cursor-pointer hover:bg-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <form
                  onSubmit={handleAddFormData}
                  className="px-6 pt-6 pb-3 z-10"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Thêm học viên giúp bếp
                  </h2>

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={addFormData.fullName}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          fullName: e.target.value,
                        })
                      }
                      required
                      placeholder="Nhập họ và tên..."
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium"
                    >
                      Địa điểm giúp bếp
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={addFormData.location}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          location: e.target.value,
                        })
                      }
                      required
                      placeholder="Nhập địa điểm..."
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="dayHelpCooking"
                      className="block text-sm font-medium"
                    >
                      Ngày giúp bếp
                    </label>
                    <DatePicker
                      id="dayHelpCooking"
                      dateFormat="yyyy-MM-dd"
                      selected={addFormData.dayHelpCooking}
                      onChange={(date) =>
                        setAddFormData({
                          ...addFormData,
                          dayHelpCooking: date,
                        })
                      }
                      required
                      className="bg-gray-50 border mt-1 w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholderText="Năm-Tháng-Ngày"
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                      onClick={() => setShowFormAdd(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ListHelpCooking;
