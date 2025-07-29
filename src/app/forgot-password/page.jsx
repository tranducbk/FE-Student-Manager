"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ThemeToggle } from "../../components/ThemeToggle";
import Loader from "../../components/loader";
import { BASE_URL } from "@/configs";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [correct, setCorrect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
          console.log(error);
        }
      }
    };

    checkToken();
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/user/forgot-password`, {
        email,
      });
      setCorrect(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Theme toggle button */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main container */}
      <div className="flex min-h-screen flex-col justify-center px-6 py-16 lg:px-8">
        {loading && <Loader />}

        <div
          className={`sm:mx-auto sm:w-full sm:max-w-md ${
            loading ? "hidden" : ""
          }`}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/login">
              <div className="inline-block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-20 dark:opacity-30"></div>
                  <img
                    className="relative mx-auto h-20 w-auto drop-shadow-lg"
                    src="/logo.png"
                    alt="Hệ học viên 5"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <MailOutlined className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Quên mật khẩu
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Nhập email của bạn để nhận link đặt lại mật khẩu
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none">
                    <MailOutlined className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    readOnly={correct}
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="example@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center p-4 text-sm text-red-800 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <ExclamationCircleOutlined className="mr-2 text-red-500" />
                  {error}
                </div>
              )}

              {/* Success message */}
              {correct && (
                <div className="flex items-center p-4 text-sm text-green-800 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircleOutlined className="mr-2 text-green-500" />
                  Vui lòng kiểm tra email của bạn và làm theo hướng dẫn!
                </div>
              )}

              {/* Submit button */}
              <div>
                {!correct && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </div>
                    ) : (
                      "Gửi link đặt lại mật khẩu"
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <ArrowLeftOutlined className="mr-1" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
