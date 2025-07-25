"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const LearningInformation = () => {
  const [tuitionFee, setTuitionFee] = useState([]);
  const [learningResult, setLearningResult] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [showConfirmTimeTable, setShowConfirmTimeTable] = useState(false);
  const [showConfirmLearn, setShowConfirmLearn] = useState(false);
  const [showConfirmFee, setShowConfirmFee] = useState(false);
  const [timeTableId, setTimeTableId] = useState(null);
  const [learnId, setLearnId] = useState(null);
  const [feeId, setFeeId] = useState(null);
  const [showFormAddTuitionFee, setShowFormAddTuitionFee] = useState(false);
  const [showFormAddTimeTable, setShowFormAddTimeTable] = useState(false);
  const [showFormAddLearn, setShowFormAddLearn] = useState(false);
  const [isOpenTuitionFee, setIsOpenTuitionFee] = useState(false);
  const [isOpenTimeTable, setIsOpenTimeTable] = useState(false);
  const [isOpenLearningResult, setIsOpenLearningResult] = useState(false);
  const [editedTuitionFee, setEditedTuitionFee] = useState({});
  const [editedTimeTable, setEditedTimeTable] = useState({});
  const [editedLearningResult, setEditedLearningResult] = useState({});
  const [addFormDataTuitionFee, setAddFormDataTuitionFee] = useState({});
  const [addFormDataTimeTable, setAddFormDataTimeTable] = useState({});
  const [addFormDataLearn, setAddFormDataLearn] = useState({});

  const handleEditTuitionFee = (id) => {
    setFeeId(id);
    setIsOpenTuitionFee(true);
  };

  const handleEditTimeTable = (id) => {
    setTimeTableId(id);
    setIsOpenTimeTable(true);
  };

  const handleEditLearningResult = (id) => {
    setLearnId(id);
    setIsOpenLearningResult(true);
  };

  const handleUpdateLearningResult = async (e, learnId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        await axios.put(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/learningResult/${learnId}`,
          editedLearningResult,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify(
          "success",
          "Thành công!",
          "Chỉnh sửa kết quả học tập thành công"
        );
        setIsOpenLearningResult(false);
        fetchLearningResult();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
        setIsOpenLearningResult(false);
      }
    }
  };

  const handleUpdateTimeTable = async (e, timeTableId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.put(
          `https://be-student-manager.onrender.com/student/time-table/${timeTableId}`,
          editedTimeTable,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify("success", "Thành công!", "Chỉnh sửa lịch học thành công");
        setIsOpenTimeTable(false);
        fetchTimeTable();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
        setIsOpenLearningResult(false);
      }
    }
  };

  const handleUpdateTuitionFee = async (e, tuitionFeeId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        await axios.put(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/tuitionFee/${tuitionFeeId}`,
          editedTuitionFee,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify("success", "Thành công!", "Chỉnh sửa học phí thành công");
        setIsOpenTuitionFee(false);
        fetchTuitionFee();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
        setIsOpenLearningResult(false);
      }
    }
  };

  const handleAddFormLearn = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://be-student-manager.onrender.com/student/${
          jwtDecode(token).id
        }/learning-information`,
        addFormDataLearn,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify("success", "Thành công!", "Thêm kết quả học tập thành công");
      setLearningResult([...learningResult, response.data]);
      setShowFormAddLearn(false);
      fetchLearningResult();
    } catch (error) {
      setShowFormAddLearn(false);
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const handleAddFormTimeTable = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://be-student-manager.onrender.com/student/${jwtDecode(token).id}/time-table`,
        addFormDataTimeTable,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify("success", "Thành công!", "Thêm lịch học thành công");
      setTimeTable([...timeTable, response.data]);
      setShowFormAddTimeTable(false);
    } catch (error) {
      setShowFormAddTimeTable(false);
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const handleAddFormTuitionFee = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://be-student-manager.onrender.com/student/${jwtDecode(token).id}/tuition-fee`,
        addFormDataTuitionFee,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify("success", "Thành công!", "Thêm học phí thành công");
      setTuitionFee([...tuitionFee, response.data]);
      setShowFormAddTuitionFee(false);
    } catch (error) {
      setShowFormAddTuitionFee(false);
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const handleDeleteTimeTable = (id) => {
    setTimeTableId(id);
    setShowConfirmTimeTable(true);
  };

  const handleDeleteLearn = (id) => {
    setLearnId(id);
    setShowConfirmLearn(true);
  };

  const handleDeleteFee = (id) => {
    setFeeId(id);
    setShowConfirmFee(true);
  };

  const handleConfirmDeleteTimeTable = (timeTableId) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(
          `https://be-student-manager.onrender.com/student/${
            jwtDecode(token).id
          }/time-table/${timeTableId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setTimeTable(
            timeTable.filter((timeTable) => timeTable.id !== timeTableId)
          );
          handleNotify("success", "Thành công!", "Xóa lịch học thành công");
          fetchTimeTable();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error.response.data));
    }

    setShowConfirmTimeTable(false);
  };

  const handleConfirmDeleteLearn = (learnId) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(
          `https://be-student-manager.onrender.com/student/${
            jwtDecode(token).id
          }/learning-information/${learnId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setLearningResult(
            learningResult.filter(
              (learningResult) => learningResult.id !== learnId
            )
          );
          handleNotify(
            "success",
            "Thành công!",
            "Xóa kết quả học tập thành công"
          );
          fetchLearningResult();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error.response.data));
    }

    setShowConfirmLearn(false);
  };

  const handleConfirmDeleteFee = (feeId) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(
          `https://be-student-manager.onrender.com/student/${
            jwtDecode(token).id
          }/tuitionFee/${feeId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setTuitionFee(
            tuitionFee.filter((tuitionFee) => tuitionFee.id !== feeId)
          );
          handleNotify("success", "Thành công!", "Xóa học phí thành công");
          fetchTuitionFee();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error.response.data));
    }

    setShowConfirmFee(false);
  };

  const fetchTimeTable = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/time-table`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTimeTable(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchLearningResult = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/learning-information`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningResult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTuitionFee = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/student/${decodedToken.id}/tuition-fee`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setTuitionFee(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchLearningResult();
    fetchTuitionFee();
    fetchTimeTable();
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
                      Học tập
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white rounded-lg w-full">
              {showConfirmTimeTable && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
                  <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button
                      onClick={() => setShowConfirmTimeTable(false)}
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
                        onClick={() => setShowConfirmTimeTable(false)}
                        data-modal-toggle="deleteModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() =>
                          handleConfirmDeleteTimeTable(timeTableId)
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
                <div>THỜI KHÓA BIỂU</div>
                <button
                  onClick={() => setShowFormAddTimeTable(true)}
                  className="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                >
                  Thêm
                </button>
              </div>
              {isOpenTimeTable ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setIsOpenTimeTable(false)}
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
                      onSubmit={(e) => handleUpdateTimeTable(e, timeTableId)}
                      className="px-6 pt-6 pb-3 z-10"
                      id="infoFormEditTimeTable"
                    >
                      <h2 className="text-xl font-semibold mb-4">
                        Chỉnh sửa thời khóa biểu
                      </h2>

                      <div className="mb-4">
                        <label
                          htmlFor="day2"
                          className="block text-sm font-medium"
                        >
                          Thứ
                        </label>
                        <input
                          type="text"
                          id="day2"
                          name="day2"
                          value={editedTimeTable.day}
                          onChange={(e) =>
                            setEditedTimeTable({
                              ...editedTimeTable,
                              day: e.target.value,
                            })
                          }
                          placeholder="vd: 2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="time2"
                          className="block text-sm font-medium"
                        >
                          Thời gian
                        </label>
                        <input
                          type="text"
                          id="time2"
                          name="time2"
                          value={editedTimeTable.time}
                          onChange={(e) =>
                            setEditedTimeTable({
                              ...editedTimeTable,
                              time: e.target.value,
                            })
                          }
                          placeholder="vd: 06:45 - 10:05"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="classroom2"
                          className="block text-sm font-medium"
                        >
                          Phòng học
                        </label>
                        <input
                          type="text"
                          id="classroom2"
                          name="classroom2"
                          value={editedTimeTable.classroom}
                          onChange={(e) =>
                            setEditedTimeTable({
                              ...editedTimeTable,
                              classroom: e.target.value,
                            })
                          }
                          placeholder="vd: D3-101"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="schoolWeek2"
                          className="block text-sm font-medium"
                        >
                          Tuần học
                        </label>
                        <input
                          type="text"
                          id="schoolWeek2"
                          name="schoolWeek2"
                          value={editedTimeTable.schoolWeek}
                          onChange={(e) =>
                            setEditedTimeTable({
                              ...editedTimeTable,
                              schoolWeek: e.target.value,
                            })
                          }
                          placeholder="vd: 34-42"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setIsOpenTimeTable(false)}
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
              {showFormAddTimeTable ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setShowFormAddTimeTable(false)}
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
                      onSubmit={handleAddFormTimeTable}
                      className="px-6 pt-6 pb-3 z-10"
                      id="infoFormTimeTable"
                    >
                      <h2 className="text-xl font-semibold mb-4">
                        Thêm thời khóa biểu
                      </h2>

                      <div className="mb-4">
                        <label
                          htmlFor="day"
                          className="block text-sm font-medium"
                        >
                          Thứ
                        </label>
                        <input
                          type="text"
                          id="day"
                          name="day"
                          value={addFormDataTimeTable.day}
                          onChange={(e) =>
                            setAddFormDataTimeTable({
                              ...addFormDataTimeTable,
                              day: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium"
                        >
                          Thời gian
                        </label>
                        <input
                          type="text"
                          id="time"
                          name="time"
                          value={addFormDataTimeTable.time}
                          onChange={(e) =>
                            setAddFormDataTimeTable({
                              ...addFormDataTimeTable,
                              time: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 06:45 - 10:05"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="classroom"
                          className="block text-sm font-medium"
                        >
                          Phòng học
                        </label>
                        <input
                          type="text"
                          id="classroom"
                          name="classroom"
                          value={addFormDataTimeTable.classroom}
                          onChange={(e) =>
                            setAddFormDataTimeTable({
                              ...addFormDataTimeTable,
                              classroom: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: D3-101"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="schoolWeek"
                          className="block text-sm font-medium"
                        >
                          Tuần học
                        </label>
                        <input
                          type="text"
                          id="schoolWeek"
                          name="schoolWeek"
                          value={addFormDataTimeTable.schoolWeek}
                          onChange={(e) =>
                            setAddFormDataTimeTable({
                              ...addFormDataTimeTable,
                              schoolWeek: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 34-42"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setShowFormAddTimeTable(false)}
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
              <div className="w-full pl-5 pb-5 pr-5">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-2 py-1 dark:border-white/10"
                      >
                        Thứ
                      </th>
                      <th
                        scope="col"
                        className="border-e whitespace-nowrap border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Thời gian
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Phòng học
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Tuần học
                      </th>
                      <th scope="col" className="border-e border-neutral-200">
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeTable?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap border-e border-neutral-200 font-medium dark:border-white/10">
                          {item.day}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.time}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.classroom}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.schoolWeek}
                        </td>
                        <td className="justify-center text-sm flex">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() => handleEditTimeTable(item._id)}
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
                            onClick={() => handleDeleteTimeTable(item._id)}
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
              {isOpenLearningResult ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setIsOpenLearningResult(false)}
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
                      onSubmit={(e) => handleUpdateLearningResult(e, learnId)}
                      className="px-6 pt-6 pb-3 z-10 grid grid-cols-2 gap-4"
                      id="infoFormEditLearn"
                    >
                      <h2 className="text-xl font-semibold mb-4 col-span-full">
                        Chỉnh sửa kết quả học tập
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
                          value={editedLearningResult.semester}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              semester: e.target.value,
                            })
                          }
                          placeholder="vd: 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="GPA3"
                          className="block text-sm font-medium"
                        >
                          GPA
                        </label>
                        <input
                          type="text"
                          id="GPA3"
                          name="GPA3"
                          value={editedLearningResult.GPA}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              GPA: e.target.value,
                            })
                          }
                          placeholder="vd: 3.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="CPA3"
                          className="block text-sm font-medium"
                        >
                          CPA
                        </label>
                        <input
                          type="text"
                          id="CPA3"
                          name="CPA3"
                          value={editedLearningResult.CPA}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              CPA: e.target.value,
                            })
                          }
                          placeholder="vd: 3.6"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="cumulativeCredit3"
                          className="block text-sm font-medium"
                        >
                          TC tích lũy
                        </label>
                        <input
                          type="text"
                          id="cumulativeCredit3"
                          name="cumulativeCredit3"
                          value={editedLearningResult.cumulativeCredit}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              cumulativeCredit: e.target.value,
                            })
                          }
                          placeholder="vd: 120"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="totalDebt3"
                          className="block text-sm font-medium"
                        >
                          TC nợ đăng ký
                        </label>
                        <input
                          type="text"
                          id="totalDebt3"
                          name="totalDebt3"
                          value={editedLearningResult.totalDebt}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              totalDebt: e.target.value,
                            })
                          }
                          placeholder="vd: 0"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="studentLevel3"
                          className="block text-sm font-medium"
                        >
                          Trình độ
                        </label>
                        <input
                          type="text"
                          id="studentLevel3"
                          name="studentLevel3"
                          value={editedLearningResult.studentLevel}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              studentLevel: e.target.value,
                            })
                          }
                          placeholder="vd: 4"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="warningLevel3"
                          className="block text-sm font-medium"
                        >
                          Cảnh báo
                        </label>
                        <input
                          type="text"
                          id="warningLevel3"
                          name="warningLevel3"
                          value={editedLearningResult.warningLevel}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              warningLevel: e.target.value,
                            })
                          }
                          placeholder="vd: 0"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="learningStatus3"
                          className="block text-sm font-medium"
                        >
                          Trạng thái
                        </label>
                        <input
                          type="text"
                          id="learningStatus3"
                          name="learningStatus3"
                          value={editedLearningResult.learningStatus}
                          onChange={(e) =>
                            setEditedLearningResult({
                              ...editedLearningResult,
                              learningStatus: e.target.value,
                            })
                          }
                          placeholder="vd: Học"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end col-span-full">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setIsOpenLearningResult(false)}
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
              {showConfirmLearn && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
                  <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button
                      onClick={() => setShowConfirmLearn(false)}
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
                        onClick={() => setShowConfirmLearn(false)}
                        data-modal-toggle="deleteModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleConfirmDeleteLearn(learnId)}
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
                <div>KẾT QUẢ HỌC TẬP</div>
                <button
                  onClick={() => setShowFormAddLearn(true)}
                  className="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                >
                  Thêm
                </button>
              </div>
              {showFormAddLearn ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setShowFormAddLearn(false)}
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
                      onSubmit={handleAddFormLearn}
                      className="px-6 pt-6 pb-3 z-10 grid grid-cols-2 gap-4"
                      id="infoFormLearn"
                    >
                      <h2 className="text-xl font-semibold mb-4 col-span-full">
                        Thêm kết quả học tập
                      </h2>

                      <div className="mb-4">
                        <label
                          htmlFor="semester2"
                          className="block text-sm font-medium"
                        >
                          Học kỳ
                        </label>
                        <input
                          type="text"
                          id="semester2"
                          name="semester2"
                          value={addFormDataLearn.semester}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              semester: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="GPA1"
                          className="block text-sm font-medium"
                        >
                          GPA
                        </label>
                        <input
                          type="text"
                          id="GPA1"
                          name="GPA1"
                          value={addFormDataLearn.GPA}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              GPA: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 3.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="CPA1"
                          className="block text-sm font-medium"
                        >
                          CPA
                        </label>
                        <input
                          type="text"
                          id="CPA1"
                          name="CPA1"
                          value={addFormDataLearn.CPA}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              CPA: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 3.6"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="cumulativeCredit1"
                          className="block text-sm font-medium"
                        >
                          TC tích lũy
                        </label>
                        <input
                          type="text"
                          id="cumulativeCredit1"
                          name="cumulativeCredit1"
                          value={addFormDataLearn.cumulativeCredit}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              cumulativeCredit: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 120"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="totalDebt1"
                          className="block text-sm font-medium"
                        >
                          TC nợ đăng ký
                        </label>
                        <input
                          type="text"
                          id="totalDebt1"
                          name="totalDebt1"
                          value={addFormDataLearn.totalDebt}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              totalDebt: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 0"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="studentLevel1"
                          className="block text-sm font-medium"
                        >
                          Trình độ
                        </label>
                        <input
                          type="text"
                          id="studentLevel1"
                          name="studentLevel1"
                          value={addFormDataLearn.studentLevel}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              studentLevel: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 4"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="warningLevel1"
                          className="block text-sm font-medium"
                        >
                          Cảnh báo
                        </label>
                        <input
                          type="text"
                          id="warningLevel1"
                          name="warningLevel1"
                          value={addFormDataLearn.warningLevel}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              warningLevel: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 0"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="learningStatus1"
                          className="block text-sm font-medium"
                        >
                          Trạng thái
                        </label>
                        <input
                          type="text"
                          id="learningStatus1"
                          name="learningStatus1"
                          value={addFormDataLearn.learningStatus}
                          onChange={(e) =>
                            setAddFormDataLearn({
                              ...addFormDataLearn,
                              learningStatus: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: Học"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end col-span-full">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setShowFormAddLearn(false)}
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
              <div className="w-full pl-5 pb-5 pr-5">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Học kỳ
                      </th>
                      <th
                        scope="col"
                        className="border-e whitespace-nowrap border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        GPA
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        CPA
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        TC tích lũy
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        TC nợ đăng ký
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Trình độ
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Cảnh báo
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {learningResult?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap border-e border-neutral-200 font-medium dark:border-white/10">
                          {item.semester}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.GPA}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.CPA}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.cumulativeCredit} tín chỉ
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.totalDebt} tín chỉ
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          Năm {item.studentLevel}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          Mức {item.warningLevel}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {item.learningStatus}
                        </td>
                        <td className="justify-center text-sm flex">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() => handleEditLearningResult(item._id)}
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
                            onClick={() => handleDeleteLearn(item._id)}
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
              {showConfirmFee && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
                  <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button
                      onClick={() => setShowConfirmFee(false)}
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
                        onClick={() => setShowConfirmFee(false)}
                        data-modal-toggle="deleteModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleConfirmDeleteFee(feeId)}
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
                <div>HỌC PHÍ</div>
                <button
                  onClick={() => setShowFormAddTuitionFee(true)}
                  className="bg-transparent hover:bg-custom font-semibold hover:text-white py-0.5 px-2 border border-custom hover:border-transparent rounded"
                >
                  Thêm
                </button>
              </div>
              {isOpenTuitionFee ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setIsOpenTuitionFee(false)}
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
                      onSubmit={(e) => handleUpdateTuitionFee(e, feeId)}
                      className="px-6 pt-6 pb-3 z-10"
                      id="infoFormEditTuitionFee"
                    >
                      <h2 className="text-xl font-semibold mb-4">
                        Chỉnh sửa học phí
                      </h2>

                      <div className="mb-4">
                        <label
                          htmlFor="semester2"
                          className="block text-sm font-medium"
                        >
                          Học kỳ
                        </label>
                        <input
                          type="text"
                          id="semester2"
                          name="semester2"
                          value={editedTuitionFee.semester}
                          onChange={(e) =>
                            setEditedTuitionFee({
                              ...editedTuitionFee,
                              semester: e.target.value,
                            })
                          }
                          placeholder="vd: 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="content2"
                          className="block text-sm font-medium"
                        >
                          Loại tiền phải đóng
                        </label>
                        <input
                          type="text"
                          id="content2"
                          name="content2"
                          value={editedTuitionFee.content}
                          onChange={(e) =>
                            setEditedTuitionFee({
                              ...editedTuitionFee,
                              content: e.target.value,
                            })
                          }
                          placeholder="vd: Tổng học phí học kỳ 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="totalAmount2"
                          className="block text-sm font-medium"
                        >
                          Số tiền phải đóng
                        </label>
                        <input
                          type="text"
                          id="totalAmount2"
                          name="totalAmount2"
                          value={editedTuitionFee.totalAmount}
                          onChange={(e) =>
                            setEditedTuitionFee({
                              ...editedTuitionFee,
                              totalAmount: e.target.value,
                            })
                          }
                          placeholder="vd: 15.000.000"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="status2"
                          className="block text-sm font-medium"
                        >
                          Trạng thái
                        </label>
                        <input
                          type="text"
                          id="status2"
                          name="status2"
                          value={editedTuitionFee.status}
                          onChange={(e) =>
                            setEditedTuitionFee({
                              ...editedTuitionFee,
                              status: e.target.value,
                            })
                          }
                          placeholder="vd: Chưa đóng"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setIsOpenTuitionFee(false)}
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
              <div className="w-full pl-5 pb-5 pr-5">
                <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                  <thead className="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-1.5 py-4 dark:border-white/10"
                      >
                        Học kỳ
                      </th>
                      <th
                        scope="col"
                        className="border-e whitespace-nowrap border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Loại tiền phải đóng
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Số tiền phải đóng
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                      >
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tuitionFee?.map((child) => (
                      <tr
                        key={child._id}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap border-e border-neutral-200 font-medium dark:border-white/10">
                          {child.semester}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {child.content}
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {child.totalAmount}đ
                        </td>
                        <td className="whitespace-nowrap font-medium border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                          {child.status}
                        </td>
                        <td className="justify-center text-sm flex">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() => handleEditTuitionFee(child._id)}
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
                            onClick={() => handleDeleteFee(child._id)}
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
              {showFormAddTuitionFee ? (
                <div className="fixed text-start inset-0 mt-16 flex items-center justify-center z-30">
                  <div className="bg-slate-400 opacity-50 inset-0 fixed"></div>
                  <div className="relative bg-white rounded-lg shadow-lg w-6/12">
                    <button
                      onClick={() => setShowFormAddTuitionFee(false)}
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
                      onSubmit={handleAddFormTuitionFee}
                      className="px-6 pt-6 pb-3 z-10"
                      id="infoFormTuitionFee"
                    >
                      <h2 className="text-xl font-semibold mb-4">
                        Thêm học phí
                      </h2>

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
                          value={addFormDataTuitionFee.semester}
                          onChange={(e) =>
                            setAddFormDataTuitionFee({
                              ...addFormDataTuitionFee,
                              semester: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium"
                        >
                          Loại tiền phải đóng
                        </label>
                        <input
                          type="text"
                          id="content"
                          name="content"
                          value={addFormDataTuitionFee.content}
                          onChange={(e) =>
                            setAddFormDataTuitionFee({
                              ...addFormDataTuitionFee,
                              content: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: Tổng học phí học kỳ 2023.2"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="totalAmount"
                          className="block text-sm font-medium"
                        >
                          Số tiền phải đóng
                        </label>
                        <input
                          type="text"
                          id="totalAmount"
                          name="totalAmount"
                          value={addFormDataTuitionFee.totalAmount}
                          onChange={(e) =>
                            setAddFormDataTuitionFee({
                              ...addFormDataTuitionFee,
                              totalAmount: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: 15.000.000"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium"
                        >
                          Trạng thái
                        </label>
                        <input
                          type="text"
                          id="status"
                          name="status"
                          value={addFormDataTuitionFee.status}
                          onChange={(e) =>
                            setAddFormDataTuitionFee({
                              ...addFormDataTuitionFee,
                              status: e.target.value,
                            })
                          }
                          required
                          placeholder="vd: Chưa đóng"
                          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                          onClick={() => setShowFormAddTuitionFee(false)}
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
        </div>
      </div>
    </>
  );
};

export default LearningInformation;
