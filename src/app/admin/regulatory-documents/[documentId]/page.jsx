"use client";

import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

const RegulatoryDocumentDetail = ({ params }) => {
  const [documentDetail, setDocumentDetail] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const fetchDocumentDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(
          `https://be-student-manager.onrender.com/commander/regulatory_documents/${params.documentId}`,
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
      <div>
        <SideBar />
      </div>
      <div className="w-full ml-64">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                  className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
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
                  <div className="ms-1 text-sm pointer-events-none text-custom text-opacity-70 font-medium md:ms-2 dark:text-gray-400 dark:hover:text-white">
                    Chi tiết
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="rounded-lg w-full">
            <div className="bg-white p-5 mb-5 rounded-lg">
              <div className="font-bold text-2xl">{documentDetail?.title}</div>
              <div className="mt-3">{documentDetail?.content}</div>
              {documentDetail?.attachments && (
                <div className="mt-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-bold underline"
                  >
                    {documentDetail.title} (Cập nhật ngày{" "}
                    {dayjs(documentDetail.dateIssued).format("DD/MM/YYYY")}) xem
                    trước file PDF
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
