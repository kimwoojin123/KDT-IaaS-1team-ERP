"use client";

import React from "react";
import { useState } from "react";

export default function Apply() {
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }

    formData.append("cateName", category);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("stock", stock);

    try {
      const response = await fetch("/addProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 400
            ? "해당 상품명이 이미 존재합니다."
            : "상품을 등록하는데 실패했습니다.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(data.message);
      alert("상품 등록 완료");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message);
    }

    setCategory("");
    setProductName("");
    setPrice("");
    setStock("");
    setImage(null);
  };

  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">상품 등록</h1>
      <div className="flex justify-center mt-8">
        <form
          className="flex flex-col max-w-4xl mx-auto my-8 md:my-3 justify-between w-full md:w-3/4 h-1/4"
          onSubmit={handleSubmit}
        >
          <div className="mb-2 font-bold text-xl item-center">
            <label>
              이미지 업로드 :
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="mb-2 font-bold text-xl items-center">
            <label>
              카테고리 :
              <input
                className="border-solid border-b border-black outline-0 pl-2"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2 font-bold text-xl">
            <label>
              상품명 :
              <input
                className="border-solid border-b border-black outline-0 pl-2"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2 font-bold text-xl">
            <label>
              가격 :
              <input
                className="border-solid border-b border-black outline-0 pl-2"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2 font-bold text-xl">
            <label>
              재고 :
              <input
                className="border-solid border-b border-black outline-0 pl-2"
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </label>
          </div>
          <button
            className="border-solid rounded-sm border-2 border-black mt-2 md:mt-1 md:px-3 px-8 py-2 text-lg font-bold"
            type="submit"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
