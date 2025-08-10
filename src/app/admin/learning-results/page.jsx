"use client";

import axios from "axios";
import Link from "next/link";
import { ReactNotifications } from "react-notifications-component";
import { handleNotify } from "@/components/notify";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

import { BASE_URL } from "@/configs";
const LearningResults = () => {
  const router = useRouter();
  const [learningResults, setLearningResults] = useState(null);
  const [semester, setSemester] = useState("2023.1");
  const [semesters, setSemesters] = useState([]);
  const [showCreateSemester, setShowCreateSemester] = useState(false);
  const [newSemester, setNewSemester] = useState({ code: "", schoolYear: "" });
  const [newTerm, setNewTerm] = useState("1");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [showEditSemester, setShowEditSemester] = useState(false);
  const [selectedEditSemesterId, setSelectedEditSemesterId] = useState("");
  const [editSemester, setEditSemester] = useState({
    code: "",
    schoolYear: "",
  });
  const [showConfirmDeleteSemester, setShowConfirmDeleteSemester] =
    useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeUserId, setGradeUserId] = useState("");
  const [gradeSubjects, setGradeSubjects] = useState([
    { subjectCode: "", subjectName: "", credits: "", letterGrade: "A" },
  ]);

  const getSemesterLabel = (s) => {
    if (!s) return "";
    const parts = (s.code || "").split(".");
    const term = parts.length > 1 ? parts[1] : "";
    if (term && s.schoolYear) return `HK ${term} - ${s.schoolYear}`;
    if (s.schoolYear) return `${s.code} (${s.schoolYear})`;
    return s.code;
  };

  const openGradeModal = () => {
    setShowGradeModal(true);
  };

  const addSubjectRow = () => {
    setGradeSubjects([
      ...gradeSubjects,
      { subjectCode: "", subjectName: "", credits: "", letterGrade: "A" },
    ]);
  };

  const removeSubjectRow = (idx) => {
    const next = gradeSubjects.filter((_, i) => i !== idx);
    setGradeSubjects(
      next.length
        ? next
        : [{ subjectCode: "", subjectName: "", credits: "", letterGrade: "A" }]
    );
  };

  const updateSubjectField = (idx, field, value) => {
    const next = gradeSubjects.slice();
    next[idx] = { ...next[idx], [field]: value };
    setGradeSubjects(next);
  };

  const parseTermAndYear = () => {
    const sem = semesters.find((s) => s.code === semester);
    if (!sem) return { term: null, schoolYear: "" };
    let term = null;
    if (sem.code?.startsWith("HK"))
      term = parseInt(sem.code.replace("HK", ""), 10);
    else if (sem.code?.includes("."))
      term = parseInt(sem.code.split(".")[1], 10);
    return { term, schoolYear: sem.schoolYear };
  };

  const submitSemesterGrades = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    const { term, schoolYear } = parseTermAndYear();
    if (!term || !schoolYear) {
      handleNotify("warning", "Thiếu học kỳ", "Vui lòng chọn học kỳ hợp lệ");
      return;
    }
    if (!gradeUserId) {
      handleNotify(
        "warning",
        "Thiếu người dùng",
        "Vui lòng nhập userId của học viên"
      );
      return;
    }
    try {
      const payload = {
        semester: term,
        schoolYear,
        subjects: gradeSubjects.map((s) => ({
          subjectCode: s.subjectCode.trim(),
          subjectName: s.subjectName.trim(),
          credits: Number(s.credits || 0),
          letterGrade: s.letterGrade,
        })),
      };
      await axios.post(`${BASE_URL}/grade/${gradeUserId}`, payload, {
        headers: { token: `Bearer ${token}` },
      });
      handleNotify(
        "success",
        "Thành công",
        `Đã thêm kết quả HK${term} - ${schoolYear}`
      );
      setShowGradeModal(false);
      setGradeUserId("");
      setGradeSubjects([
        { subjectCode: "", subjectName: "", credits: "", letterGrade: "A" },
      ]);
      await fetchLearningResults();
    } catch (err) {
      handleNotify(
        "danger",
        "Lỗi",
        err?.response?.data?.message || "Thêm kết quả thất bại"
      );
    }
  };

  const fetchLearningResults = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningResults?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setLearningResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSemesters();
      await fetchLearningResults();
    };
    init();
  }, []);

  const fetchSemesters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/semester`, {
        headers: { token: `Bearer ${token}` },
      });
      const list = res.data || [];
      setSemesters(list);
      if (list.length > 0) {
        const exists = list.find((s) => s.code === semester);
        if (!exists) setSemester(list[0].code);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const start = yearStart.trim();
      const end = yearEnd.trim();
      const term = String(newTerm).trim();

      if (!start || !end || !term) {
        handleNotify(
          "warning",
          "Thiếu dữ liệu",
          "Vui lòng nhập đủ kỳ và năm học"
        );
        return;
      }
      if (!/^\d{4}$/.test(start) || !/^\d{4}$/.test(end)) {
        handleNotify(
          "danger",
          "Sai định dạng",
          "Năm học phải gồm 4 chữ số, ví dụ 2024 và 2025"
        );
        return;
      }
      if (Number(end) !== Number(start) + 1) {
        handleNotify(
          "warning",
          "Năm học không hợp lệ",
          "Năm kết thúc phải lớn hơn năm bắt đầu 1 năm"
        );
        return;
      }

      const payload = {
        code: `HK${term}`,
        schoolYear: `${start}-${end}`,
      };
      let res;
      try {
        res = await axios.post(`${BASE_URL}/semester/create`, payload, {
          headers: { token: `Bearer ${token}` },
        });
      } catch (err) {
        const msg = err?.response?.data?.message || "Tạo học kỳ thất bại";
        handleNotify("danger", "Lỗi", msg);
        return;
      }
      await fetchSemesters();
      if (res?.data?.code) setSemester(res.data.code);
      setShowCreateSemester(false);
      setNewTerm("1");
      setYearStart("");
      setYearEnd("");
    } catch (error) {
      const msg = error?.response?.data?.message || "Tạo học kỳ thất bại";
      handleNotify("danger", "Lỗi", msg);
    }
  };

  const handleOpenEditSemester = () => {
    if (semesters.length === 0) {
      handleNotify(
        "warning",
        "Chưa có học kỳ",
        "Vui lòng thêm học kỳ trước khi chỉnh sửa"
      );
      return;
    }
    const firstId = semesters[0]._id;
    setSelectedEditSemesterId(firstId);
    const sem = semesters.find((s) => s._id === firstId);
    setEditSemester({
      code: sem?.code || "",
      schoolYear: sem?.schoolYear || "",
    });
    setShowEditSemester(true);
  };

  const handleChangeEditSelect = (e) => {
    const id = e.target.value;
    setSelectedEditSemesterId(id);
    const sem = semesters.find((s) => s._id === id);
    setEditSemester({
      code: sem?.code || "",
      schoolYear: sem?.schoolYear || "",
    });
  };

  const handleUpdateSemester = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !selectedEditSemesterId) return;
    try {
      const payload = {
        code: editSemester.code.trim(),
        schoolYear: editSemester.schoolYear.trim(),
      };
      const res = await axios.put(
        `${BASE_URL}/semester/${selectedEditSemesterId}`,
        payload,
        { headers: { token: `Bearer ${token}` } }
      );
      await fetchSemesters();
      if (semester === res?.data?.code) setSemester(res.data.code);
      setShowEditSemester(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSemester = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedEditSemesterId) return;
    try {
      await axios.delete(`${BASE_URL}/semester/${selectedEditSemesterId}`, {
        headers: { token: `Bearer ${token}` },
      });
      handleNotify("success", "Thành công", "Đã xóa học kỳ");
      setShowConfirmDeleteSemester(false);
      setShowEditSemester(false);
      await fetchSemesters();
    } catch (error) {
      handleNotify(
        "danger",
        "Lỗi",
        error?.response?.data?.message || "Xóa học kỳ thất bại"
      );
    }
  };

  const handleOpenDeleteSemester = () => {
    if (semesters.length === 0) {
      handleNotify(
        "warning",
        "Chưa có học kỳ",
        "Vui lòng thêm học kỳ trước khi xóa"
      );
      return;
    }
    let targetId = null;
    if (semester) {
      const found = semesters.find((s) => s.code === semester);
      if (found) targetId = found._id;
    }
    if (!targetId) targetId = semesters[0]._id;
    setSelectedEditSemesterId(targetId);
    setShowConfirmDeleteSemester(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/admin/learning-results?semester=${semester}`);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/learningResults?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) setLearningResults([]);

        setLearningResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExportFilePdf = async (e, semester) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/commander/learningResult/pdf?semester=${semester}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Thong_ke_ket_qua_hoc_tap_he5_hoc_ky_${semester}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Lỗi tải xuống file", error);
      }
    }
  };

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
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                    <div className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kết quả học tập
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
              <div className="font-bold p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-white text-lg">
                  KẾT QUẢ HỌC TẬP HỌC VIÊN
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors duration-200 flex items-center"
                  onClick={(e) => handleExportFilePdf(e, semester)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Xuất PDF
                </button>
              </div>
              <div className="w-full p-5">
                <form
                  className="flex items-end"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex items-end gap-2">
                    <div>
                      <label
                        htmlFor="semester"
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Chọn học kỳ
                      </label>
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border w-56 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pb-1 pt-1.5 pr-10"
                      >
                        {semesters.length === 0 && (
                          <option value="" disabled>
                            Chưa có học kỳ
                          </option>
                        )}
                        {semesters.map((s) => (
                          <option key={s._id} value={s.code}>
                            {getSemesterLabel(s)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 transition-colors duration-200"
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                  <div className="ml-auto flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateSemester(true)}
                      className="h-9 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-4 transition-colors duration-200"
                    >
                      Thêm học kỳ
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenEditSemester}
                      className="h-9 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-4 transition-colors duration-200"
                    >
                      Chỉnh sửa học kỳ
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenDeleteSemester}
                      className="h-9 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-4 transition-colors duration-200"
                    >
                      Xóa học kỳ
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-full p-5">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          HỌC KỲ
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          HỌ VÀ TÊN
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          TRƯỜNG
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          GPA
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          CPA
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          TC TÍCH LŨY
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          TC NỢ ĐĂNG KÝ
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          TRÌNH ĐỘ
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          CẢNH BÁO
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {learningResults && learningResults.length > 0 ? (
                        learningResults.map((item, index) => (
                          <tr
                            key={item._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.semester}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.university}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.GPA}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.CPA}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.cumulativeCredit} tín chỉ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              {item.totalDebt} tín chỉ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                              Năm {item.studentLevel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.warningLevel === 0
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : item.warningLevel === 1
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                Mức {item.warningLevel}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                          >
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
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <p className="text-lg font-medium">
                                Không có dữ liệu
                              </p>
                              <p className="text-sm">
                                Không tìm thấy kết quả học tập nào
                              </p>
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

      {showCreateSemester && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed" />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thêm học kỳ
              </h2>
              <button
                onClick={() => setShowCreateSemester(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateSemester} className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chọn kỳ
                  </label>
                  <select
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="1">HK1</option>
                    <option value="2">HK2</option>
                    <option value="3">HK3</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Năm bắt đầu
                  </label>
                  <input
                    type="number"
                    value={yearStart}
                    onChange={(e) => setYearStart(e.target.value)}
                    placeholder="vd: 2024"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Năm kết thúc
                  </label>
                  <input
                    type="number"
                    value={yearEnd}
                    onChange={(e) => setYearEnd(e.target.value)}
                    placeholder="vd: 2025"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-700"
                  onClick={() => setShowCreateSemester(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDeleteSemester && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed" />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xác nhận xóa
              </h2>
              <button
                onClick={() => setShowConfirmDeleteSemester(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chọn học kỳ cần xóa
                </label>
                <select
                  value={selectedEditSemesterId}
                  onChange={handleChangeEditSelect}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                >
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      {getSemesterLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Bạn có chắc chắn muốn xóa học kỳ đã chọn? Hành động này không
                thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-700"
                  onClick={() => setShowConfirmDeleteSemester(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSemester}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditSemester && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-50 inset-0 fixed" />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chỉnh sửa học kỳ
              </h2>
              <button
                onClick={() => setShowEditSemester(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateSemester} className="p-4">
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chọn học kỳ cần sửa
                </label>
                <select
                  value={selectedEditSemesterId}
                  onChange={handleChangeEditSelect}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      {getSemesterLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mã kỳ
                </label>
                <input
                  type="text"
                  value={editSemester.code}
                  onChange={(e) =>
                    setEditSemester({ ...editSemester, code: e.target.value })
                  }
                  required
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Năm học
                </label>
                <input
                  type="text"
                  value={editSemester.schoolYear}
                  onChange={(e) =>
                    setEditSemester({
                      ...editSemester,
                      schoolYear: e.target.value,
                    })
                  }
                  required
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-700"
                  onClick={() => setShowEditSemester(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-amber-300 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDeleteSemester(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LearningResults;
