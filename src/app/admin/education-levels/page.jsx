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
  TrophyOutlined,
  SearchOutlined,
  BookOutlined,
  BankOutlined,
} from "@ant-design/icons";

export default function EducationLevels() {
  const [educationLevels, setEducationLevels] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEducationLevel, setSelectedEducationLevel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");

  const [addFormData, setAddFormData] = useState({
    organizationId: "",
    levelName: "",
  });

  const [editFormData, setEditFormData] = useState({
    levelName: "",
  });

  useEffect(() => {
    fetchOrganizations();
    fetchData();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Lấy tất cả organizations từ tất cả universities
      const allOrganizations = [];

      // Lấy danh sách universities trước
      const universitiesRes = await axios.get(`${BASE_URL}/university`, {
        headers: { token: `Bearer ${token}` },
      });

      for (const university of universitiesRes.data) {
        try {
          const response = await axios.get(
            `${BASE_URL}/university/${university._id}/organizations`,
            {
              headers: { token: `Bearer ${token}` },
            }
          );

          // Thêm thông tin university vào mỗi organization
          const organizationsWithUniversity = response.data.map((org) => ({
            ...org,
            university: university,
          }));

          allOrganizations.push(...organizationsWithUniversity);
        } catch (error) {
          console.error(
            `Error fetching organizations for university ${university._id}:`,
            error
          );
        }
      }

      setOrganizations(allOrganizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Lấy tất cả education levels từ tất cả organizations
      const allEducationLevels = [];

      for (const organization of organizations) {
        try {
          const response = await axios.get(
            `${BASE_URL}/university/organizations/${organization._id}/education-levels`,
            {
              headers: { token: `Bearer ${token}` },
            }
          );

          // Thêm thông tin organization và university vào mỗi education level
          const educationLevelsWithInfo = response.data.map((level) => ({
            ...level,
            organization: organization,
            university: organization.university,
          }));

          allEducationLevels.push(...educationLevelsWithInfo);
        } catch (error) {
          console.error(
            `Error fetching education levels for organization ${organization._id}:`,
            error
          );
        }
      }

      setEducationLevels(allEducationLevels);
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

    if (!addFormData.organizationId || !addFormData.levelName) {
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
        `${BASE_URL}/university/organizations/${addFormData.organizationId}/education-levels`,
        {
          levelName: addFormData.levelName,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetAddForm();
      handleNotify(
        "success",
        "Thành công!",
        "Thêm chương trình đào tạo thành công!"
      );
    } catch (error) {
      console.error("Error creating education level:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi thêm chương trình đào tạo");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.levelName) {
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
        `${BASE_URL}/university/education-levels/${selectedEducationLevel._id}`,
        {
          levelName: editFormData.levelName,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetEditForm();
      handleNotify(
        "success",
        "Thành công!",
        "Cập nhật chương trình đào tạo thành công!"
      );
    } catch (error) {
      console.error("Error updating education level:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi cập nhật chương trình đào tạo");
    }
  };

  const handleEditEducationLevel = (educationLevel) => {
    setSelectedEducationLevel(educationLevel);
    setEditFormData({
      levelName: educationLevel.levelName,
    });
    setShowEditForm(true);
  };

  const handleDeleteEducationLevel = async (educationLevelId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chương trình đào tạo này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
          return;
        }

        await axios.delete(
          `${BASE_URL}/university/education-levels/${educationLevelId}`,
          {
            headers: { token: `Bearer ${token}` },
          }
        );

        // Refresh data
        fetchData();

        handleNotify(
          "success",
          "Thành công!",
          "Xóa chương trình đào tạo thành công!"
        );
      } catch (error) {
        console.error("Error deleting education level:", error);
        handleNotify("danger", "Lỗi!", "Lỗi khi xóa chương trình đào tạo");
      }
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      organizationId: "",
      levelName: "",
    });
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditFormData({
      levelName: "",
    });
    setSelectedEducationLevel(null);
    setShowEditForm(false);
  };

  const filteredEducationLevels = educationLevels.filter((level) => {
    const matchesSearch = level.levelName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesOrganization =
      !selectedOrganization || level.organization._id === selectedOrganization;

    return matchesSearch && matchesOrganization;
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
                      Quản lý Chương trình đào tạo
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
                  QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <PlusOutlined />
                  Thêm Chương trình đào tạo
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
                          placeholder="Tìm kiếm chương trình đào tạo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="w-64">
                      <select
                        value={selectedOrganization}
                        onChange={(e) =>
                          setSelectedOrganization(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Tất cả khoa/viện</option>
                        {organizations.map((organization) => (
                          <option
                            key={organization._id}
                            value={organization._id}
                          >
                            {organization.organizationName} -{" "}
                            {organization.university?.universityName}
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
                      {filteredEducationLevels.length > 0 ? (
                        filteredEducationLevels.map((level) => (
                          <tr
                            key={level._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-orange-600 dark:text-orange-400">
                                <TrophyOutlined className="mr-2" />
                                {level.levelName}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <BookOutlined className="mr-1" />
                                {level.organization?.organizationName || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <BankOutlined className="mr-1" />
                                {level.university?.universityName || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Mã: {level.university?.universityCode || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditEducationLevel(level)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Chỉnh sửa"
                              >
                                <EditOutlined />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteEducationLevel(level._id)
                                }
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
                            colSpan="4"
                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <TrophyOutlined className="text-4xl mb-2" />
                              <div>Chưa có dữ liệu chương trình đào tạo</div>
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
                Thêm Chương trình đào tạo
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
                  Khoa/Viện *
                </label>
                <select
                  value={addFormData.organizationId}
                  onChange={(e) =>
                    handleAddInputChange("organizationId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Chọn khoa/viện</option>
                  {organizations.map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.organizationName} -{" "}
                      {organization.university?.universityName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chương trình đào tạo *
                </label>
                <select
                  value={addFormData.levelName}
                  onChange={(e) =>
                    handleAddInputChange("levelName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Chọn chương trình đào tạo</option>
                  <option value="Cử nhân">Cử nhân</option>
                  <option value="Kỹ sư">Kỹ sư</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
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
                Chỉnh sửa Chương trình đào tạo
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
                  Chương trình đào tạo *
                </label>
                <select
                  value={editFormData.levelName}
                  onChange={(e) =>
                    handleEditInputChange("levelName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Chọn chương trình đào tạo</option>
                  <option value="Cử nhân">Cử nhân</option>
                  <option value="Kỹ sư">Kỹ sư</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
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
