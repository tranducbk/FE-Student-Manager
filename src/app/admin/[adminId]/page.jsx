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

const UserProfile = ({ params }) => {
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    avatar:
      "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
  });

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
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
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/${params.adminId}`,
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

  const handleSubmit = async (e, commanderId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://be-student-manager.onrender.com/commander/${commanderId}`,
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
        "Cập nhật thông tin quân nhân thành công"
      );
      setProfile(response.data);
      setShowForm(false);
    } catch (error) {
      handleNotify("danger", "Lỗi!", error);
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
                      Thông tin quân nhân
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6">
            <div className="bg-white rounded-lg">
              <div className="flex pt-5 pl-6">
                <div className="font-bold">THÔNG TIN QUÂN NHÂN</div>
                <button
                  data-modal-target="authentication-modal"
                  data-modal-toggle="authentication-modal"
                  type="button"
                  onClick={openForm}
                  className="flex ml-4 cursor-pointer text-md font-bold text-custom text-opacity-75 hover:text-blue-700"
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
                  Cập nhật
                </button>
              </div>
              <div className="mt-6 ml-6 pb-5 flex justify-start">
                <div className="w-64">
                  <img
                    className="rounded-full w-64 h-64"
                    src={profile?.avatar}
                    alt="avatar"
                  />
                  <div className="font-bold flex justify-center pt-2">
                    Mã QN: {profile?.commanderId}
                  </div>
                </div>
                <div className="w-calc-240px flex justify-start ml-12 pt-5">
                  <div className="w-1/2 mr-5">
                    <div className="flex pt-5">
                      <div className="font-bold pr-1"> Họ và tên:</div>{" "}
                      {profile?.fullName}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Giới tính:</div>{" "}
                      {profile?.gender}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Sinh ngày:</div>{" "}
                      {profile?.birthday
                        ? dayjs(profile?.birthday).format("DD/MM/YYYY")
                        : ""}
                    </div>
                    <div className="pt-2">
                      <b className="pr-1"> Quê quán:</b> {profile?.hometown}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Năm vào Hệ:</div>{" "}
                      {profile?.startWork}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Số điện thoại:</div>{" "}
                      {profile?.phoneNumber}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Email:</div>{" "}
                      {profile?.email}
                    </div>
                    <div className="pt-2">
                      <b className="pr-1"> Phòng/Ban quản lý:</b>{" "}
                      {profile?.organization}
                    </div>
                  </div>
                  <div className="w-1/2 ml-8 pr-5">
                    <div className="flex pt-5">
                      <div className="font-bold pr-1"> Đơn vị:</div>{" "}
                      {profile?.unit}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Cấp bậc:</div>{" "}
                      {profile?.rank}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Chức vụ:</div>{" "}
                      {profile?.positionGovernment}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Nhập ngũ:</div>{" "}
                      {profile?.dateOfEnlistment
                        ? dayjs(profile?.dateOfEnlistment).format("DD/MM/YYYY")
                        : ""}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1"> Đảng viên dự bị:</div>{" "}
                      {dayjs(profile?.probationaryPartyMember).format(
                        "DD/MM/YYYY"
                      )}
                    </div>
                    <div className="flex pt-2">
                      <div className="font-bold pr-1">
                        {" "}
                        Đảng viên chính thức:
                      </div>{" "}
                      {dayjs(profile?.officialPartyMember).format("DD/MM/YYYY")}
                    </div>
                    <div className="pt-2">
                      <b className="pr-1"> Chức vụ đảng:</b>{" "}
                      {profile?.positionParty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showForm ? (
          <div className="bg-slate-400 z-10 opacity-50 absolute top-0 left-0 right-0 bottom-0"></div>
        ) : (
          ""
        )}
        {showForm ? (
          <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
            onClick={handleAuthenticationModalClick}
            className="overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-10 justify-center items-center max-h-full"
          >
            <div className="bg-white rounded-lg relative mt-32 mx-auto max-w-3xl max-h-full">
              <div className="relative z-20 bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold dark:text-white mx-auto">
                    CẬP NHẬT THÔNG TIN QUÂN NHÂN
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

                <div className="w-full max-w-3xl p-5">
                  <div className="w-full">
                    <form onSubmit={(e) => handleSubmit(e, profile?._id)}>
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="commanderId"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Mã quân nhân
                          </label>
                          <input
                            type="text"
                            id="commanderId"
                            value={formData.commanderId}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="vd: 00000000"
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
                            <option value="H5 - HV XXXX">H5 - HV XXXX</option>
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
                            <option value="Đại úy">Đại úy</option>
                            <option value="Thiếu tá">Thiếu tá</option>
                            <option value="Trung tá">Trung tá</option>
                            <option value="Thượng tá">Thượng tá</option>
                            <option value="Đại tá">Đại tá</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="startWork"
                            className="block mb-2 text-sm font-medium dark:text-white"
                          >
                            Năm vào hệ
                          </label>
                          <input
                            type="number"
                            id="startWork"
                            value={formData.startWork}
                            onChange={handleChange}
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="2010"
                            min="2010"
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
                            <option value="Hệ trưởng">Hệ trưởng</option>
                            <option value="Hệ phó">Hệ phó</option>
                            <option value="Chính trị viên">
                              Chính trị viên
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
                            Phòng/ban quản lý
                          </label>
                          <select
                            id="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="HV XXXX">HV XXXX</option>
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
                            <option value="Ủy viên">Ủy viên</option>
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
                            placeholder="vd: abc@sis.hust.edu.vn"
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
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default UserProfile;
