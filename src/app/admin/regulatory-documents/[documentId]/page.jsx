"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

import { BASE_URL } from "@/configs";
const RegulatoryDocumentDetail = ({ params }) => {
  const [documentDetail, setDocumentDetail] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const fetchDocumentDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `${BASE_URL}/commander/regulatory_documents/${params.documentId}`,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );

        setDocumentDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchDocumentDetail();
  }, []);

  useEffect(() => {
    if (documentDetail?.attachments) {
      const decodedPdfData = atob(documentDetail.attachments); // Giải mã base64
      const uint8Array = new Uint8Array(decodedPdfData.length);
      for (let i = 0; i < decodedPdfData.length; i++) {
        uint8Array[i] = decodedPdfData.charCodeAt(i);
      }
      const pdfBlob = new Blob([uint8Array], { type: "application/pdf" });

      // Tạo URL tạm thời cho tập tin PDF
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Giải phóng URL khi component bị unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [documentDetail]);

  return (
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
                <Link
                  href="/admin/regulatory-documents"
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
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
                  Văn bản quy định
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
                    Chi tiết
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {documentDetail?.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    Tác giả:{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {documentDetail?.author}
                    </span>
                  </span>
                  <span className="mx-2">•</span>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Ngày ban hành:{" "}
                    <span className="font-medium">
                      {dayjs(documentDetail?.dateIssued).format("DD/MM/YYYY")}
                    </span>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Nội dung
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {documentDetail?.content}
                </div>
              </div>

              {documentDetail?.attachments && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tài liệu đính kèm
                  </h2>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Xem file PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryDocumentDetail;
