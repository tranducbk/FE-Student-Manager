"use client";

import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "../../components/notify";
import { BASE_URL } from "@/configs";
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const changePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      await axios.put(
        `${BASE_URL}/user/${decodedToken.id}`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReactNotifications />
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.8) 30%, rgba(79, 70, 229, 0.7) 70%, rgba(147, 51, 234, 0.6) 100%), url('/hvkhqs.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-md border-b border-white/20">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo-msa.png"
                  alt="Logo"
                  className="h-12 my-1 transition-all duration-300"
                />
                <span className="text-xl font-bold text-white">
                  HỌC VIỆN KHOA HỌC QUÂN SỰ
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="/#features"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Tính năng
                </a>
                <a
                  href="/#about"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Giới thiệu
                </a>
                <a
                  href="/#contact"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Liên hệ
                </a>
                <a
                  href="/"
                  className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors"
                >
                  Trang chủ
                </a>
              </div>
            </div>
          </nav>
        </header>

        <div className="flex items-center justify-center px-4 py-8 pt-24">
          <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-center rounded-t-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LockOutlined className="text-xl text-white" />
                </div>
                <h1 className="text-xl font-bold text-white mb-1">
                  Đổi mật khẩu
                </h1>
                <p className="text-blue-100 text-xs">
                  Vui lòng nhập mật khẩu cũ và mật khẩu mới
                </p>
              </div>

              {/* Form */}
              <div className="px-6 py-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Mật khẩu cũ */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu cũ
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showOldPassword ? "text" : "password"}
                        required
                        className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập mật khẩu cũ"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Đổi mật khẩu"
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    ← Quay lại
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-white/80">
                HỆ HỌC VIÊN 5 - Học viện Khoa học Quân sự
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default changePassword;
