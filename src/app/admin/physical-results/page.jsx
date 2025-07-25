"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const PhysicalResults = () => {
  const router = useRouter();
  const [physicalResults, setPhysicalResults] = useState(null);
  const [unit, setUnit] = useState("");
  const [semester, setSemester] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [physicalResultId, setPhysicalResultId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({});

  const handleShowFormUpdate = (studentId, id) => {
    setPhysicalResultId(id);
    setStudentId(studentId);
    setShowFormEdit(true);
  };

  const handleUpdate = async (e, studentId, id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.put(
          `https://be-student-manager.onrender.com/commander/${studentId}/physicalResult/${id}`,
          editFormData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify(
          "success",
          "Thành công!",
          "Chỉnh sửa kết quả rèn luyện thể lực thành công"
        );
        setShowFormEdit(false);
        fetchPhysicalResults();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
        setShowFormEdit(false);
      }
    }
  };

  const handleAddFormData = async (e, studentId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://be-student-manager.onrender.com/commander/physicalResult`,
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
        "Thêm kết quả rèn luyện thể lực thành công"
      );
      setPhysicalResults([...physicalResults, response.data]);
      setShowFormAdd(false);
      fetchPhysicalResults();
    } catch (error) {
      setShowFormAdd(false);
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const fetchPhysicalResults = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/physicalResults`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setPhysicalResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchPhysicalResults();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/physical-results?semester=${semester}&unit=${unit}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/physicalResults?semester=${semester}&unit=${unit}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setPhysicalResults([]);

        setPhysicalResults(res.data);
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  const handleDelete = (id, studentId) => {
    setPhysicalResultId(id);
    setStudentId(studentId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = (physicalResultId, studentId) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(
          `https://be-student-manager.onrender.com/commander/physicalResult/${studentId}/${physicalResultId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setPhysicalResults(
            physicalResults.filter(
              (physicalResult) => physicalResult.id !== physicalResultId
            )
          );
          handleNotify(
            "success",
            "Thành công!",
            "Xóa kết quả rèn luyện thể lực thành công"
          );
          fetchPhysicalResults();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error));
    }
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleExportFilePdf = async (e, semester) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `https://be-student-manager.onrender.com/commander/physicalResult/pdf?semester=${semester}`,
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
        link.setAttribute(
          "download",
          `${
            semester
              ? "Ket_qua_ren_luyen_hoc_ky_" + semester
              : "Ket_qua_ren_luyen_the_luc_toan_khoa"
          }.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Lỗi tải xuống file", error);
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
                      Kết quả thể lực
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          {showFormEdit ? (
            <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
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
                  onSubmit={(e) => handleUpdate(e, studentId, physicalResultId)}
                  className="px-6 pt-6 pb-3 z-10 grid grid-cols-2 gap-4"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4 col-span-full">
                    Chỉnh sửa kết quả kiểm tra thể lực của học viên
                  </h2>

                  <div className="mb-4">
                    <label
                      htmlFor="semester3"
                      className="block text-sm font-medium"
                    >
                      Học kỳ
                    </label>
                    <input
                      type="text"
                      id="semester3"
                      name="semester3"
                      value={editFormData.semester}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          semester: e.target.value,
                        })
                      }
                      placeholder="vd: 2023.2"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="run3000m2"
                      className="block text-sm font-medium"
                    >
                      Chạy 3000m
                    </label>
                    <input
                      type="text"
                      id="run3000m2"
                      name="run3000m2"
                      value={editFormData.run3000m}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          run3000m: e.target.value,
                        })
                      }
                      placeholder="vd: 14p30"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="run100m2"
                      className="block text-sm font-medium"
                    >
                      Chạy 100m
                    </label>
                    <input
                      type="text"
                      id="run100m2"
                      name="run100m2"
                      value={editFormData.run100m}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          run100m: e.target.value,
                        })
                      }
                      placeholder="vd: 15s01"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="pullUpBar2"
                      className="block text-sm font-medium"
                    >
                      Xà đơn
                    </label>
                    <input
                      type="text"
                      id="pullUpBar2"
                      name="pullUpBar2"
                      value={editFormData.pullUpBar}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          pullUpBar: e.target.value,
                        })
                      }
                      placeholder="vd: 20"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="swimming100m2"
                      className="block text-sm font-medium"
                    >
                      Bơi 100m
                    </label>
                    <input
                      type="text"
                      id="swimming100m2"
                      name="swimming100m2"
                      value={editFormData.swimming100m}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          swimming100m: e.target.value,
                        })
                      }
                      placeholder="vd: 45s01"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="practise2"
                      className="block text-sm font-medium"
                    >
                      Xếp loại
                    </label>
                    <input
                      type="text"
                      id="practise2"
                      name="practise2"
                      value={editFormData.practise}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          practise: e.target.value,
                        })
                      }
                      placeholder="vd: Khá"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-full flex justify-end">
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
            <div className="bg-white rounded-lg w-full">
              {showConfirm && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
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
                        onClick={() =>
                          handleConfirmDelete(physicalResultId, studentId)
                        }
                        type="submit"
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="font-bold p-5 flex justify-between">
                <div>KẾT QUẢ THỂ LỰC HỌC VIÊN</div>
                <div className="flex">
                  <button
                    class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded mr-2"
                    onClick={(e) => handleExportFilePdf(e, semester)}
                  >
                    Xuất
                  </button>
                  <button
                    onClick={() => setShowFormAdd(true)}
                    class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                  >
                    Thêm
                  </button>
                </div>
              </div>
              <div className="w-full pl-5 pb-5 pr-5">
                <form
                  className="flex items-end"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex">
                    <div>
                      <label
                        htmlFor="semester"
                        className="block mb-1 text-sm font-medium dark:text-white"
                      >
                        Chọn học kỳ
                      </label>
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="bg-gray-50 border w-56 border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="2022.1">2022.1</option>
                        <option value="2022.2">2022.2</option>
                        <option value="2022.3">2022.3</option>
                        <option value="2023.1">2023.1</option>
                        <option value="2023.2">2023.2</option>
                        <option value="2023.3">2023.3</option>
                      </select>
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
                      <th scope="col" className="border-e border-neutral-200">
                        Học kỳ
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-2"
                      >
                        Họ và tên
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Đơn vị
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Chạy 100m
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-4 px-2"
                      >
                        Chạy 3000m
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Xà đơn
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 py-4 px-2"
                      >
                        Bơi 100m
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Xếp loại
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {physicalResults?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {item.semester}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          {item.fullName}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {item.unit}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {item.run100m}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e py-4 px-2 border-neutral-200 dark:border-white/10">
                          {item.run3000m}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          {item.pullUpBar} cái
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          {item.swimming100m}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 dark:border-white/10">
                          {item.practise}
                        </td>
                        <td className="justify-center text-sm flex">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() =>
                              handleShowFormUpdate(item.studentId, item._id)
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
            <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
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
                  className="px-6 pt-6 pb-3 z-10 grid grid-cols-2 gap-4"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4 col-span-full">
                    Thêm kết quả kiểm tra thể lực của học viên
                  </h2>

                  <div className="mb-4 col-span-full">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Học viên
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
                      placeholder="vd: Nguyễn Văn A"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="semester"
                      className="block text-sm font-medium"
                    >
                      Học kỳ
                    </label>
                    <input
                      type="text"
                      id="semester"
                      name="semester"
                      value={addFormData.semester}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          semester: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: 2023.2"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="run3000m"
                      className="block text-sm font-medium"
                    >
                      Chạy 3000m
                    </label>
                    <input
                      type="text"
                      id="run3000m"
                      name="run3000m"
                      value={addFormData.run3000m}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          run3000m: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: 14p30"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="run100m"
                      className="block text-sm font-medium"
                    >
                      Chạy 100m
                    </label>
                    <input
                      type="text"
                      id="run100m"
                      name="run100m"
                      value={addFormData.run100m}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          run100m: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: 15s01"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="pullUpBar"
                      className="block text-sm font-medium"
                    >
                      Xà đơn
                    </label>
                    <input
                      type="text"
                      id="pullUpBar"
                      name="pullUpBar"
                      value={addFormData.pullUpBar}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          pullUpBar: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: 20"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="swimming100m"
                      className="block text-sm font-medium"
                    >
                      Bơi 100m
                    </label>
                    <input
                      type="text"
                      id="swimming100m"
                      name="swimming100m"
                      value={addFormData.swimming100m}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          swimming100m: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: 45s01"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="practise"
                      className="block text-sm font-medium"
                    >
                      Xếp loại
                    </label>
                    <input
                      type="text"
                      id="practise"
                      name="practise"
                      value={addFormData.practise}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          practise: e.target.value,
                        })
                      }
                      required
                      placeholder="vd: Khá"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-full flex justify-end">
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

export default PhysicalResults;
