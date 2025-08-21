"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { handleNotify } from "../../../components/notify";

import { BASE_URL } from "@/configs";
const RegulatoryDocuments = () => {
  const [document, setDocument] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [regulatoryDocumentId, setRegulatoryDocumentId] = useState(null);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({
    attachments: null,
    dateIssued: format(new Date(), "yyyy-MM-dd"),
  });

  const handleShowFormUpdate = (id) => {
    setRegulatoryDocumentId(id);
    setShowFormEdit(true);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.put(
          `${BASE_URL}/commander/notification/${id}`,
          editFormData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify("success", "Thành công!", "Chỉnh sửa văn bản thành công");
        setShowFormEdit(false);
        fetchRegulatoryDocuments();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
        setShowFormEdit(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAddFormData({
      ...addFormData,
      attachments: file,
    });
  };

  const handleFileUpdate = (e) => {
    const file = e.target.files[0];

    const updatedForm = new FormData();

    for (let key in editFormData) {
      updatedForm.append(key, editFormData[key]);
    }

    updatedForm.append("attachments", file);

    setEditFormData(updatedForm);
  };

  const handleAddFormData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", addFormData.title);
    formData.append("content", addFormData.content);
    formData.append("author", addFormData.author);
    formData.append("attachments", addFormData.attachments);
    formData.append("dateIssued", addFormData.dateIssued);

    try {
      const response = await axios.post(
        `${BASE_URL}/commander/notification`,
        formData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        setDocument([...document, response.data]);
      }
      setShowFormAdd(false);
      fetchRegulatoryDocuments();
      handleNotify("success", "Thành công!", "Thêm văn bản thành công");
    } catch (error) {
      setShowFormAdd(false);

      if (error.response && error.response.data) {
        handleNotify("warning", "Lỗi!", error.response.data);
      } else {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  const handleDelete = (id) => {
    setRegulatoryDocumentId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = (regulatoryDocumentId) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(`${BASE_URL}/commander/notification/${regulatoryDocumentId}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then(() => {
          setDocument(
            document.filter((document) => document.id !== regulatoryDocumentId)
          );
          handleNotify("success", "Thành công!", "Xóa văn bản thành công");
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error));
    }

    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const fetchRegulatoryDocuments = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/regulatory_documents`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setDocument(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchRegulatoryDocuments();
  }, [document]);

  return (
    <>
      <div className="flex">
        <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
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
                      Văn bản quy định
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          {showFormEdit ? (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-20">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                    Chỉnh sửa văn bản
                  </h2>
                  <button
                    onClick={() => setShowFormEdit(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  <form
                    onSubmit={(e) => handleUpdate(e, regulatoryDocumentId)}
                    className="p-6"
                    id="infoForm"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="title1"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        id="title1"
                        name="title1"
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="vd: Ai là người đặt tên cho dòng sông"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="author2"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tác giả
                      </label>
                      <input
                        type="text"
                        id="author2"
                        name="author2"
                        value={editFormData.author}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            author: e.target.value,
                          })
                        }
                        placeholder="vd: PCT"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="attachments2"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Thêm file PDF
                      </label>
                      <input
                        type="file"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                        id="attachments2"
                        name="attachments2"
                        onChange={(e) => handleFileUpdate(e)}
                        accept=".pdf"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="content5"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Nội dung
                      </label>
                      <textarea
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none transition-colors duration-200"
                        id="content5"
                        name="content5"
                        value={editFormData.content}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            content: e.target.value,
                          })
                        }
                        placeholder="Nhập nội dung..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                        onClick={() => setShowFormEdit(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              {showConfirm && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="relative p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:p-5">
                    <button
                      onClick={handleCancelDelete}
                      type="button"
                      className="absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:text-gray-300 dark:hover:text-white"
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
                      className="w-11 h-11 mb-3.5 mx-auto text-red-500"
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
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Bạn có chắc chắn muốn xóa văn bản này?
                    </p>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={handleCancelDelete}
                        data-modal-toggle="deleteModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 dark:hover:text-white focus:z-10"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() =>
                          handleConfirmDelete(regulatoryDocumentId)
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
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  VĂN BẢN QUY ĐỊNH
                </div>
                <button
                  onClick={() => setShowFormAdd(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Thêm
                </button>
              </div>
              {document && document.length > 0 ? (
                document.map((item) => (
                  <div
                    key={item._id}
                    className="w-full flex justify-between bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Link
                      href={`/admin/regulatory-documents/${item._id}`}
                      className="flex-1"
                    >
                      <div className="text-gray-900 dark:text-white font-medium">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          [{item.author}]
                        </span>{" "}
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                        Ngày ban hành:{" "}
                        {dayjs(item?.dateIssued).format("DD/MM/YYYY")}
                      </div>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <button
                        data-modal-target="authentication-modal"
                        data-modal-toggle="authentication-modal"
                        type="button"
                        onClick={() => handleShowFormUpdate(item._id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Không có văn bản nào</p>
                  <p className="text-sm">
                    Hãy thêm văn bản đầu tiên để bắt đầu
                  </p>
                </div>
              )}
            </div>
          </div>
          {showFormAdd ? (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-14">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                    Thêm văn bản mới
                  </h2>
                  <button
                    onClick={() => setShowFormAdd(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                  <form
                    onSubmit={handleAddFormData}
                    className="p-4"
                    id="infoForm"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={addFormData.title}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            title: e.target.value,
                          })
                        }
                        required
                        placeholder="vd: Ai là người đặt tên cho dòng sông"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tác giả
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={addFormData.author}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            author: e.target.value,
                          })
                        }
                        required
                        placeholder="vd: PCT"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="attachments"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Thêm file PDF
                      </label>
                      <input
                        type="file"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                        id="attachments"
                        name="attachments"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="content2"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Nội dung
                      </label>
                      <textarea
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none transition-colors duration-200"
                        id="content2"
                        name="content2"
                        value={addFormData.content}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            content: e.target.value,
                          })
                        }
                        required
                        placeholder="Nhập nội dung..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                        onClick={() => setShowFormAdd(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Thêm
                      </button>
                    </div>
                  </form>
                </div>
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

export default RegulatoryDocuments;
