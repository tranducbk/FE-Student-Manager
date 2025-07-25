"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../../components/notify";

const ResetPassword = ({ params }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.admin === true) {
            await axios.get(
              `https://be-student-manager.onrender.com/commander/${decodedToken.id}`,
              {
                headers: {
                  token: `Bearer ${token}`,
                },
              }
            );
            router.push("/admin");
          } else {
            await axios.get(
              `https://be-student-manager.onrender.com/student/${decodedToken.id}`,
              {
                headers: {
                  token: `Bearer ${token}`,
                },
              }
            );
            router.push("/users");
          }
        } catch (error) {
          handleNotify("danger", "", error);
        }
      }
    };

    checkToken();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://be-student-manager.onrender.com/user/reset-password/${params.token}`,
        {
          newPassword,
          confirmPassword,
        }
      );
      handleNotify("success", "Thành công!", "Đặt lại mật khẩu thành công");
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
            Đặt lại mật khẩu
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 "
              >
                Mật khẩu mới
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="additional-name"
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 "
              >
                Nhập lại mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="additional-name"
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
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
