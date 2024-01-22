"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CateApplyButton() {
  const router = useRouter();

  const handleCateApplyClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/cateApply");
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  return (
    <button
    className="flex justify-center items-center bg-gray-300 w-36 h-24 rounded-md text-lg transition duration-300 ease-in-out hover:bg-gray-400 mb-8"
    onClick={handleCateApplyClick}>
      카테고리등록
    </button>
  );
}