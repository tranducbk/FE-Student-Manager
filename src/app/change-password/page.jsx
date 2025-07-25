"use client";

import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../components/notify";

const changePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      await axios.put(
        `https://be-student-manager.onrender.com/user/${decodedToken.id}`,
        {
          password,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      handleNotify("success", "Thành công!", "Đổi mật khẩu thành công");
      router.push("/login");
    } catch (error) {
      if (error.response) {
        handleNotify("warning", "Cảnh báo!", error.response.data);
      } else {
        handleNotify("danger", "Lỗi!", error);
      }
    }
  };

  return (
    <>
      <ReactNotifications />
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="http://localhost:3000/logo.png"
            alt="Hệ học viên X"
          />
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">
            Đổi mật khẩu
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleChangePassword}>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 "
                >
                  Mật khẩu cũ
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium leading-6 "
                >
                  Mật khẩu mới
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 "
                >
                  Xác nhận mật khẩu mới
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default changePassword;
