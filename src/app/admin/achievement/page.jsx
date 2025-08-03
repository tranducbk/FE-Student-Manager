"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleNotify } from "../../../components/notify";

import { BASE_URL } from "@/configs";

const Achievement = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({});
  const [selectedStudentForForm, setSelectedStudentForForm] = useState(null);

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get(`${BASE_URL}/commander/students`, {
          headers: { token: `Bearer ${token}` },
        });
        setStudents(res.data);

        // Fetch achievements for all students
        const achievementsData = {};
        for (const student of res.data) {
          try {
            const achievementRes = await axios.get(
              `${BASE_URL}/achievement/${student._id}`,
              {
                headers: { token: `Bearer ${token}` },
              }
            );
            achievementsData[student._id] = achievementRes.data;
          } catch (error) {
            // If no achievement exists, create default structure
            achievementsData[student._id] = {
              studentId: student._id,
              yearlyAchievements: [],
              totalYears: 0,
              totalAdvancedSoldier: 0,
              totalCompetitiveSoldier: 0,
              totalScientificTopics: 0,
              totalScientificInitiatives: 0,
              eligibleForMinistryReward: false,
              eligibleForNationalReward: false,
              nextYearRecommendations: {},
            };
          }
        }
        setAchievements(achievementsData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddYearlyAchievement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASE_URL}/achievement/admin/${selectedStudentForForm._id}`,
        addFormData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      handleNotify("success", "Thành công!", "Thêm khen thưởng thành công");
      setShowFormAdd(false);
      setAddFormData({});
      setSelectedStudentForForm(null);
      fetchStudents();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const handleUpdateYearlyAchievement = async (e, studentId, year) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/achievement/admin/${studentId}/${year}`,
        editFormData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      handleNotify("success", "Thành công!", "Cập nhật khen thưởng thành công");
      setShowFormEdit(false);
      setEditFormData({});
      fetchStudents();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const handleDeleteYearlyAchievement = async (studentId, year) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/achievement/admin/${studentId}/${year}`, {
        headers: { token: `Bearer ${token}` },
      });
      handleNotify("success", "Thành công!", "Xóa khen thưởng thành công");
      fetchStudents();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  const getTitleDisplay = (title) => {
    const titleMap = {
      "chiến sĩ tiên tiến": "Chiến sĩ tiên tiến",
      "chiến sĩ thi đua": "Chiến sĩ thi đua",
    };
    return titleMap[title] || title;
  };

  return (
    <>
      <div className="flex">
        <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="w-full pt-20 pl-5">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    href="/admin"
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
                      Quản lý khen thưởng học viên
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 pt-2 dark:text-white text-lg">
                  QUẢN LÝ KHEN THƯỞNG HỌC VIÊN
                </div>
                <button
                  onClick={() => {
                    setSelectedStudentForForm(null);
                    setShowFormAdd(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Thêm khen thưởng
                </button>
              </div>

              <div className="p-5">
                {students.length > 0 ? (
                  <div className="space-y-6">
                    {students.map((student) => {
                      const achievement = achievements[student._id] || {
                        yearlyAchievements: [],
                        totalYears: 0,
                        totalAdvancedSoldier: 0,
                        totalCompetitiveSoldier: 0,
                        totalScientificTopics: 0,
                        totalScientificInitiatives: 0,
                        eligibleForMinistryReward: false,
                        eligibleForNationalReward: false,
                        nextYearRecommendations: {},
                      };

                      return (
                        <div
                          key={student._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {student.fullName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.unit} - {student.studentId}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedStudentForForm(student);
                                setShowFormAdd(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              + Thêm khen thưởng
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="border px-3 py-2 text-left">
                                    Năm
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Số quyết định
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Ngày quyết định
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Danh hiệu
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Ghi chú
                                  </th>
                                  <th className="border px-3 py-2 text-center">
                                    Thao tác
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {achievement.yearlyAchievements.length > 0 ? (
                                  achievement.yearlyAchievements.map(
                                    (ya, index) => (
                                      <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                      >
                                        <td className="border px-3 py-2">
                                          {ya.year}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {ya.decisionNumber}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {new Date(
                                            ya.decisionDate
                                          ).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {getTitleDisplay(ya.title)}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {ya.notes || "-"}
                                        </td>
                                        <td className="border px-3 py-2 text-center">
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              onClick={() => {
                                                setEditFormData(ya);
                                                setSelectedStudentForForm(
                                                  student
                                                );
                                                setShowFormEdit(true);
                                              }}
                                              className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteYearlyAchievement(
                                                  student._id,
                                                  ya.year
                                                )
                                              }
                                              className="text-red-600 hover:text-red-800 p-1"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      className="border px-3 py-4 text-center text-gray-500"
                                    >
                                      Chưa có khen thưởng nào
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        Không có dữ liệu
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Không tìm thấy học viên nào
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form thêm khen thưởng */}
          {showFormAdd && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {selectedStudentForForm
                      ? `Thêm khen thưởng cho ${selectedStudentForForm.fullName}`
                      : "Thêm khen thưởng"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormAdd(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={handleAddYearlyAchievement}
                  className="p-4 space-y-4"
                >
                  {!selectedStudentForForm && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Chọn học viên
                      </label>
                      <select
                        value={selectedStudentForForm?._id || ""}
                        onChange={(e) => {
                          const student = students.find(
                            (s) => s._id === e.target.value
                          );
                          setSelectedStudentForForm(student);
                        }}
                        className="w-full p-2 border rounded-lg"
                        required
                      >
                        <option value="">Chọn học viên</option>
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.fullName} - {student.unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Năm
                    </label>
                    <input
                      type="number"
                      value={addFormData.year || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số quyết định
                    </label>
                    <input
                      type="text"
                      value={addFormData.decisionNumber || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          decisionNumber: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày quyết định
                    </label>
                    <input
                      type="date"
                      value={addFormData.decisionDate || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          decisionDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Danh hiệu
                    </label>
                    <select
                      value={addFormData.title || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Chọn danh hiệu</option>
                      <option value="chiến sĩ tiên tiến">
                        Chiến sĩ tiên tiến
                      </option>
                      <option value="chiến sĩ thi đua">Chiến sĩ thi đua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={addFormData.notes || ""}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormAdd(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Form chỉnh sửa khen thưởng */}
          {showFormEdit && selectedStudentForForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-black bg-opacity-50 inset-0 fixed"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    Chỉnh sửa khen thưởng cho {selectedStudentForForm.fullName}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormEdit(false);
                      setSelectedStudentForForm(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={(e) =>
                    handleUpdateYearlyAchievement(
                      e,
                      selectedStudentForForm._id,
                      editFormData.year
                    )
                  }
                  className="p-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Năm
                    </label>
                    <input
                      type="number"
                      value={editFormData.year || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số quyết định
                    </label>
                    <input
                      type="text"
                      value={editFormData.decisionNumber || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          decisionNumber: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày quyết định
                    </label>
                    <input
                      type="date"
                      value={
                        editFormData.decisionDate
                          ? new Date(editFormData.decisionDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          decisionDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Danh hiệu
                    </label>
                    <select
                      value={editFormData.title || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Chọn danh hiệu</option>
                      <option value="chiến sĩ tiên tiến">
                        Chiến sĩ tiên tiến
                      </option>
                      <option value="chiến sĩ thi đua">Chiến sĩ thi đua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={editFormData.notes || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormEdit(false);
                        setSelectedStudentForForm(null);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Achievement;
