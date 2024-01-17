"use client";

import React from "react";
import { useState, useEffect } from "react";

interface User {
  name: string;
  username: string;
  cash: number;
  activate: number;
  checked: boolean;
  addDate: string;
}
const pageSize = 10;

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [giveCash, setGiveCash] = useState<string>("");
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  useEffect(() => {
    fetchData();
  }, [pageInfo.currentPage]);
  const pageSize = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/users?page=${pageInfo.currentPage}&pageSize=${pageInfo.pageSize}`
      );

      if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setUsers(data);

      // 서버에서 전체 페이지 수를 반환하도록 수정했으므로 totalPages를 업데이트합니다.
      setPageInfo((prev) => ({ ...prev, totalPages: data.totalPages }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handlePageChange = (newPage: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: newPage }));
  };
  

  // 특정 사용자의 활성 상태를 비활성화하는 함수를 정의합니다.
  const handleToggleActivation = (
    username: string,
    currentActivate: number
  ) => {
    // 서버에 PUT 요청을 보내 해당 사용자를 비활성화합니다.
    const newActivate = currentActivate === 1 ? 0 : 1;

    fetch(`/users/${username}/toggle-activate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // 응답이 성공적인지 확인합니다.
        if (!response.ok) {
          // 응답이 실패하면 오류를 throw합니다.
          throw new Error("사용자를 비활성화하는데 실패했습니다.");
        }
        // 사용자 목록을 다시 불러와 업데이트하기 위해 서버에 추가 요청을 보냅니다.
        return fetch("/users");
      })
      .then((response) => response.json())
      .then((data) => {
        // 업데이트된 사용자 목록으로 상태를 업데이트합니다.
        setUsers(data);
      })
      .catch((error) => {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error("Error deactivating user:", error);
      });
  };

  const toggleCheckbox = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].checked = !updatedUsers[index].checked;
    setUsers(updatedUsers);
  };

  const giveCashToUsers = () => {
    const checkedUsers = users.filter((user) => user.checked); // 체크된 사용자 필터링
    if (checkedUsers.length === 0) {
      alert("캐시를 지급할 사용자를 선택하세요.");
      return;
    }
    const usernamesToGiveCash = checkedUsers.map((user) => user.username);

    fetch("/give-cash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernames: usernamesToGiveCash, giveCash }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.updatedUsers);
        setGiveCash("");
        alert("지급이 완료되었습니다");
      })
      .catch((error) => {
        console.error("Error granting cash:", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">사용자 목록</h1>
      <div className="flex items-center mb-4">
        <input
          type="number"
          value={giveCash}
          onChange={(e) => setGiveCash(e.target.value)}
          placeholder="캐시를 입력하세요"
          className="border p-2 mr-2 "
        />
        <button
          onClick={giveCashToUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded-md "
        >
          지급
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr className="text-lg md:text-xl">
            <th className="p-2 text-2xl font-bold text-center w-1/12 ">
              Select
            </th>
            <th className="p-2 text-2xl font-bold text-center">Name</th>
            <th className="p-2 text-2xl font-bold text-center">Username</th>
            <th className="p-2 text-2xl font-bold text-center">Cash</th>
            <th className="p-2 text-2xl font-bold text-center">AddDate</th>
            <th className="p-2 text-2xl font-bold text-center">Activation</th>
          </tr>
        </thead>
        <tbody>
        {users && users.map((user, index) => (
  <tr
    key={index}
    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
  >
          {/* {users.map((user, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            > */}
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={user.checked || false}
                  onChange={() => toggleCheckbox(index)}
                />
              </td>
              <td className="p-2 text-center">{user.name}</td>
              <td className="p-2 text-center">{user.username}</td>
              <td className="p-2 text-center">{user.cash}</td>
              <td className="p-2 text-center">
                {new Date(user.addDate)
                  .toISOString()
                  .replace("T", " ")
                  .substr(0, 19)}
              </td>
              <td className="p-2 text-center">
                <button
                  className={`${
                    user.activate === 1 ? "bg-green-400" : "bg-red-400"
                  } text-white px-4 py-2 rounded-md`}
                  onClick={() =>
                    handleToggleActivation(user.username, user.activate)
                  }
                >
                  {user.activate === 1 ? "Activate" : "Deactivate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-center space-x-2">
        {Array.from(
          { length: pageInfo.totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-10 h-10 px-2 border rounded ${
              pageNumber === pageInfo.currentPage
                ? "bg-blue-500 text-white"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
