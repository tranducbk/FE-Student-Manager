"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const ListUser = () => {
  const router = useRouter();
  const [profile, setProfile] = useState([]);
  const [profileDetail, setProfileDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [id, setId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [unit, setUnit] = useState("");
  const [addFormData, setAddFormData] = useState({
    username: "",
    password: "",
    studentId: "",
    fullName: "",
    gender: "Nam",
    birthday: "",
    hometown: "",
    email: "",
    phoneNumber: "",
    enrollment: 2017,
    classUniversity: "",
    educationLevel: "Đại học đại trà",
    organization: "Viện ngoại ngữ",
    university: "Đại học Bách Khoa Hà Nội",
    unit: "L1 - H5",
    rank: "Binh nhì",
    positionGovernment: "Học viên",
    positionParty: "Không",
    fullPartyMember: "",
    probationaryPartyMember: "",
    dateOfEnlistment: "",
  });
  const [formData, setFormData] = useState({
    educationLevel: "Đại học đại trà",
    organization: "Viện ngoại ngữ",
    university: "Đại học Bách Khoa Hà Nội",
    rank: "Binh nhì",
    positionGovernment: "Học viên",
    positionParty: "Không",
    avatar:
      "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
  });

  const handleAddFormData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("https://be-student-manager.onrender.com/commander/student", addFormData, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      handleNotify("success", "Thành công!", "Thêm học viên thành công");
      setShowFormAdd(false);
      fetchProfile();
    } catch (error) {
      setShowFormAdd(false);
      handleNotify("danger", "Lỗi!", error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setShowFormAdd(false);
  };

  const handleAuthenticationModalClick = (event) => {
    if (event.target.id === "authentication-modal") {
      setShowForm(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentPage]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/student?page=${currentPage}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleConfirmDelete = (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .delete(`https://be-student-manager.onrender.com/commander/student/${id}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then(() => {
          setProfile(profile?.students?.filter((student) => student.id !== id));
          handleNotify("success", "Thành công!", "Xóa học viên thành công");
          fetchProfile();
        })
        .catch((error) => handleNotify("danger", "Lỗi!", error));
    }

    setShowConfirm(false);
  };

  const editStudent = async (studentId) => {
    setSelectedStudentId(studentId);
    setShowForm(true);
  };

  const handleSubmit = async (e, selectedStudentId, profile) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://be-student-manager.onrender.com/commander/student/${selectedStudentId}`,
        formData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      const updatedIndex = profile.findIndex(
        (student) => student._id === selectedStudentId
      );

      if (updatedIndex !== -1) {
        const updatedProfile = [...profile];
        updatedProfile[updatedIndex] = response.data;
        setProfile(updatedProfile);
      }
      handleNotify("success", "Thành công!", "Chỉnh sửa học viên thành công");
      setShowForm(false);
      fetchProfile();
    } catch (error) {
      setShowForm(false);
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });

    if (event.target.files) {
      const avatar = URL.createObjectURL(event.target.files[0]);
      console.log(avatar);
      setFormData({
        ...formData,
        avatar: avatar,
      });
    }
  };

  const handleChangeDate = (id, date) => {
    setFormData({
      ...formData,
      [id]: date,
    });
  };

  const handleDelete = (id) => {
    setId(id);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleRowClick = async (studentId) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/student/${studentId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        setProfileDetail(res.data);
        setShowProfileDetail(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    router.push(`/admin/list-user?fullName=${fullName}&unit=${unit}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/student?page=${currentPage}&fullName=${fullName}&unit=${unit}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setProfile([]);

        setProfile(res.data);
      } catch (error) {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  return (
    <>
      <ReactNotifications />
      <div className="flex">
        <SideBar />
        {showProfileDetail && (
          <>
            <div className="bg-black opacity-50 fixed inset-0 z-30"></div>
            <div
              tabIndex="-1"
              aria-hidden="true"
              className="fixed inset-0 z-40 flex justify-center items-start overflow-y-auto"
            >
              <div className="bg-white rounded-lg shadow-lg relative p-6 max-w-5xl w-full mt-32 mx-auto">
                <button
                  className="absolute hover:text-custom top-0 z-30 text-4xl right-5 text-gray-500"
                  onClick={() => setShowProfileDetail(false)}
                >
                  &times;
                </button>
                <div className="relative z-20 bg-white rounded-lg">
                  <div className="bg-white rounded-lg w-full">
                    <div className="text-2xl font-bold text-center mb-6">
                      THÔNG TIN HỌC VIÊN
                    </div>
                    <div className="flex flex-wrap justify-start">
                      <div className="w-full md:w-1/3 flex flex-col items-center">
                        <img
                          className="rounded-full w-48 h-48"
                          src={profileDetail?.avatar}
                          alt="avatar"
                        />
                        <div className="font-bold text-lg mt-4">
                          Mã HV: {profileDetail?.studentId}
                        </div>
                      </div>
                      <div className="w-full md:w-2/3 flex flex-wrap">
                        <div className="w-full md:w-1/2">
                          <div className="text-lg font-semibold text-indigo-600 mb-2">
                            THÔNG TIN SINH VIÊN
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Họ và tên:</span>{" "}
                            {profileDetail?.fullName}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Giới tính:</span>{" "}
                            {profileDetail?.gender}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Sinh ngày:</span>{" "}
                            {profileDetail?.birthday
                              ? dayjs(profileDetail?.birthday).format(
                                  "DD/MM/YYYY"
                                )
                              : ""}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Năm vào trường:</span>{" "}
                            {profileDetail?.enrollment}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Bậc đào tạo:</span>{" "}
                            {profileDetail?.educationLevel}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Lớp:</span>{" "}
                            {profileDetail?.classUniversity}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">
                              Khoa/Viện quản lý:
                            </span>{" "}
                            {profileDetail?.organization}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Trường:</span>{" "}
                            {profileDetail?.university}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Email:</span>{" "}
                            {profileDetail?.email}
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 pl-4">
                          <div className="text-lg font-semibold text-indigo-600 mb-2">
                            THÔNG TIN HỌC VIÊN
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Số điện thoại:</span>{" "}
                            {profileDetail?.phoneNumber}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Đơn vị:</span>{" "}
                            {profileDetail?.unit}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Cấp bậc:</span>{" "}
                            {profileDetail?.rank}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Chức vụ:</span>{" "}
                            {profileDetail?.positionGovernment}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Nhập ngũ:</span>{" "}
                            {profileDetail?.dateOfEnlistment
                              ? dayjs(profileDetail?.dateOfEnlistment).format(
                                  "DD/MM/YYYY"
                                )
                              : ""}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Đảng viên dự bị:</span>{" "}
                            {profileDetail?.probationaryPartyMember
                              ? dayjs(
                                  profileDetail?.probationaryPartyMember
                                ).format("DD/MM/YYYY")
                              : ""}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">
                              Đảng viên chính thức:
                            </span>{" "}
                            {profileDetail?.fullPartyMember
                              ? dayjs(profileDetail?.fullPartyMember).format(
                                  "DD/MM/YYYY"
                                )
                              : ""}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Chức vụ đảng:</span>{" "}
                            {profileDetail?.positionParty === "Không"
                              ? ""
                              : profileDetail?.positionParty}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Quê quán:</span>{" "}
                            {profileDetail?.hometown}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
                      Danh sách học viên
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          {showFormAdd && (
            <>
              <div className="bg-slate-400 z-10 opacity-50 fixed top-0 left-0 right-0 bottom-0"></div>
              <div
                tabIndex="-1"
                aria-hidden="true"
                className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center max-h-full"
              >
                <div className="bg-white rounded-lg relative mt-32 mx-auto max-w-3xl max-h-full">
                  <div className="relative z-20 bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold dark:text-white mx-auto">
                        THÊM QUÂN NHÂN
                      </h3>
                      <button
                        type="button"
                        onClick={closeForm}
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

                    <div className="w-full max-w-3xl p-5 mb-5">
                      <form onSubmit={handleAddFormData}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                          <div>
                            <label
                              htmlFor="username"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Tên đăng nhập
                            </label>
                            <input
                              type="text"
                              id="username"
                              value={addFormData.username}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  username: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: NamBT"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="password"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Mật khẩu
                            </label>
                            <input
                              type="text"
                              id="password"
                              value={addFormData.password}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  password: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: 02022002"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="studentId"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Mã học viên
                            </label>
                            <input
                              type="text"
                              id="studentId"
                              value={addFormData.studentId}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  studentId: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: 20200001"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="fullName"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              value={addFormData.fullName}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  fullName: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: Nguyễn Văn X"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="phoneNumber"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Số điện thoại
                            </label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              value={addFormData.phoneNumber}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  phoneNumber: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: 0123456789"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="gender"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Giới tính
                            </label>
                            <select
                              id="gender"
                              value={addFormData.gender}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  gender: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="unit"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Đơn vị
                            </label>
                            <select
                              id="unit"
                              value={addFormData.unit}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  unit: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="L1 - H5">L1 - H5</option>
                              <option value="L2 - H5">L2 - H5</option>
                              <option value="L3 - H5">L3 - H5</option>
                              <option value="L4 - H5">L4 - H5</option>
                              <option value="L5 - H5">L5 - H5</option>
                              <option value="L6 - H5">L6 - H5</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="birthday"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Sinh ngày
                            </label>
                            <DatePicker
                              id="birthday"
                              selected={addFormData.birthday}
                              onChange={(date) =>
                                setAddFormData({
                                  ...addFormData,
                                  birthday: date,
                                })
                              }
                              dateFormat="yyyy-MM-dd"
                              className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholderText="Năm-Tháng-Ngày"
                              wrapperClassName="w-full"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="rank"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Cấp bậc
                            </label>
                            <select
                              id="rank"
                              value={addFormData.rank}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  rank: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Binh nhì">Binh nhì</option>
                              <option value="Binh nhất">Binh nhất</option>
                              <option value="Hạ Sỹ">Hạ Sỹ</option>
                              <option value="Trung sỹ">Trung sỹ</option>
                              <option value="Thượng sỹ">Thượng sỹ</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="enrollment"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Năm vào trường
                            </label>
                            <input
                              type="number"
                              id="enrollment"
                              value={addFormData.enrollment}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  enrollment: e.target.value,
                                })
                              }
                              aria-describedby="helper-text-explanation"
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="2017"
                              min="2017"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="positionGovernment"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Chức vụ
                            </label>
                            <select
                              id="positionGovernment"
                              value={addFormData.positionGovernment}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  positionGovernment: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Học viên">Học viên</option>
                              <option value="Lớp phó">Lớp phó</option>
                              <option value="Lớp trưởng">Lớp trưởng</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="educationLevel"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Bậc đào tạo
                            </label>
                            <select
                              id="educationLevel"
                              value={addFormData.educationLevel}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  educationLevel: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Đại học đại trà">
                                Đại học đại trà
                              </option>
                              <option value="Chương trình tiên tiến">
                                Chương trình tiên tiến
                              </option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="dateOfEnlistment"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Nhập ngũ
                            </label>
                            <DatePicker
                              id="dateOfEnlistment"
                              selected={addFormData.dateOfEnlistment}
                              onChange={(date) =>
                                setAddFormData({
                                  ...addFormData,
                                  dateOfEnlistment: date,
                                })
                              }
                              dateFormat="yyyy-MM-dd"
                              className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholderText="Năm-Tháng-Ngày"
                              wrapperClassName="w-full"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="classUniversity"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Lớp
                            </label>
                            <input
                              type="text"
                              id="classUniversity"
                              value={addFormData.classUniversity}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  classUniversity: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: Khoa học máy tính 01 - K65"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="probationaryPartyMember"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Đảng viên dự bị
                            </label>
                            <DatePicker
                              id="probationaryPartyMember"
                              selected={addFormData.probationaryPartyMember}
                              onChange={(date) =>
                                setAddFormData({
                                  ...addFormData,
                                  probationaryPartyMember: date,
                                })
                              }
                              dateFormat="yyyy-MM-dd"
                              className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholderText="Năm-Tháng-Ngày"
                              wrapperClassName="w-full"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="organization"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Khoa/viện quản lý
                            </label>
                            <select
                              id="organization"
                              value={addFormData.organization}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  organization: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Viện ngoại ngữ">
                                Viện ngoại ngữ
                              </option>
                              <option value="Viện kinh tế và quản lý">
                                Viện kinh tế và quản lý
                              </option>
                              <option value="Viện toán và ứng dụng tin học">
                                Viện toán và ứng dụng tin học
                              </option>
                              <option value="Trường điện - điện tử">
                                Trường điện - điện tử
                              </option>
                              <option value="Trường CNTT&TT">
                                Trường CNTT&TT
                              </option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="fullPartyMember"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Đảng viên chính thức
                            </label>
                            <DatePicker
                              id="fullPartyMember"
                              selected={addFormData.fullPartyMember}
                              onChange={(date) =>
                                setAddFormData({
                                  ...addFormData,
                                  fullPartyMember: date,
                                })
                              }
                              dateFormat="yyyy-MM-dd"
                              className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholderText="Năm-Tháng-Ngày"
                              wrapperClassName="w-full"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="university"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Trường
                            </label>
                            <select
                              id="university"
                              value={addFormData.university}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  university: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Đại học Bách Khoa Hà Nội">
                                Đại học Bách Khoa Hà Nội
                              </option>
                              <option value="Đại học Y Hà Nội">
                                Đại học Y Hà Nội
                              </option>
                              <option value=">Đại học Văn Hóa">
                                Đại học Văn Hóa
                              </option>
                              <option value="Đại học Văn Lang">
                                Đại học Văn Lang
                              </option>
                              <option value="Đại học Vinuni">
                                Đại học Vinuni
                              </option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="positionParty"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Chức vụ đảng
                            </label>
                            <select
                              id="positionParty"
                              value={addFormData.positionParty}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  positionParty: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="Không">Không</option>
                              <option value="Đảng viên">Đảng viên</option>
                              <option value="Phó bí thư chi bộ">
                                Phó bí thư chi bộ
                              </option>
                              <option value="Bí thư chi bộ">
                                Bí thư chi bộ
                              </option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={addFormData.email}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  email: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: x.nv200001@sis.hust.edu.vn"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="hometown"
                              className="block mb-2 text-sm font-medium dark:text-white"
                            >
                              Quê quán
                            </label>
                            <input
                              type="text"
                              id="hometown"
                              value={addFormData.hometown}
                              onChange={(e) =>
                                setAddFormData({
                                  ...addFormData,
                                  hometown: e.target.value,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="vd: Hà Nội"
                            />
                          </div>
                        </div>

                        <div className="grid justify-items-end">
                          <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Thêm
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="w-full pt-8 pb-5 pl-5 pr-6">
            <div className="bg-white rounded-lg w-full pr-5">
              {showConfirm && (
                <div className="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 flex justify-center items-center">
                  <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button
                      onClick={handleCancelDelete}
                      type="button"
                      class="absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="deleteModal"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                    <svg
                      class="w-11 h-11 mb-3.5 mx-auto"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <p class="mb-4 dark:text-gray-300">
                      Bạn có chắc chắn muốn xóa?
                    </p>
                    <div class="flex justify-center items-center space-x-4">
                      <button
                        onClick={handleCancelDelete}
                        data-modal-toggle="deleteModal"
                        type="button"
                        class="py-2 px-3 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(id)}
                        type="submit"
                        class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="font-bold pt-5 pl-5 pb-5 flex justify-between">
                <div>DANH SÁCH HỌC VIÊN</div>
                <div
                  onClick={() => setShowFormAdd(true)}
                  className="mr-6 flex hover:text-blue-700 cursor-pointer"
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
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-full ml-5 pr-5 pb-5">
                <form
                  className="flex items-end pb-4"
                  onSubmit={(e) => handleSearch(e)}
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
                <table className="table-auto w-full divide-y border border-gray-200 divide-gray-200 overflow-x-auto">
                  <thead className="bg-sky-100">
                    <tr className="border border-gray-200">
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm text-left uppercase"
                      >
                        họ và tên
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm text-center uppercase"
                      >
                        Cấp bậc
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm text-center uppercase"
                      >
                        chức vụ
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm text-center uppercase"
                      >
                        lớp
                      </th>
                      <th
                        scope="col"
                        className="px-6 border py-3 text-sm text-center uppercase"
                      >
                        Số điện thoại
                      </th>
                      <th
                        scope="col"
                        className="px-2 border py-3 text-sm text-center uppercase"
                      >
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profile?.students?.map((item) => (
                      <tr
                        className="hover:cursor-pointer hover:bg-gray-50"
                        key={item._id}
                      >
                        <td
                          onClick={() => handleRowClick(item._id)}
                          className="px-6 border py-4 whitespace-nowrap"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={item.avatar}
                                alt="avatar"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold">
                                {item.fullName}
                              </div>
                              <div className="text-sm">
                                Mã HV: {item.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          onClick={() => handleRowClick(item._id)}
                          className="px-6 border py-3 whitespace-nowrap text-center"
                        >
                          <div className="text-sm ">{item.rank}</div>
                        </td>
                        <td
                          onClick={() => handleRowClick(item._id)}
                          className="px-6 border py-3 whitespace-nowrap text-center"
                        >
                          <div className="text-sm ">
                            {item.positionGovernment}
                          </div>
                        </td>
                        <td
                          onClick={() => handleRowClick(item._id)}
                          className="px-6 border py-3 whitespace-nowrap text-center"
                        >
                          <div className="text-sm ">{item.unit}</div>
                        </td>
                        <td
                          onClick={() => handleRowClick(item._id)}
                          className="px-6 border py-3 whitespace-nowrap text-center"
                        >
                          <div className="text-sm ">{item.phoneNumber}</div>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm flex ml-8">
                          <button
                            data-modal-target="authentication-modal"
                            data-modal-toggle="authentication-modal"
                            type="button"
                            onClick={() => editStudent(item._id)}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mr-5 pb-5 mt-2">
                <nav aria-label="Page navigation example">
                  <ul className="list-style-none flex">
                    <li>
                      <Link
                        className={`relative mr-1 block rounded bg-transparent px-3 py-1.5 font-bold text-sm transition-all duration-300 ${
                          currentPage <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-200"
                        }`}
                        href={
                          currentPage <= 1
                            ? `/admin/list-user?page=1`
                            : `/admin/list-user?page=${currentPage - 1}`
                        }
                        onClick={() => {
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
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
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                          />
                        </svg>
                      </Link>
                    </li>
                    {Array.from(
                      { length: profile?.totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <li key={pageNumber}>
                        <Link
                          className={`relative mr-1 block rounded bg-transparent px-3 py-1.5 font-bold text-sm transition-all duration-300 ${
                            currentPage === pageNumber
                              ? "bg-blue-200"
                              : "hover:bg-blue-200"
                          }`}
                          href={`/admin/list-user?page=${pageNumber}`}
                          onClick={() => {
                            setCurrentPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        className={`relative block rounded bg-transparent px-3 py-1.5 font-bold text-sm transition-all duration-300 ${
                          currentPage >= profile?.totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-200"
                        }`}
                        href={
                          currentPage >= profile?.totalPages
                            ? `/admin/list-user?page=${profile?.totalPages}`
                            : `/admin/list-user?page=${currentPage + 1}`
                        }
                        onClick={() => {
                          if (currentPage < profile?.totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
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
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {showForm && (
          <>
            <div className="bg-slate-400 z-10 opacity-50 fixed top-0 left-0 right-0 bottom-0"></div>
            <div
              id="authentication-modal"
              tabIndex="-1"
              aria-hidden="true"
              onClick={handleAuthenticationModalClick}
              className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center max-h-full"
            >
              <div className="bg-white rounded-lg relative mt-32 mx-auto max-w-3xl max-h-full">
                <div className="relative z-20 bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold dark:text-white mx-auto">
                      CHỈNH SỬA THÔNG TIN QUÂN NHÂN
                    </h3>
                    <button
                      type="button"
                      onClick={closeForm}
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

                  <div className="w-full max-w-3xl p-5 mb-5">
                    <form
                      onSubmit={(e) =>
                        handleSubmit(e, selectedStudentId, profile?.students)
                      }
                    >
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="studentId"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Mã học viên
                          </label>
                          <input
                            type="text"
                            id="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: 20200001"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="fullName"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: Nguyễn Văn X"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: 0123456789"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="gender"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Giới tính
                          </label>
                          <select
                            id="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="unit"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Đơn vị
                          </label>
                          <select
                            id="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="L1 - H5">L1 - H5</option>
                            <option value="L2 - H5">L2 - H5</option>
                            <option value="L3 - H5">L3 - H5</option>
                            <option value="L4 - H5">L4 - H5</option>
                            <option value="L5 - H5">L5 - H5</option>
                            <option value="L6 - H5">L6 - H5</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="birthday"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Sinh ngày
                          </label>
                          <DatePicker
                            id="birthday"
                            selected={formData.birthday}
                            onChange={(date) =>
                              handleChangeDate("birthday", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Năm-Tháng-Ngày"
                            wrapperClassName="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="rank"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Cấp bậc
                          </label>
                          <select
                            id="rank"
                            value={formData.rank}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Binh nhì">Binh nhì</option>
                            <option value="Binh nhất">Binh nhất</option>
                            <option value="Hạ Sỹ">Hạ Sỹ</option>
                            <option value="Trung sỹ">Trung sỹ</option>
                            <option value="Thượng sỹ">Thượng sỹ</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="enrollment"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Năm vào trường
                          </label>
                          <input
                            type="number"
                            id="enrollment"
                            value={formData.enrollment}
                            onChange={handleChange}
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="2017"
                            min="2017"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="positionGovernment"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Chức vụ
                          </label>
                          <select
                            id="positionGovernment"
                            value={formData.positionGovernment}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Học viên">Học viên</option>
                            <option value="Lớp phó">Lớp phó</option>
                            <option value="Lớp trưởng">Lớp trưởng</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="educationLevel"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Bậc đào tạo
                          </label>
                          <select
                            id="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Đại học đại trà">
                              Đại học đại trà
                            </option>
                            <option value="Chương trình tiên tiến">
                              Chương trình tiên tiến
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="dateOfEnlistment"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Nhập ngũ
                          </label>
                          <DatePicker
                            id="dateOfEnlistment"
                            selected={formData.dateOfEnlistment}
                            onChange={(date) =>
                              handleChangeDate("dateOfEnlistment", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Năm-Tháng-Ngày"
                            wrapperClassName="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="classUniversity"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Lớp
                          </label>
                          <input
                            type="text"
                            id="classUniversity"
                            value={formData.classUniversity}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: Khoa học máy tính 01 - K65"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="probationaryPartyMember"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Đảng viên dự bị
                          </label>
                          <DatePicker
                            id="probationaryPartyMember"
                            selected={formData.probationaryPartyMember}
                            onChange={(date) =>
                              handleChangeDate("probationaryPartyMember", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Năm-Tháng-Ngày"
                            wrapperClassName="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="organization"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Khoa/viện quản lý
                          </label>
                          <select
                            id="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Viện ngoại ngữ">
                              Viện ngoại ngữ
                            </option>
                            <option value="Viện kinh tế và quản lý">
                              Viện kinh tế và quản lý
                            </option>
                            <option value="Viện toán và ứng dụng tin học">
                              Viện toán và ứng dụng tin học
                            </option>
                            <option value="Trường điện - điện tử">
                              Trường điện - điện tử
                            </option>
                            <option value="Trường CNTT&TT">
                              Trường CNTT&TT
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="fullPartyMember"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Đảng viên chính thức
                          </label>
                          <DatePicker
                            id="fullPartyMember"
                            selected={formData.fullPartyMember}
                            onChange={(date) =>
                              handleChangeDate("fullPartyMember", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Năm-Tháng-Ngày"
                            wrapperClassName="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="university"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Trường
                          </label>
                          <select
                            id="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Đại học Bách Khoa Hà Nội">
                              Đại học Bách Khoa Hà Nội
                            </option>
                            <option value="Đại học Y Hà Nội">
                              Đại học Y Hà Nội
                            </option>
                            <option value=">Đại học Văn Hóa">
                              Đại học Văn Hóa
                            </option>
                            <option value="Đại học Văn Lang">
                              Đại học Văn Lang
                            </option>
                            <option value="Đại học Vinuni">
                              Đại học Vinuni
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="positionParty"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Chức vụ đảng
                          </label>
                          <select
                            id="positionParty"
                            value={formData.positionParty}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="Không">Không</option>
                            <option value="Đảng viên">Đảng viên</option>
                            <option value="Phó bí thư chi bộ">
                              Phó bí thư chi bộ
                            </option>
                            <option value="Bí thư chi bộ">Bí thư chi bộ</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: x.nv200001@sis.hust.edu.vn"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="hometown"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Quê quán
                          </label>
                          <input
                            type="text"
                            id="hometown"
                            value={formData.hometown}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: Hà Nội"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium dark:text-white">
                            Thêm ảnh đại diện
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="grid justify-items-end">
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Cập nhật
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ListUser;
