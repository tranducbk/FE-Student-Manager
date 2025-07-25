"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

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
          `https://be-student-manager.onrender.com/commander/notification/${id}`,
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
        `https://be-student-manager.onrender.com/commander/notification`,
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
        .delete(
          `https://be-student-manager.onrender.com/commander/notification/${regulatoryDocumentId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
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
          `https://be-student-manager.onrender.com/commander/regulatory_documents`,
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
                      Văn bản quy định
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
                  onSubmit={(e) => handleUpdate(e, regulatoryDocumentId)}
                  className="px-6 pt-6 pb-3 z-10"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Chỉnh sửa văn bản
                  </h2>

                  <div className="mb-4">
                    <label
                      htmlFor="title1"
                      className="block text-sm font-medium"
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
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="author2"
                      className="block text-sm font-medium"
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
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="`attachments2`"
                      className="block text-sm font-medium"
                    >
                      Thêm file pdf
                    </label>
                    <input
                      type="file"
                      className="px-4 py-2 hover:bg-gray-100 focus:outline-none bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                      id="attachments2"
                      name="attachments2"
                      onChange={(e) => handleFileUpdate(e)}
                      accept=".pdf"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="content5"
                      className="block text-sm font-medium"
                    >
                      Nội dung
                    </label>
                    <textarea
                      className="h-32 px-3 py-2 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
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
            <div className="rounded-lg w-full">
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
              <div className="flex justify-between font-bold p-5">
                <div>VĂN BẢN QUY ĐỊNH</div>
                <button
                  onClick={() => setShowFormAdd(true)}
                  class="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                >
                  Thêm
                </button>
              </div>
              {document?.map((item) => (
                <div
                  key={item._id}
                  className="w-full flex justify-between bg-white p-5 mt-3 rounded-lg border border-gray-100"
                >
                  <Link href={`/admin/regulatory-documents/${item._id}`}>
                    <div>
                      <b>[{item.author}]</b> {item.title}
                    </div>
                    <div className="text-sm pt-5">
                      {dayjs(item?.dateIssued).format("DD/MM/YYYY")}
                    </div>
                  </Link>
                  <div className="text-sm">
                    <button
                      data-modal-target="authentication-modal"
                      data-modal-toggle="authentication-modal"
                      type="button"
                      onClick={() => handleShowFormUpdate(item._id)}
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
                      onClick={() => handleDelete(item._id)}
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
                  </div>
                </div>
              ))}
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
                  className="px-6 pt-6 pb-3 z-10"
                  id="infoForm"
                >
                  <h2 className="text-xl font-semibold mb-4">Thêm văn bản</h2>

                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium"
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
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium"
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
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="`attachments`"
                      className="block text-sm font-medium"
                    >
                      Thêm file pdf
                    </label>
                    <input
                      type="file"
                      className="px-4 py-2 hover:bg-gray-100 focus:outline-none bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                      id="attachments"
                      name="attachments"
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="content2"
                      className="block text-sm font-medium"
                    >
                      Nội dung
                    </label>
                    <textarea
                      className="h-32 px-3 py-2 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
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

export default RegulatoryDocuments;
