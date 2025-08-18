"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../components/notify";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Input } from "antd";
import { BASE_URL } from "@/configs";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.admin === true) {
            await axios.get(`${BASE_URL}/commander/${decodedToken.id}`, {
              headers: {
                token: `Bearer ${token}`,
              },
            });
            router.push("/admin");
          } else {
            await axios.get(`${BASE_URL}/student/${decodedToken.id}`, {
              headers: {
                token: `Bearer ${token}`,
              },
            });
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
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/user/login`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ReactNotifications />

      {/* Ant Design Dark Mode Styles */}
      <style jsx global>{`
        .ant-input {
          background-color: rgb(249 250 251) !important;
          border-color: rgb(209 213 219) !important;
          color: rgb(17 24 39) !important;
          border-radius: 8px !important;
          border-width: 1px !important;
        }

        .dark .ant-input {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(255 255 255) !important;
        }

        .ant-input::placeholder {
          color: rgb(156 163 175) !important;
        }

        .dark .ant-input::placeholder {
          color: rgb(107 114 128) !important;
        }

        .ant-input:focus,
        .ant-input-focused {
          border-color: rgb(37 99 235) !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
        }

        .dark .ant-input:focus,
        .dark .ant-input-focused {
          border-color: rgb(59 130 246) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }

        .ant-input-password {
          background-color: rgb(249 250 251) !important;
          border-color: rgb(209 213 219) !important;
          color: rgb(17 24 39) !important;
          border-radius: 8px !important;
          border-width: 1px !important;
        }

        .dark .ant-input-password {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(255 255 255) !important;
        }

        .ant-input-password .ant-input {
          background-color: transparent !important;
          border: none !important;
          color: inherit !important;
        }

        .ant-input-password .anticon {
          color: rgb(156 163 175) !important;
        }

        .dark .ant-input-password .anticon {
          color: rgb(107 114 128) !important;
        }

        .ant-input-password .anticon:hover {
          color: rgb(75 85 99) !important;
        }

        .dark .ant-input-password .anticon:hover {
          color: rgb(156 163 175) !important;
        }

        /* Ant Notification theming */
        .light-notification.ant-notification-notice,
        .light-notification {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(229, 231, 235, 0.9) !important; /* gray-200 */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .light-notification .ant-notification-notice-message,
        .light-notification .ant-notification-notice-description {
          color: rgb(17, 24, 39) !important; /* gray-900 */
        }
        .light-notification .anticon,
        .light-notification .ant-notification-notice-close {
          color: rgb(75, 85, 99) !important; /* gray-600 */
        }

        .dark-notification.ant-notification-notice,
        .dark-notification {
          background-color: rgba(31, 41, 55, 0.95) !important; /* gray-800 */
          border: 1px solid rgba(55, 65, 81, 0.9) !important; /* gray-700 */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5),
            0 4px 6px -2px rgba(0, 0, 0, 0.3) !important;
        }
        .dark-notification .ant-notification-notice-message,
        .dark-notification .ant-notification-notice-description {
          color: rgb(255, 255, 255) !important;
        }
        .dark-notification .anticon,
        .dark-notification .ant-notification-notice-close {
          color: rgb(156, 163, 175) !important; /* gray-400 */
        }
      `}</style>

      {/* Background gradient */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Theme toggle button */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Main content */}
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-20 dark:opacity-30"></div>
                <img
                  className="relative mx-auto h-24 w-auto drop-shadow-lg"
                  src="/image.png"
                  alt="Hệ học viên 5"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-8 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
              Đăng nhập
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Chào mừng bạn đến với hệ thống quản lý Hệ học viên 5 - HVKHQS
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            {/* Login card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white transition-colors duration-200"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="mt-2">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                      className="w-full"
                      size="large"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Mật khẩu
                    </label>
                    <div className="text-sm">
                      <Link
                        href="/forgot-password"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Input.Password
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full"
                      size="large"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang đăng nhập...
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/80 dark:bg-gray-800/80 px-2 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Cần hỗ trợ?
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold leading-6 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Liên hệ với quản trị viên
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
