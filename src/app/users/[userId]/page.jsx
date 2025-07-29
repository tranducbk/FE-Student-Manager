"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SideBar from "../../../components/sidebar";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";
import { BASE_URL } from "@/configs";

const UserProfile = ({ params }) => {
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: "Đại học đại trà",
    organization: "Viện ngoại ngữ",
    university: "Đại học Bách Khoa Hà Nội",
    positionGovernment: "Học viên",
    positionParty: "Không",
    avatar:
      "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
  });

  const openForm = () => {
    if (profile) {
      setFormData({
        studentId: profile.studentId || "",
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        gender: profile.gender || "Nam",
        unit: profile.unit || "L1 - H5",
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        rank: profile.rank || "Binh nhì",
        enrollment: profile.enrollment || "",
        positionGovernment: profile.positionGovernment || "Học viên",
        dateOfEnlistment: profile.dateOfEnlistment
          ? new Date(profile.dateOfEnlistment)
          : null,
        classUniversity: profile.classUniversity || "",
        probationaryPartyMember: profile.probationaryPartyMember
          ? new Date(profile.probationaryPartyMember)
          : null,
        organization: profile.organization || "Viện ngoại ngữ",
        fullPartyMember: profile.fullPartyMember
          ? new Date(profile.fullPartyMember)
          : null,
        university: profile.university || "Đại học Bách Khoa Hà Nội",
        positionParty: profile.positionParty || "Không",
        email: profile.email || "",
        hometown: profile.hometown || "",
        educationLevel: profile.educationLevel || "Đại học đại trà",
        avatar:
          profile.avatar ||
          "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
      });
    }
    setShowForm(true);
    document.body.style.overflow = "hidden";
  };

  const closeForm = () => {
    setShowForm(false);
    document.body.style.overflow = "unset";
  };

  const handleAuthenticationModalClick = (event) => {
    if (event.target.id === "authentication-modal") {
      setShowForm(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profile]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/student/${params.userId}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });

    if (event.target.files) {
      const avatar = URL.createObjectURL(event.target.files[0]);
      setFormData({
        ...formData,
        avatar: avatar,
      });
    }
  };

  const handleSubmit = async (e, studentId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}`,
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
        "Chỉnh sửa thông tin cá nhân thành công"
      );
      setProfile(response.data);
      setShowForm(false);
    } catch (error) {
      handleNotify("danger", "Lỗi!", error.response.data);
    }
  };

  const handleChangeDate = (id, date) => {
    setFormData({
      ...formData,
      [id]: date,
    });
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
                      Thông tin cá nhân
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  THÔNG TIN CÁ NHÂN
                </div>
                <button
                  onClick={openForm}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Cập nhật
                </button>
              </div>
              <div className="p-6">
                {profile ? (
                  <div className="flex space-x-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          className="rounded-full w-64 h-64 object-cover border-4 border-gray-200 dark:border-gray-600"
                          src={profile?.avatar}
                          alt="avatar"
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Mã HV: {profile?.studentId}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                          THÔNG TIN SINH VIÊN
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Họ và tên:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.fullName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Giới tính:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.gender}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Sinh ngày:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.birthday
                                ? dayjs(profile?.birthday).format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Năm vào trường:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.enrollment}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Bậc đào tạo:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.educationLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Lớp:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.classUniversity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Khoa/Viện quản lý:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.organization}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Trường:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.university}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Email:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                          THÔNG TIN HỌC VIÊN
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Số điện thoại:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.phoneNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Đơn vị:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.unit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Cấp bậc:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.rank}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Chức vụ:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.positionGovernment}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Nhập ngũ:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.dateOfEnlistment
                                ? dayjs(profile?.dateOfEnlistment).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Đảng viên dự bị:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.probationaryPartyMember
                                ? dayjs(
                                    profile?.probationaryPartyMember
                                  ).format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Đảng viên chính thức:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.fullPartyMember
                                ? dayjs(profile?.fullPartyMember).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Chức vụ đảng:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.positionParty === "Không"
                                ? ""
                                : profile?.positionParty}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Quê quán:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {profile?.hometown}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Không có thông tin
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Không tìm thấy thông tin cá nhân
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-14">
            <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  CHỈNH SỬA THÔNG TIN CÁ NHÂN
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
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
              <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                <div className="w-full max-w-4xl p-6">
                  <div className="w-full flex">
                    <div className="font-bold text-blue-600 dark:text-blue-400 w-1/2">
                      THÔNG TIN HỌC VIÊN
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 w-1/2 pl-3">
                      THÔNG TIN SINH VIÊN
                    </div>
                  </div>
                  <div className="w-full mt-5">
                    <form onSubmit={(e) => handleSubmit(e, profile?._id)}>
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
                            dateFormat="dd/MM/yyyy"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Ngày/Tháng/Năm"
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
                            dateFormat="dd/MM/yyyy"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Ngày/Tháng/Năm"
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
                            dateFormat="dd/MM/yyyy"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Ngày/Tháng/Năm"
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
                            dateFormat="dd/MM/yyyy"
                            className="bg-gray-50 border w-full border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Ngày/Tháng/Năm"
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

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={closeForm}
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 hover:text-gray-900 mr-2"
                        >
                          Hủy
                        </button>
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
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
