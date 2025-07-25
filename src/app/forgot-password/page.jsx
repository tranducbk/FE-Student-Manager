"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Loader from "../../components/loader";

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
      await axios.post("https://be-student-manager.onrender.com/user/forgot-password", {
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
    <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
      {loading && <Loader />}
      <div
        className={`sm:mx-auto sm:w-full sm:max-w-sm ${
          loading ? "hidden" : ""
        }`}
      >
        <img
          className="mx-auto h-20 w-auto"
          src="http://localhost:3000/logo.png"
          alt="Hệ học viên X"
        />
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">
          Quên mật khẩu
        </h2>
      </div>

      <div
        className={`mt-8 sm:mx-auto sm:w-full sm:max-w-sm ${
          loading ? "hidden" : ""
        }`}
      >
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 "
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                readOnly={correct}
                type="email"
                autoComplete="additional-name"
                required
                className="block pl-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {correct && (
            <div className="text-blue-700 text-sm font-bold">
              Vui lòng kiểm tra gmail của bạn và làm theo yêu cầu!
            </div>
          )}
          <div>
            {correct ? (
              ""
            ) : (
              <button
                type="submit"
                className="flex 
                  w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Lấy lại mật khẩu
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
