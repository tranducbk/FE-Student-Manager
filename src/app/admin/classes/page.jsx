"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { handleNotify } from "../../../components/notify";
import { BASE_URL } from "@/configs";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  SearchOutlined,
  TrophyOutlined,
  BookOutlined,
  BankOutlined,
} from "@ant-design/icons";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState("");

  const [addFormData, setAddFormData] = useState({
    educationLevelId: "",
    className: "",
    studentCount: 0,
  });

  const [editFormData, setEditFormData] = useState({
    className: "",
    studentCount: 0,
  });

  useEffect(() => {
    fetchEducationLevels();
    fetchData();
  }, []);

  const fetchEducationLevels = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Lấy tất cả education levels từ tất cả organizations
      const allEducationLevels = [];

      // Lấy danh sách universities trước
      const universitiesRes = await axios.get(`${BASE_URL}/university`, {
        headers: { token: `Bearer ${token}` },
      });

      for (const university of universitiesRes.data) {
        try {
          const organizationsRes = await axios.get(
            `${BASE_URL}/university/${university._id}/organizations`,
            {
              headers: { token: `Bearer ${token}` },
            }
          );

          for (const organization of organizationsRes.data) {
            try {
              const educationLevelsRes = await axios.get(
                `${BASE_URL}/university/organizations/${organization._id}/education-levels`,
                {
                  headers: { token: `Bearer ${token}` },
                }
              );

              // Thêm thông tin organization và university vào mỗi education level
              const educationLevelsWithInfo = educationLevelsRes.data.map(
                (level) => ({
                  ...level,
                  organization: organization,
                  university: university,
                })
              );

              allEducationLevels.push(...educationLevelsWithInfo);
            } catch (error) {
              console.error(
                `Error fetching education levels for organization ${organization._id}:`,
                error
              );
            }
          }
        } catch (error) {
          console.error(
            `Error fetching organizations for university ${university._id}:`,
            error
          );
        }
      }

      setEducationLevels(allEducationLevels);
    } catch (error) {
      console.error("Error fetching education levels:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Lấy tất cả classes từ tất cả education levels
      const allClasses = [];

      for (const educationLevel of educationLevels) {
        try {
          const response = await axios.get(
            `${BASE_URL}/university/education-levels/${educationLevel._id}/classes`,
            {
              headers: { token: `Bearer ${token}` },
            }
          );

          // Thêm thông tin education level, organization và university vào mỗi class
          const classesWithInfo = response.data.map((cls) => ({
            ...cls,
            educationLevel: educationLevel,
            organization: educationLevel.organization,
            university: educationLevel.university,
          }));

          allClasses.push(...classesWithInfo);
        } catch (error) {
          console.error(
            `Error fetching classes for education level ${educationLevel._id}:`,
            error
          );
        }
      }

      setClasses(allClasses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddInputChange = (field, value) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addFormData.educationLevelId || !addFormData.className) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      await axios.post(
        `${BASE_URL}/university/education-levels/${addFormData.educationLevelId}/classes`,
        {
          className: addFormData.className,
          studentCount: addFormData.studentCount,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetAddForm();
      handleNotify("success", "Thành công!", "Thêm lớp thành công!");
    } catch (error) {
      console.error("Error creating class:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi thêm lớp");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.className) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      await axios.put(
        `${BASE_URL}/university/classes/${selectedClass._id}`,
        {
          className: editFormData.className,
          studentCount: editFormData.studentCount,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetEditForm();
      handleNotify("success", "Thành công!", "Cập nhật lớp thành công!");
    } catch (error) {
      console.error("Error updating class:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi cập nhật lớp");
    }
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setEditFormData({
      className: classItem.className,
      studentCount: classItem.studentCount || 0,
    });
    setShowEditForm(true);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
          return;
        }

        await axios.delete(`${BASE_URL}/university/classes/${classId}`, {
          headers: { token: `Bearer ${token}` },
        });

        // Refresh data
        fetchData();

        handleNotify("success", "Thành công!", "Xóa lớp thành công!");
      } catch (error) {
        console.error("Error deleting class:", error);
        handleNotify("danger", "Lỗi!", "Lỗi khi xóa lớp");
      }
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      educationLevelId: "",
      className: "",
      studentCount: 0,
    });
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditFormData({
      className: "",
      studentCount: 0,
    });
    setSelectedClass(null);
    setShowEditForm(false);
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.className
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesEducationLevel =
      !selectedEducationLevel ||
      classItem.educationLevel._id === selectedEducationLevel;

    return matchesSearch && matchesEducationLevel;
  });

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1">
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
                      Quản lý Lớp
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
                  QUẢN LÝ LỚP
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <PlusOutlined />
                  Thêm Lớp
                </button>
              </div>

              <div className="p-5">
                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm lớp..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="w-64">
                      <select
                        value={selectedEducationLevel}
                        onChange={(e) =>
                          setSelectedEducationLevel(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Tất cả chương trình đào tạo</option>
                        {educationLevels.map((level) => (
                          <option key={level._id} value={level._id}>
                            {level.levelName} -{" "}
                            {level.organization?.organizationName} -{" "}
                            {level.university?.universityName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tên lớp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Số học viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Chương trình đào tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Khoa/Viện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Trường
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredClasses.length > 0 ? (
                        filteredClasses.map((classItem) => (
                          <tr
                            key={classItem._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-700 dark:text-gray-300">
                                <TeamOutlined className="mr-2" />
                                {classItem.className}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {classItem.studentCount || 0} học viên
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <TrophyOutlined className="mr-1" />
                                {classItem.educationLevel?.levelName || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <BookOutlined className="mr-1" />
                                {classItem.organization?.organizationName ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <BankOutlined className="mr-1" />
                                {classItem.university?.universityName || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Mã:{" "}
                                {classItem.university?.universityCode || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditClass(classItem)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Chỉnh sửa"
                              >
                                <EditOutlined />
                              </button>
                              <button
                                onClick={() => handleDeleteClass(classItem._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <DeleteOutlined />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <TeamOutlined className="text-4xl mb-2" />
                              <div>Chưa có dữ liệu lớp</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Thêm Lớp
              </h2>
              <button
                onClick={resetAddForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chương trình đào tạo *
                </label>
                <select
                  value={addFormData.educationLevelId}
                  onChange={(e) =>
                    handleAddInputChange("educationLevelId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Chọn chương trình đào tạo</option>
                  {educationLevels.map((level) => (
                    <option key={level._id} value={level._id}>
                      {level.levelName} - {level.organization?.organizationName}{" "}
                      - {level.university?.universityName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  value={addFormData.className}
                  onChange={(e) =>
                    handleAddInputChange("className", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên lớp"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số học viên
                </label>
                <input
                  type="number"
                  value={addFormData.studentCount}
                  onChange={(e) =>
                    handleAddInputChange(
                      "studentCount",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAddForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Chỉnh sửa Lớp
              </h2>
              <button
                onClick={resetEditForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  value={editFormData.className}
                  onChange={(e) =>
                    handleEditInputChange("className", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên lớp"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số học viên
                </label>
                <input
                  type="number"
                  value={editFormData.studentCount}
                  onChange={(e) =>
                    handleEditInputChange(
                      "studentCount",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetEditForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
