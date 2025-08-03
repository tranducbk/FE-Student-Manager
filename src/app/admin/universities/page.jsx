"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { handleNotify } from "../../../components/notify";

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [addStep, setAddStep] = useState(1);
  const [editStep, setEditStep] = useState(1);

  // Add form data
  const [addFormData, setAddFormData] = useState({
    universityCode: "",
    universityName: "",
    organizationCode: "",
    organizationName: "",
    educationLevelCode: "",
    educationLevelName: "",
    className: "",
    classCode: "",
  });

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    universityCode: "",
    universityName: "",
    organizationCode: "",
    organizationName: "",
    educationLevelCode: "",
    educationLevelName: "",
    className: "",
    classCode: "",
  });

  // Validation states for add form
  const [addStep1Valid, setAddStep1Valid] = useState(false);
  const [addStep2Valid, setAddStep2Valid] = useState(false);
  const [addStep3Valid, setAddStep3Valid] = useState(false);

  // Validation states for edit form
  const [editStep1Valid, setEditStep1Valid] = useState(false);
  const [editStep2Valid, setEditStep2Valid] = useState(false);
  const [editStep3Valid, setEditStep3Valid] = useState(false);

  // New organization/education level/class states
  const [addNewOrganization, setAddNewOrganization] = useState(false);
  const [addNewEducationLevel, setAddNewEducationLevel] = useState(false);
  const [addNewClass, setAddNewClass] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          universitiesRes,
          organizationsRes,
          educationLevelsRes,
          classesRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/universities"),
          axios.get("http://localhost:5000/api/organizations"),
          axios.get("http://localhost:5000/api/education-levels"),
          axios.get("http://localhost:5000/api/classes"),
        ]);

        setUniversities(universitiesRes.data);
        setOrganizations(organizationsRes.data);
        setEducationLevels(educationLevelsRes.data);
        setClasses(classesRes.data);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Validation effects for add form
  useEffect(() => {
    setAddStep1Valid(
      addFormData.universityCode.trim() !== "" &&
        addFormData.universityName.trim() !== ""
    );
  }, [addFormData.universityCode, addFormData.universityName]);

  useEffect(() => {
    setAddStep2Valid(
      addFormData.organizationCode.trim() !== "" &&
        addFormData.organizationName.trim() !== ""
    );
  }, [addFormData.organizationCode, addFormData.organizationName]);

  useEffect(() => {
    setAddStep3Valid(
      addFormData.educationLevelCode.trim() !== "" &&
        addFormData.educationLevelName.trim() !== "" &&
        addFormData.classCode.trim() !== "" &&
        addFormData.className.trim() !== ""
    );
  }, [
    addFormData.educationLevelCode,
    addFormData.educationLevelName,
    addFormData.classCode,
    addFormData.className,
  ]);

  // Validation effects for edit form
  useEffect(() => {
    setEditStep1Valid(
      editFormData.universityCode.trim() !== "" &&
        editFormData.universityName.trim() !== ""
    );
  }, [editFormData.universityCode, editFormData.universityName]);

  useEffect(() => {
    setEditStep2Valid(
      editFormData.organizationCode.trim() !== "" &&
        editFormData.organizationName.trim() !== ""
    );
  }, [editFormData.organizationCode, editFormData.organizationName]);

  useEffect(() => {
    setEditStep3Valid(
      editFormData.educationLevelCode.trim() !== "" &&
        editFormData.educationLevelName.trim() !== "" &&
        editFormData.classCode.trim() !== "" &&
        editFormData.className.trim() !== ""
    );
  }, [
    editFormData.educationLevelCode,
    editFormData.educationLevelName,
    editFormData.classCode,
    editFormData.className,
  ]);

  const handleAddInputChange = (field, value) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addStep1Valid || !addStep2Valid || !addStep3Valid) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Create university
      const universityRes = await axios.post(
        "http://localhost:5000/api/universities",
        {
          code: addFormData.universityCode,
          name: addFormData.universityName,
        }
      );

      // Create organization
      const organizationRes = await axios.post(
        "http://localhost:5000/api/organizations",
        {
          code: addFormData.organizationCode,
          name: addFormData.organizationName,
          universityId: universityRes.data.id,
        }
      );

      // Create education level
      const educationLevelRes = await axios.post(
        "http://localhost:5000/api/education-levels",
        {
          code: addFormData.educationLevelCode,
          name: addFormData.educationLevelName,
          organizationId: organizationRes.data.id,
        }
      );

      // Create class
      await axios.post("http://localhost:5000/api/classes", {
        code: addFormData.classCode,
        name: addFormData.className,
        educationLevelId: educationLevelRes.data.id,
      });

      // Refresh data
      const [
        universitiesRes,
        organizationsRes,
        educationLevelsRes,
        classesRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/universities"),
        axios.get("http://localhost:5000/api/organizations"),
        axios.get("http://localhost:5000/api/education-levels"),
        axios.get("http://localhost:5000/api/classes"),
      ]);

      setUniversities(universitiesRes.data);
      setOrganizations(organizationsRes.data);
      setEducationLevels(educationLevelsRes.data);
      setClasses(classesRes.data);

      resetAddForm();
      handleNotify("success", "Thành công!", "Thêm dữ liệu thành công!");
    } catch (error) {
      console.error("Error creating data:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi thêm dữ liệu");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editStep1Valid || !editStep2Valid || !editStep3Valid) {
      handleNotify("warning", "Cảnh báo!", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Update university
      await axios.put(
        `http://localhost:5000/api/universities/${selectedUniversity.id}`,
        {
          code: editFormData.universityCode,
          name: editFormData.universityName,
        }
      );

      // Update organization
      const organization = organizations.find(
        (org) => org.universityId === selectedUniversity.id
      );
      if (organization) {
        await axios.put(
          `http://localhost:5000/api/organizations/${organization.id}`,
          {
            code: editFormData.organizationCode,
            name: editFormData.organizationName,
          }
        );
      }

      // Update education level
      const educationLevel = educationLevels.find(
        (level) => level.organizationId === organization?.id
      );
      if (educationLevel) {
        await axios.put(
          `http://localhost:5000/api/education-levels/${educationLevel.id}`,
          {
            code: editFormData.educationLevelCode,
            name: editFormData.educationLevelName,
          }
        );
      }

      // Update class
      const classItem = classes.find(
        (cls) => cls.educationLevelId === educationLevel?.id
      );
      if (classItem) {
        await axios.put(`http://localhost:5000/api/classes/${classItem.id}`, {
          code: editFormData.classCode,
          name: editFormData.className,
        });
      }

      // Refresh data
      const [
        universitiesRes,
        organizationsRes,
        educationLevelsRes,
        classesRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/universities"),
        axios.get("http://localhost:5000/api/organizations"),
        axios.get("http://localhost:5000/api/education-levels"),
        axios.get("http://localhost:5000/api/classes"),
      ]);

      setUniversities(universitiesRes.data);
      setOrganizations(organizationsRes.data);
      setEducationLevels(educationLevelsRes.data);
      setClasses(classesRes.data);

      resetEditForm();
      handleNotify("success", "Thành công!", "Cập nhật dữ liệu thành công!");
    } catch (error) {
      console.error("Error updating data:", error);
      handleNotify("danger", "Lỗi!", "Lỗi khi cập nhật dữ liệu");
    }
  };

  const handleEditUniversity = (university) => {
    setSelectedUniversity(university);

    const organization = organizations.find(
      (org) => org.universityId === university.id
    );
    const educationLevel = organization
      ? educationLevels.find(
          (level) => level.organizationId === organization.id
        )
      : null;
    const classItem = educationLevel
      ? classes.find((cls) => cls.educationLevelId === educationLevel.id)
      : null;

    setEditFormData({
      universityCode: university.code,
      universityName: university.name,
      organizationCode: organization?.code || "",
      organizationName: organization?.name || "",
      educationLevelCode: educationLevel?.code || "",
      educationLevelName: educationLevel?.name || "",
      classCode: classItem?.code || "",
      className: classItem?.name || "",
    });

    setShowEditForm(true);
  };

  const handleDeleteUniversity = async (universityId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trường này?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/universities/${universityId}`
        );

        // Refresh data
        const [
          universitiesRes,
          organizationsRes,
          educationLevelsRes,
          classesRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/universities"),
          axios.get("http://localhost:5000/api/organizations"),
          axios.get("http://localhost:5000/api/education-levels"),
          axios.get("http://localhost:5000/api/classes"),
        ]);

        setUniversities(universitiesRes.data);
        setOrganizations(organizationsRes.data);
        setEducationLevels(educationLevelsRes.data);
        setClasses(classesRes.data);

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
      organizationCode: "",
      organizationName: "",
      educationLevelCode: "",
      educationLevelName: "",
      className: "",
      classCode: "",
    });
    setAddStep(1);
    setAddNewOrganization(false);
    setAddNewEducationLevel(false);
    setAddNewClass(false);
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditFormData({
      universityCode: "",
      universityName: "",
      organizationCode: "",
      organizationName: "",
      educationLevelCode: "",
      educationLevelName: "",
      className: "",
      classCode: "",
    });
    setEditStep(1);
    setSelectedUniversity(null);
    setShowEditForm(false);
  };

  const getHierarchyData = () => {
    return universities.map((university) => {
      const universityOrganizations = organizations.filter(
        (org) => org.universityId === university.id
      );

      return {
        ...university,
        organizations: universityOrganizations.map((org) => {
          const orgEducationLevels = educationLevels.filter(
            (level) => level.organizationId === org.id
          );

          return {
            ...org,
            educationLevels: orgEducationLevels.map((level) => {
              const levelClasses = classes.filter(
                (cls) => cls.educationLevelId === level.id
              );

              return {
                ...level,
                classes: levelClasses,
              };
            }),
          };
        }),
      };
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Trường Đại Học</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Thêm Trường
        </button>
      </div>

      {isLoadingData ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cấu trúc phân cấp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getHierarchyData().map((university) => (
                <tr key={university.id}>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-blue-600">
                        🏫 {university.name} ({university.code})
                      </div>
                      {university.organizations.map((org) => (
                        <div key={org.id} className="ml-6">
                          <div className="font-medium text-green-600">
                            🏢 {org.name} ({org.code})
                          </div>
                          {org.educationLevels.map((level) => (
                            <div key={level.id} className="ml-6">
                              <div className="font-medium text-orange-600">
                                📚 {level.name} ({level.code})
                              </div>
                              {level.classes.map((cls) => (
                                <div key={cls.id} className="ml-6">
                                  <div className="text-gray-700">
                                    👥 {cls.name} ({cls.code})
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditUniversity(university)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUniversity(university.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Thêm Trường Đại Học</h2>
              <button
                onClick={resetAddForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps */}
            <div className="flex mb-6">
              <div
                className={`flex-1 text-center py-2 ${
                  addStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 1: Thông tin trường
              </div>
              <div
                className={`flex-1 text-center py-2 ${
                  addStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 2: Thông tin tổ chức
              </div>
              <div
                className={`flex-1 text-center py-2 ${
                  addStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 3: Thông tin lớp học
              </div>
            </div>

            <form onSubmit={handleAddSubmit}>
              {/* Step 1: University Information */}
              {addStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã trường *
                    </label>
                    <input
                      type="text"
                      value={addFormData.universityCode}
                      onChange={(e) =>
                        handleAddInputChange("universityCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã trường"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên trường *
                    </label>
                    <input
                      type="text"
                      value={addFormData.universityName}
                      onChange={(e) =>
                        handleAddInputChange("universityName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên trường"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setAddStep(2)}
                      disabled={!addStep1Valid}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Organization Information */}
              {addStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã tổ chức *
                    </label>
                    <input
                      type="text"
                      value={addFormData.organizationCode}
                      onChange={(e) =>
                        handleAddInputChange("organizationCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã tổ chức"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên tổ chức *
                    </label>
                    <input
                      type="text"
                      value={addFormData.organizationName}
                      onChange={(e) =>
                        handleAddInputChange("organizationName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên tổ chức"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setAddStep(1)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddStep(3)}
                      disabled={!addStep2Valid}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Education Level and Class Information */}
              {addStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã cấp đào tạo *
                    </label>
                    <input
                      type="text"
                      value={addFormData.educationLevelCode}
                      onChange={(e) =>
                        handleAddInputChange(
                          "educationLevelCode",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã cấp đào tạo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên cấp đào tạo *
                    </label>
                    <input
                      type="text"
                      value={addFormData.educationLevelName}
                      onChange={(e) =>
                        handleAddInputChange(
                          "educationLevelName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên cấp đào tạo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã lớp *
                    </label>
                    <input
                      type="text"
                      value={addFormData.classCode}
                      onChange={(e) =>
                        handleAddInputChange("classCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã lớp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên lớp *
                    </label>
                    <input
                      type="text"
                      value={addFormData.className}
                      onChange={(e) =>
                        handleAddInputChange("className", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên lớp"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setAddStep(2)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={!addStep3Valid}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                    >
                      Hoàn thành
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Chỉnh sửa Trường Đại Học</h2>
              <button
                onClick={resetEditForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps */}
            <div className="flex mb-6">
              <div
                className={`flex-1 text-center py-2 ${
                  editStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 1: Thông tin trường
              </div>
              <div
                className={`flex-1 text-center py-2 ${
                  editStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 2: Thông tin tổ chức
              </div>
              <div
                className={`flex-1 text-center py-2 ${
                  editStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bước 3: Thông tin lớp học
              </div>
            </div>

            <form onSubmit={handleEditSubmit}>
              {/* Step 1: University Information */}
              {editStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã trường *
                    </label>
                    <input
                      type="text"
                      value={editFormData.universityCode}
                      onChange={(e) =>
                        handleEditInputChange("universityCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã trường"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên trường *
                    </label>
                    <input
                      type="text"
                      value={editFormData.universityName}
                      onChange={(e) =>
                        handleEditInputChange("universityName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên trường"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditStep(2)}
                      disabled={!editStep1Valid}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Organization Information */}
              {editStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã tổ chức *
                    </label>
                    <input
                      type="text"
                      value={editFormData.organizationCode}
                      onChange={(e) =>
                        handleEditInputChange(
                          "organizationCode",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã tổ chức"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên tổ chức *
                    </label>
                    <input
                      type="text"
                      value={editFormData.organizationName}
                      onChange={(e) =>
                        handleEditInputChange(
                          "organizationName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên tổ chức"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setEditStep(1)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStep(3)}
                      disabled={!editStep2Valid}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Education Level and Class Information */}
              {editStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã cấp đào tạo *
                    </label>
                    <input
                      type="text"
                      value={editFormData.educationLevelCode}
                      onChange={(e) =>
                        handleEditInputChange(
                          "educationLevelCode",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã cấp đào tạo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên cấp đào tạo *
                    </label>
                    <input
                      type="text"
                      value={editFormData.educationLevelName}
                      onChange={(e) =>
                        handleEditInputChange(
                          "educationLevelName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên cấp đào tạo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã lớp *
                    </label>
                    <input
                      type="text"
                      value={editFormData.classCode}
                      onChange={(e) =>
                        handleEditInputChange("classCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mã lớp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên lớp *
                    </label>
                    <input
                      type="text"
                      value={editFormData.className}
                      onChange={(e) =>
                        handleEditInputChange("className", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên lớp"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setEditStep(2)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={!editStep3Valid}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
