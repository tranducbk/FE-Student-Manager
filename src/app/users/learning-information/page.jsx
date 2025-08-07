"use client";

import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";
import { BASE_URL } from "@/configs";

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
    const timeTableItem = timeTable.find((item) => item._id === id);
    if (timeTableItem) {
      // Parse time string to startTime and endTime
      let startTime = "";
      let endTime = "";
      if (timeTableItem.time && timeTableItem.time.includes(" - ")) {
        const timeParts = timeTableItem.time.split(" - ");
        startTime = timeParts[0];
        endTime = timeParts[1];
      }

      setEditedTimeTable({
        day: timeTableItem.day || "",
        subject: timeTableItem.subject || "",
        startTime: startTime,
        endTime: endTime,
        classroom: timeTableItem.classroom || "",
        schoolWeek: timeTableItem.schoolWeek || "",
        notes: timeTableItem.notes || "",
        time: timeTableItem.time || "",
      });
    }
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
          `${BASE_URL}/student/${decodedToken.id}/learningResult/${learnId}`,
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
      // Validate thời gian
      if (editedTimeTable.startTime && editedTimeTable.endTime) {
        const startTime = new Date(
          `2000-01-01T${editedTimeTable.startTime}:00`
        );
        const endTime = new Date(`2000-01-01T${editedTimeTable.endTime}:00`);

        if (startTime >= endTime) {
          handleNotify(
            "danger",
            "Lỗi!",
            "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
          );
          return;
        }
      }

      // Tạo time string từ startTime và endTime
      const timeString =
        editedTimeTable.startTime && editedTimeTable.endTime
          ? `${editedTimeTable.startTime} - ${editedTimeTable.endTime}`
          : editedTimeTable.time || "";

      const formData = {
        ...editedTimeTable,
        time: timeString,
      };

      try {
        const response = await axios.put(
          `${BASE_URL}/student/time-table/${timeTableId}`,
          formData,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        handleNotify(
          "success",
          "Thành công!",
          response.data.message ||
            "Chỉnh sửa lịch học thành công và đã cập nhật lịch cắt cơm tự động"
        );
        setIsOpenTimeTable(false);
        fetchTimeTable();
      } catch (error) {
        handleNotify("danger", "Lỗi!", error.response.data);
        setIsOpenTimeTable(false);
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
          `${BASE_URL}/student/${decodedToken.id}/tuitionFee/${tuitionFeeId}`,
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
        `${BASE_URL}/student/${jwtDecode(token).id}/learning-information`,
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

    // Validate thời gian
    if (addFormDataTimeTable.startTime && addFormDataTimeTable.endTime) {
      const startTime = new Date(
        `2000-01-01T${addFormDataTimeTable.startTime}:00`
      );
      const endTime = new Date(`2000-01-01T${addFormDataTimeTable.endTime}:00`);

      if (startTime >= endTime) {
        handleNotify(
          "danger",
          "Lỗi!",
          "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
        );
        return;
      }
    }

    // Tạo time string từ startTime và endTime
    const timeString =
      addFormDataTimeTable.startTime && addFormDataTimeTable.endTime
        ? `${addFormDataTimeTable.startTime} - ${addFormDataTimeTable.endTime}`
        : addFormDataTimeTable.time || "";

    const formData = {
      ...addFormDataTimeTable,
      time: timeString,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/student/${jwtDecode(token).id}/time-table`,
        formData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify(
        "success",
        "Thành công!",
        response.data.message ||
          "Thêm lịch học thành công và đã cập nhật lịch cắt cơm tự động"
      );
      setTimeTable([...timeTable, response.data]);
      setShowFormAddTimeTable(false);
      // Reset form
      setAddFormDataTimeTable({});
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
        `${BASE_URL}/student/${jwtDecode(token).id}/tuition-fee`,
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
          `${BASE_URL}/student/${
            jwtDecode(token).id
          }/time-table/${timeTableId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setTimeTable(
            timeTable.filter((timeTable) => timeTable.id !== timeTableId)
          );
          handleNotify(
            "success",
            "Thành công!",
            response.data.message ||
              "Xóa lịch học thành công và đã cập nhật lịch cắt cơm tự động"
          );
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
          `${BASE_URL}/student/${
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
    setFeeId(feeId);
    setShowConfirmFee(true);
  };

  // Function để cập nhật lịch cắt cơm tự động
  const handleUpdateAutoCutRice = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        handleNotify(
          "info",
          "Đang xử lý...",
          "Đang cập nhật lịch cắt cơm tự động"
        );

        await axios.post(
          `${BASE_URL}/student/${decodedToken.id}/auto-cut-rice`,
          {},
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        handleNotify(
          "success",
          "Thành công!",
          "Cập nhật lịch cắt cơm tự động thành công"
        );
      } catch (error) {
        handleNotify(
          "danger",
          "Lỗi!",
          error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật lịch cắt cơm"
        );
      }
    }
  };

  const fetchTimeTable = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      try {
        const res = await axios.get(
          `${BASE_URL}/student/${decodedToken.id}/time-table`,
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
          `${BASE_URL}/student/${decodedToken.id}/learning-information`,
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
          `${BASE_URL}/student/${decodedToken.id}/tuition-fee`,
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
                      Học tập
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  THỜI KHÓA BIỂU
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateAutoCutRice}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 border border-green-600 hover:border-green-700 rounded-lg transition-colors duration-200 flex items-center"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Cập nhật lịch cắt cơm
                  </button>
                  <button
                    onClick={() => setShowFormAddTimeTable(true)}
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Thêm
                  </button>
                </div>
              </div>
              <div className="w-full pl-6 pb-6 pr-6 mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <tr>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Thứ
                        </th>
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
                          Môn học
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Phòng học
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Tuần học
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Tùy chọn
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {timeTable?.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.day}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.time}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.subject || "N/A"}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.classroom}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.schoolWeek}
                          </td>
                          <td className="flex justify-center items-center space-x-2 py-4 px-4">
                            <button
                              data-modal-target="authentication-modal"
                              data-modal-toggle="authentication-modal"
                              type="button"
                              onClick={() => handleEditTimeTable(item._id)}
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
                              onClick={() => handleDeleteTimeTable(item._id)}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  KẾT QUẢ HỌC TẬP
                </div>
                <button
                  onClick={() => setShowFormAddLearn(true)}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm
                </button>
              </div>
              <div className="w-full pl-6 pb-6 pr-6 mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <tr>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Học kỳ
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          GPA
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          CPA
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          TC tích lũy
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          TC nợ đăng ký
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Trình độ
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Cảnh báo
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Tùy chọn
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {learningResult?.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.semester}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.GPA}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.CPA}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.cumulativeCredit} tín chỉ
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.totalDebt} tín chỉ
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            Năm {item.studentLevel}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            Mức {item.warningLevel}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {item.learningStatus}
                          </td>
                          <td className="flex justify-center items-center space-x-2 py-4 px-4">
                            <button
                              data-modal-target="authentication-modal"
                              data-modal-toggle="authentication-modal"
                              type="button"
                              onClick={() => handleEditLearningResult(item._id)}
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
                              onClick={() => handleDeleteLearn(item._id)}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  HỌC PHÍ
                </div>
                <button
                  onClick={() => setShowFormAddTuitionFee(true)}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm
                </button>
              </div>
              <div className="w-full pl-6 pb-6 pr-6 mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 text-center text-sm font-light text-gray-900 dark:text-white rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <tr>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Học kỳ
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Loại tiền phải đóng
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Số tiền phải đóng
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="border-r border-gray-200 dark:border-gray-600 py-3 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Tùy chọn
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {tuitionFee?.map((child) => (
                        <tr
                          key={child._id}
                          className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {child.semester}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {child.content}
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {child.totalAmount}đ
                          </td>
                          <td className="whitespace-nowrap font-medium border-r border-gray-200 dark:border-gray-600 py-4 px-4">
                            {child.status}
                          </td>
                          <td className="flex justify-center items-center space-x-2 py-4 px-4">
                            <button
                              data-modal-target="authentication-modal"
                              data-modal-toggle="authentication-modal"
                              type="button"
                              onClick={() => handleEditTuitionFee(child._id)}
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
                              onClick={() => handleDeleteFee(child._id)}
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
      </div>

      {/* Modal Thêm Thời Khóa Biểu */}
      {showFormAddTimeTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Thêm thời khóa biểu
              </h2>
              <button
                onClick={() => setShowFormAddTimeTable(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={handleAddFormTimeTable}
                className="p-4"
                id="infoFormTimeTable"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="day"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thứ
                    </label>
                    <select
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    >
                      <option value="">Chọn thứ</option>
                      <option value="Thứ 2">Thứ 2</option>
                      <option value="Thứ 3">Thứ 3</option>
                      <option value="Thứ 4">Thứ 4</option>
                      <option value="Thứ 5">Thứ 5</option>
                      <option value="Thứ 6">Thứ 6</option>
                      <option value="Thứ 7">Thứ 7</option>
                      <option value="Chủ nhật">Chủ nhật</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Môn học
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={addFormDataTimeTable.subject}
                      onChange={(e) =>
                        setAddFormDataTimeTable({
                          ...addFormDataTimeTable,
                          subject: e.target.value,
                        })
                      }
                      required
                      placeholder="VD: Toán học"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={addFormDataTimeTable.startTime}
                      onChange={(e) =>
                        setAddFormDataTimeTable({
                          ...addFormDataTimeTable,
                          startTime: e.target.value,
                        })
                      }
                      required
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thời gian kết thúc
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={addFormDataTimeTable.endTime}
                      onChange={(e) =>
                        setAddFormDataTimeTable({
                          ...addFormDataTimeTable,
                          endTime: e.target.value,
                        })
                      }
                      required
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="classroom"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      placeholder="VD: D3-101"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="schoolWeek"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      placeholder="VD: 1-15"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={addFormDataTimeTable.notes}
                    onChange={(e) =>
                      setAddFormDataTimeTable({
                        ...addFormDataTimeTable,
                        notes: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Ghi chú về lịch học..."
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setShowFormAddTimeTable(false)}
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
      )}

      {/* Modal Sửa Thời Khóa Biểu */}
      {isOpenTimeTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Chỉnh sửa thời khóa biểu
              </h2>
              <button
                onClick={() => setIsOpenTimeTable(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={(e) => handleUpdateTimeTable(e, timeTableId)}
                className="p-4"
                id="infoFormEditTimeTable"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="day2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thứ
                    </label>
                    <select
                      id="day2"
                      name="day2"
                      value={editedTimeTable.day}
                      onChange={(e) =>
                        setEditedTimeTable({
                          ...editedTimeTable,
                          day: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    >
                      <option value="">Chọn thứ</option>
                      <option value="Thứ 2">Thứ 2</option>
                      <option value="Thứ 3">Thứ 3</option>
                      <option value="Thứ 4">Thứ 4</option>
                      <option value="Thứ 5">Thứ 5</option>
                      <option value="Thứ 6">Thứ 6</option>
                      <option value="Thứ 7">Thứ 7</option>
                      <option value="Chủ nhật">Chủ nhật</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="subject2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Môn học
                    </label>
                    <input
                      type="text"
                      id="subject2"
                      name="subject2"
                      value={editedTimeTable.subject}
                      onChange={(e) =>
                        setEditedTimeTable({
                          ...editedTimeTable,
                          subject: e.target.value,
                        })
                      }
                      placeholder="VD: Toán học"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="startTime2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="time"
                      id="startTime2"
                      name="startTime2"
                      value={editedTimeTable.startTime}
                      onChange={(e) =>
                        setEditedTimeTable({
                          ...editedTimeTable,
                          startTime: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Thời gian kết thúc
                    </label>
                    <input
                      type="time"
                      id="endTime2"
                      name="endTime2"
                      value={editedTimeTable.endTime}
                      onChange={(e) =>
                        setEditedTimeTable({
                          ...editedTimeTable,
                          endTime: e.target.value,
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="classroom2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      placeholder="VD: D3-101"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="schoolWeek2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      placeholder="VD: 1-15"
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="notes2"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    id="notes2"
                    name="notes2"
                    value={editedTimeTable.notes}
                    onChange={(e) =>
                      setEditedTimeTable({
                        ...editedTimeTable,
                        notes: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Ghi chú về lịch học..."
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setIsOpenTimeTable(false)}
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
      )}

      {/* Modal Xác nhận xóa */}
      {showConfirmTimeTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Xác nhận xóa
              </h2>
              <button
                onClick={() => setShowConfirmTimeTable(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
                Bạn có chắc chắn muốn xóa thời khóa biểu này?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmTimeTable(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleConfirmDeleteTimeTable(timeTableId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Kết Quả Học Tập */}
      {showFormAddLearn && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Thêm kết quả học tập
              </h2>
              <button
                onClick={() => setShowFormAddLearn(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={handleAddFormLearn}
                className="p-4"
                id="infoFormLearn"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="semester2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="GPA1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="CPA1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="cumulativeCredit1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="totalDebt1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="studentLevel1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="warningLevel1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="learningStatus1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setShowFormAddLearn(false)}
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
      )}

      {/* Modal Sửa Kết Quả Học Tập */}
      {isOpenLearningResult && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Chỉnh sửa kết quả học tập
              </h2>
              <button
                onClick={() => setIsOpenLearningResult(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={(e) => handleUpdateLearningResult(e, learnId)}
                className="p-4"
                id="infoFormEditLearn"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="semester3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="GPA3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="CPA3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="cumulativeCredit3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="totalDebt3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="studentLevel3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="warningLevel3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="learningStatus3"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setIsOpenLearningResult(false)}
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
      )}

      {/* Modal Thêm Học Phí */}
      {showFormAddTuitionFee && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Thêm học phí
              </h2>
              <button
                onClick={() => setShowFormAddTuitionFee(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={handleAddFormTuitionFee}
                className="p-4"
                id="infoFormTuitionFee"
              >
                <div className="mb-4">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="totalAmount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setShowFormAddTuitionFee(false)}
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
      )}

      {/* Modal Sửa Học Phí */}
      {isOpenTuitionFee && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-12">
                Chỉnh sửa học phí
              </h2>
              <button
                onClick={() => setIsOpenTuitionFee(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form
                onSubmit={(e) => handleUpdateTuitionFee(e, feeId)}
                className="p-4"
                id="infoFormEditTuitionFee"
              >
                <div className="mb-4">
                  <label
                    htmlFor="semester2"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="content2"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="totalAmount2"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="status2"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => setIsOpenTuitionFee(false)}
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
      )}
    </>
  );
};

export default LearningInformation;
