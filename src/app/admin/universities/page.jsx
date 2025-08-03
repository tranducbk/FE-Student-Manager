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
  BankOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function Universities() {
  const [universities, setUniversities] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Add form data (for simple add/edit)
  const [addFormData, setAddFormData] = useState({
    universityCode: "",
    universityName: "",
  });

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    universityCode: "",
    universityName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddInputChange = (field, value) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Lấy danh sách universities
      const universitiesRes = await axios.get(`${BASE_URL}/university`, {
        headers: { token: `Bearer ${token}` },
      });

      // Lấy organizations, education levels, và classes cho mỗi university
      const universitiesWithData = await Promise.all(
        universitiesRes.data.map(async (university) => {
          try {
            // Lấy organizations cho university này
            const organizationsRes = await axios.get(
              `${BASE_URL}/university/${university._id}/organizations`,
              {
                headers: { token: `Bearer ${token}` },
              }
            );

            // Lấy education levels và classes cho mỗi organization
            const organizationsWithData = await Promise.all(
              organizationsRes.data.map(async (organization) => {
                try {
                  // Lấy education levels cho organization này
                  const educationLevelsRes = await axios.get(
                    `${BASE_URL}/university/organizations/${organization._id}/education-levels`,
                    {
                      headers: { token: `Bearer ${token}` },
                    }
                  );

                  // Lấy classes cho mỗi education level
                  const educationLevelsWithData = await Promise.all(
                    educationLevelsRes.data.map(async (educationLevel) => {
                      try {
                        const classesRes = await axios.get(
                          `${BASE_URL}/university/education-levels/${educationLevel._id}/classes`,
                          {
                            headers: { token: `Bearer ${token}` },
                          }
                        );
                        return {
                          ...educationLevel,
                          classes: classesRes.data,
                        };
                      } catch (error) {
                        return {
                          ...educationLevel,
                          classes: [],
                        };
                      }
                    })
                  );

                  return {
                    ...organization,
                    educationLevels: educationLevelsWithData,
                  };
                } catch (error) {
                  return {
                    ...organization,
                    educationLevels: [],
                  };
                }
              })
            );

            return {
              ...university,
              organizations: organizationsWithData,
            };
          } catch (error) {
            return {
              ...university,
              organizations: [],
            };
          }
        })
      );

      setUniversities(universitiesWithData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addFormData.universityCode || !addFormData.universityName) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
        return;
      }

      // Create university
      await axios.post(
        `${BASE_URL}/university/create`,
        {
          universityCode: addFormData.universityCode,
          universityName: addFormData.universityName,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetAddForm();
      handleNotify("success", "Thành công!", "Thêm trường thành công!");
    } catch (error) {
      console.error("Error creating data:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi thêm dữ liệu");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.universityCode || !editFormData.universityName) {
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
        `${BASE_URL}/university/${selectedUniversity._id}`,
        {
          universityCode: editFormData.universityCode,
          universityName: editFormData.universityName,
        },
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Refresh data
      fetchData();

      resetEditForm();
      handleNotify("success", "Thành công!", "Cập nhật trường thành công!");
    } catch (error) {
      console.error("Error updating data:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi cập nhật dữ liệu");
    }
  };

  const handleEditUniversity = (university) => {
    setSelectedUniversity(university);
    setEditFormData({
      universityCode: university.universityCode,
      universityName: university.universityName,
    });
    setShowEditForm(true);
  };

  const handleDeleteUniversity = async (universityId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trường này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleNotify("danger", "Lỗi!", "Vui lòng đăng nhập lại");
          return;
        }

        await axios.delete(`${BASE_URL}/university/${universityId}`, {
          headers: { token: `Bearer ${token}` },
        });

        // Refresh data
        fetchData();

        handleNotify("success", "Thành công!", "Xóa trường thành công!");
      } catch (error) {
        console.error("Error deleting university:", error);
        handleNotify("danger", "Lỗi!", "Lỗi khi xóa trường");
      }
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      universityCode: "",
      universityName: "",
    });
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditFormData({
      universityCode: "",
      universityName: "",
    });
    setSelectedUniversity(null);
    setShowEditForm(false);
  };

  const getHierarchyData = () => {
    return universities;
  };

  const filteredUniversities = getHierarchyData().filter(
    (university) =>
      university.universityName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      university.universityCode.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <div className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      Quản lý Trường Đại Học
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
                  QUẢN LÝ TRƯỜNG ĐẠI HỌC
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <PlusOutlined />
                  Thêm Trường
                </button>
              </div>

              <div className="p-5">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm trường..."
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
                          Tên trường
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Khoa/Viện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Chương trình đào tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Lớp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((university) => {
                          const totalOrganizations =
                            university.organizations.length;
                          const totalEducationLevels =
                            university.organizations.reduce(
                              (total, org) =>
                                total + org.educationLevels.length,
                              0
                            );
                          const totalClasses = university.organizations.reduce(
                            (total, org) =>
                              total +
                              org.educationLevels.reduce(
                                (levelTotal, level) =>
                                  levelTotal + level.classes.length,
                                0
                              ),
                            0
                          );

                          return (
                            <tr
                              key={university._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                  <BankOutlined className="mr-2" />
                                  {university.universityName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Mã: {university.universityCode}
                                </div>
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                                <div className="space-y-2">
                                  {university.organizations.length > 0 ? (
                                    university.organizations.map(
                                      (org, index) => (
                                        <div key={org._id} className="text-sm">
                                          <div className="font-medium text-green-600">
                                            <BookOutlined className="mr-1" />
                                            {org.organizationName}
                                          </div>
                                          {org.travelTime && (
                                            <div className="text-xs text-gray-500 ml-4">
                                              Thời gian di chuyển:{" "}
                                              {org.travelTime} phút
                                            </div>
                                          )}
                                          {index <
                                            university.organizations.length -
                                              1 && (
                                            <hr className="my-2 border-gray-200 dark:border-gray-600" />
                                          )}
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                                      Chưa có khoa/viện
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                                <div className="space-y-2">
                                  {university.organizations.length > 0 ? (
                                    university.organizations.map(
                                      (org, orgIndex) =>
                                        org.educationLevels.map(
                                          (level, levelIndex) => (
                                            <div
                                              key={level._id}
                                              className="text-sm"
                                            >
                                              <div className="font-medium text-orange-600">
                                                <TrophyOutlined className="mr-1" />
                                                {level.levelName}
                                              </div>
                                              <div className="text-xs text-gray-500 ml-4">
                                                Thuộc: {org.organizationName}
                                              </div>
                                              {(orgIndex <
                                                university.organizations
                                                  .length -
                                                  1 ||
                                                levelIndex <
                                                  org.educationLevels.length -
                                                    1) && (
                                                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                                              )}
                                            </div>
                                          )
                                        )
                                    )
                                  ) : (
                                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                                      Chưa có chương trình đào tạo
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">
                                <div className="space-y-2">
                                  {university.organizations.length > 0 ? (
                                    university.organizations.map(
                                      (org, orgIndex) =>
                                        org.educationLevels.map(
                                          (level, levelIndex) =>
                                            level.classes.map(
                                              (cls, classIndex) => (
                                                <div
                                                  key={cls._id}
                                                  className="text-sm"
                                                >
                                                  <div className="text-gray-700 dark:text-gray-300">
                                                    <TeamOutlined className="mr-1" />
                                                    {cls.className}
                                                  </div>
                                                  <div className="text-xs text-gray-500 ml-4">
                                                    {cls.studentCount || 0} học
                                                    viên
                                                  </div>
                                                  <div className="text-xs text-gray-500 ml-4">
                                                    Thuộc: {level.levelName}
                                                  </div>
                                                  {(orgIndex <
                                                    university.organizations
                                                      .length -
                                                      1 ||
                                                    levelIndex <
                                                      org.educationLevels
                                                        .length -
                                                        1 ||
                                                    classIndex <
                                                      level.classes.length -
                                                        1) && (
                                                    <hr className="my-2 border-gray-200 dark:border-gray-600" />
                                                  )}
                                                </div>
                                              )
                                            )
                                        )
                                    )
                                  ) : (
                                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                                      Chưa có lớp
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-200 dark:border-gray-600">
                                <Link
                                  href={`/admin/universities/${university._id}/organizations`}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                  title="Quản lý Khoa/Viện"
                                >
                                  <BookOutlined />
                                </Link>
                                <button
                                  onClick={() =>
                                    handleEditUniversity(university)
                                  }
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                  title="Chỉnh sửa"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteUniversity(university._id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title="Xóa"
                                >
                                  <DeleteOutlined />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex flex-col items-center">
                              <BankOutlined className="text-4xl mb-2" />
                              <div>Chưa có dữ liệu trường đại học</div>
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
                Thêm Trường Đại Học
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
                  Mã trường *
                </label>
                <input
                  type="text"
                  value={addFormData.universityCode}
                  onChange={(e) =>
                    handleAddInputChange("universityCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập mã trường"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên trường *
                </label>
                <input
                  type="text"
                  value={addFormData.universityName}
                  onChange={(e) =>
                    handleAddInputChange("universityName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên trường"
                  required
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
                Chỉnh sửa Trường Đại Học
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
                  Mã trường *
                </label>
                <input
                  type="text"
                  value={editFormData.universityCode}
                  onChange={(e) =>
                    handleEditInputChange("universityCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập mã trường"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên trường *
                </label>
                <input
                  type="text"
                  value={editFormData.universityName}
                  onChange={(e) =>
                    handleEditInputChange("universityName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nhập tên trường"
                  required
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
