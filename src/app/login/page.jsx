"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../components/notify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          router.push("/login");
          console.log(error);
        }
      }
    };

    checkToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://be-student-manager.onrender.com/user/login", {
        username,
        password,
      });
      const { accessToken } = res.data;
      localStorage.setItem("token", accessToken);

      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.admin === true) {
        router.push("/admin");
      } else {
        router.push("/users");
      }
      handleNotify("success", "Thành công!", "Đăng nhập thành công");
    } catch (error) {
      if (error.response) {
        handleNotify(
          "warning",
          "Cảnh báo!",
          "Tài khoản hoặc mật khẩu không đúng"
        );
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
            Đăng nhập
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 "
              >
                Tên đăng nhập
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="additional-name"
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 "
                >
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/contact"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Liên hệ với quản trị viên
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
