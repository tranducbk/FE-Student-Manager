"use client";

import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TabNotification from "./tabNotification";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const router = useRouter();
  const frameRef = useRef(null);

  useEffect(() => {
    fetchDocuments();

    const interval = setInterval(fetchDocuments, 50000);

    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://be-student-manager.onrender.com/commander/studentNotifications/${
          jwtDecode(token).id
        }`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (frameRef.current && !frameRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.admin === true) {
          const res = await axios.get(
            `https://be-student-manager.onrender.com/commander/${decodedToken.id}`,
            {
              headers: {
                token: `Bearer ${token}`,
              },
            }
          );

          setUserDetail(res.data);
        } else {
          const res = await axios.get(
            `https://be-student-manager.onrender.com/student/${decodedToken.id}`,
            {
              headers: {
                token: `Bearer ${token}`,
              },
            }
          );

          setUserDetail(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const res = await axios.get(
          `https://be-student-manager.onrender.com/user/${decodedToken.id}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post("https://be-student-manager.onrender.com/user/logout", null, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOutsideClick = () => {
    setDropdownOpen(false);
  };

  const handleUpdateIsRead = async (e, notificationId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        await axios.put(
          `https://be-student-manager.onrender.com/commander/notification/${decodedToken.id}/${notificationId}`,
          { isRead: true },
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc._id === notificationId ? { ...doc, isRead: true } : doc
          )
        );
        setDropdownOpen(false);
        router.push(`/users/notification/${notificationId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const unreadCount = Array.isArray(documents)
    ? documents.filter((doc) => !doc.isRead).length
    : 0;
  return (
    <header className="fixed z-50 shadow-md w-full">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link
            href={`/${user?.isAdmin ? "admin" : "users"}`}
            className="flex items-center"
          >
            <img
              src="http://localhost:3000/logo.png"
              className="mr-3 h-9 md:h-12"
              alt="H5 Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              HỆ HỌC VIÊN 5
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {user?.isAdmin ? (
              ""
            ) : (
              <div className="mr-4">
                <div onClick={handleDropdownClick}>
                  <TabNotification count={unreadCount} />
                </div>
                {dropdownOpen && (
                  <>
                    <div
                      onClick={handleOutsideClick}
                      className="fixed inset-0 h-full w-full z-10"
                    ></div>

                    <div
                      className="absolute right-11 mt-2 border rounded-lg bg-white shadow-lg overflow-hidden overflow-y-auto z-30 w-96 h-120"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <div className="text-center font-bold py-3 rounded-tl-lg">
                          Thông báo
                        </div>
                        {documents?.map((doc) => (
                          <div
                            key={doc._id}
                            onClick={(e) => handleUpdateIsRead(e, doc._id)}
                            className="flex items-center mx-2 my-1 cursor-pointer"
                          >
                            <p
                              className={
                                doc.isRead
                                  ? `text-base p-2 w-full border rounded-lg hover:bg-gray-100`
                                  : `text-base p-2 w-full border rounded-lg bg-blue-50`
                              }
                            >
                              <span className="font-bold">[{doc.author}]</span>{" "}
                              {doc.title}{" "}
                              <div className="mt-1 text-rose-600 text-sm">
                                {dayjs(doc.dateIssued).format("DD/MM/YYYY")}
                              </div>
                            </p>
                          </div>
                        ))}
                      </div>
                      <a href="#" className="block text-center text-sm py-2">
                        Xem tất cả thông báo
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              id="dropdownAvatarNameButton"
              data-dropdown-toggle="dropdownAvatarName"
              className="flex items-center text-md pe-1 font-medium  rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 dark:text-white"
              type="button"
              onClick={toggleDropdown}
            >
              <img
                className="w-8 h-8 me-2 rounded-full"
                src={userDetail?.avatar}
                alt="user photo"
              />
              {user?.username}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div ref={frameRef} className="relative">
              {isOpen && (
                <div className="z-10 absolute top-5 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-56 dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3 text-base hover:text-blue-600 dark:text-white cursor-pointer">
                    <Link
                      href={
                        user?.isAdmin === true
                          ? `/admin/${user?._id}`
                          : `/users/${user?._id}`
                      }
                    >
                      <div className="font-medium ">
                        {userDetail?.fullName
                          ? userDetail?.fullName
                          : "Thông tin cá nhân"}
                      </div>
                      <div className="truncate text-sm">
                        {userDetail?.email}
                      </div>
                    </Link>
                  </div>
                  <ul className="py-2 px-1.5 text-sm dark:text-gray-200">
                    <li>
                      <Link
                        href="/change-password"
                        className="flex items-center hover:text-blue-600 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <div className="px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                          </svg>
                        </div>
                        <div> Đổi mật khẩu</div>
                      </Link>
                    </li>
                  </ul>
                  <div className="py-2 px-1.5">
                    <div
                      onClick={handleLogout}
                      className="flex cursor-pointer items-center hover:text-blue-600 hover:bg-gray-100"
                    >
                      <div className="px-2 py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                          />
                        </svg>
                      </div>

                      <div className="text-sm dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Đăng xuất
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
