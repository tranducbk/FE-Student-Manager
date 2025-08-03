"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { handleNotify } from "../../../../../components/notify";
import { BASE_URL } from "@/configs";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  TrophyOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

export default function UniversityOrganizations() {
  const params = useParams();
  const universityId = params.universityId;

  const [organizations, setOrganizations] = useState([]);
  const [university, setUniversity] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [addFormData, setAddFormData] = useState({
    organizationName: "",
    travelTime: 45,
  });

  const [editFormData, setEditFormData] = useState({
    organizationName: "",
    travelTime: 45,
  });

  useEffect(() => {
    if (universityId) {
      fetchData();
      fetchUniversity();
    }
  }, [universityId]);

  const fetchUniversity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/university/${universityId}`,
        {
          headers: { token: `Bearer ${token}` },
        }
      );
      setUniversity(response.data);
    } catch (error) {
      console.error("Error fetching university:", error);
      handleNotify("danger", "Lỗi!", "Không thể tải thông tin trường");
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/university/${universityId}/organizations`,
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Enrich organizations with university info
      const organizationsWithData = response.data.map((org) => ({
        ...org,
        university: university,
      }));

      setOrganizations(organizationsWithData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      handleNotify("danger", "Lỗi!", "Không thể tải danh sách khoa/viện");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addFormData.organizationName) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền tên khoa/viện");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      await axios.post(
        `${BASE_URL}/university/${universityId}/organizations`,
        {
          organizationName: addFormData.organizationName,
          travelTime: addFormData.travelTime,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      fetchData();
      resetAddForm();
      handleNotify("success", "Thành công!", "Thêm khoa/viện thành công!");
    } catch (error) {
      console.error("Error adding organization:", error);
      handleNotify("danger", "Lỗi!", "Có lỗi xảy ra khi thêm khoa/viện");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.organizationName) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền tên khoa/viện");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      await axios.put(
        `${BASE_URL}/university/organizations/${selectedOrganization._id}`,
        {
          organizationName: editFormData.organizationName,
          travelTime: editFormData.travelTime,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      fetchData();
      resetEditForm();
      handleNotify("success", "Thành công!", "Cập nhật khoa/viện thành công!");
    } catch (error) {
      console.error("Error updating organization:", error);
      handleNotify("danger", "Lỗi!", "Có lỗi xảy ra khi cập nhật khoa/viện");
    }
  };

  const handleEditOrganization = (organization) => {
    setSelectedOrganization(organization);
    setEditFormData({
      organizationName: organization.organizationName,
      travelTime: organization.travelTime || 45,
    });
    setShowEditForm(true);
  };

  const handleDeleteOrganization = async (organizationId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khoa/viện này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
          return;
        }

        await axios.delete(
          `${BASE_URL}/university/organizations/${organizationId}`,
          {
            headers: { token: `Bearer ${token}` },
          }
        );

        fetchData();
        handleNotify("success", "Thành công!", "Xóa khoa/viện thành công!");
      } catch (error) {
        console.error("Error deleting organization:", error);
        handleNotify("danger", "Lỗi!", "Có lỗi xảy ra khi xóa khoa/viện");
      }
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      organizationName: "",
      travelTime: 45,
    });
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditFormData({
      organizationName: "",
      travelTime: 45,
    });
    setSelectedOrganization(null);
    setShowEditForm(false);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <Link
                      href="/admin/universities"
                      className="ms-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      Quản lý Trường Đại Học
                    </Link>
                  </div>
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
                      Quản lý Khoa/Viện
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="flex justify-between font-bold p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Link
                    href="/admin/universities"
                    className="text-blue-600 hover:text-blue-800"
                    title="Quay lại"
                  >
                    <ArrowLeftOutlined className="text-xl" />
                  </Link>
                  <div className="text-gray-900 pt-2 dark:text-white text-lg">
                    QUẢN LÝ KHOA/VIỆN
                  </div>
                  {university && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      - {university.universityName}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <PlusOutlined />
                  Thêm Khoa/Viện
                </button>
              </div>

              <div className="p-5">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm khoa/viện..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Tên khoa/viện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Thời gian di chuyển
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredOrganizations.length > 0 ? (
                        filteredOrganizations.map((organization) => (
                          <tr
                            key={organization._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                              <div className="font-semibold text-green-600 dark:text-green-400">
                                <BookOutlined className="mr-2" />
                                {organization.organizationName}
                              </div>
                            </td>
                            <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {organization.travelTime || 45} phút
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-200 dark:border-gray-600">
                              <Link
                                href={`/admin/universities/${universityId}/organizations/${organization._id}/education-levels`}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                                title="Quản lý Chương trình đào tạo"
                              >
                                <TrophyOutlined />
                              </Link>
                              <button
                                onClick={() =>
                                  handleEditOrganization(organization)
                                }
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Chỉnh sửa"
                              >
                                <EditOutlined />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteOrganization(organization._id)
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
                            colSpan="3"
                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex flex-col items-center">
                              <BookOutlined className="text-4xl mb-2" />
                              <div>Chưa có dữ liệu khoa/viện</div>
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
                Thêm Khoa/Viện
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
                  Tên khoa/viện *
                </label>
                <input
                  type="text"
                  value={addFormData.organizationName}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      organizationName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên khoa/viện"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thời gian di chuyển (phút)
                </label>
                <input
                  type="number"
                  value={addFormData.travelTime}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      travelTime: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="45"
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
                Chỉnh sửa Khoa/Viện
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
                  Tên khoa/viện *
                </label>
                <input
                  type="text"
                  value={editFormData.organizationName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      organizationName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên khoa/viện"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thời gian di chuyển (phút)
                </label>
                <input
                  type="number"
                  value={editFormData.travelTime}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      travelTime: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="45"
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
