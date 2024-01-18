// user 관리 페이지
"use client";

import React, { useState, useEffect, useCallback } from "react";

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = `/users?page=${page}&pageSize=${pageSize}`;

        if (searchTerm) {
          apiUrl += `&searchTerm=${searchTerm}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setUsers(data.users);
        setPageInfo({
          currentPage: data.pageInfo.currentPage,
          pageSize: data.pageInfo.pageSize,
          totalPages: data.pageInfo.totalPages,
        });
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다.", error);
      }
    },
    [searchTerm]
  );

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  const handleCheckboxChange = (username: string) => {
    setSelectedUsers((prevSelected) => {
      const isSelected = prevSelected.includes(username);
      let updatedSelected: string[];

      if (isSelected) {
        updatedSelected = prevSelected.filter((name) => name !== username);
      } else {
        updatedSelected = [...prevSelected, username];
      }

      return updatedSelected;
    });
  };

  const handleToggleActivation = async (username: string, currentActivate: number) => {
      try {
      // 서버에 활성화/비활성화 토글 요청 보내기
     const response = await fetch(`/users/${username}/toggle-activate`, {
        method: "PUT",
        });

          if (!response.ok) {
            throw new Error("사용자 활성화/비활성화를 토글하는데 실패했습니다.");
  }

  // 성공적으로 토글된 경우, 사용자 목록 다시 불러오기
  fetchData(pageInfo.currentPage);
  } catch (error) {
  console.error("사용자 활성화/비활성화 토글 중 오류 발생:", error);
  }
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
  
  useEffect(() => {
    setSearchTerm("");
  }, []);

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">사용자 목록</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="이름 또는 아이디로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md text-black px-10 py-2.5 ml-4 mb-4"
        />
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

      <table className="mt-4 border-collapse border w-full">
        <thead className="border-b-2 border-solid border-gray-200">
          <tr className="text-lg md:text-xl bg-gray-200">
            <th className="p-2 text-2xl text-center w-1/12 border-solid">
              선택
            </th>
            <th className="p-2 text-2xl text-center w-3/12">이름</th>
            <th className="p-2 text-2xl text-center w-3/12">아이디</th>
            <th className="p-2 text-2xl text-center w-2/12">캐시</th>
            <th className="p-2 text-2xl text-center w-2/12">가입일</th>
            <th className="p-2 text-2xl text-center w-1/12">활성화</th>
          </tr>
        </thead>
        <tbody className="py-4">
          {Array.isArray(users) &&
            users.map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } text-base md:text-lg  px-4 py-4 rounded-md`}
                style={{ lineHeight: "2.5" }}
              >
            <td className="text-center">
                <input
                  type="checkbox"
                  checked={user.checked || false}
                  onChange={() => toggleCheckbox(index)}
                />
              </td>
                <td className="text-center">{user.name}</td>
                <td className="text-center">{user.username}</td>
                <td className="text-center">{user.cash}</td>
                <td className="text-center">
                  {new Date(user.addDate)
                    .toISOString()
                    .replace("T", " ")
                    .substr(0, 19)}
                </td>
                <td className="text-center">
                  <button
                    className={`${
                      user.activate === 1 ? "bg-green-400" : "bg-red-400"
                    } text-white px-2 py-1 rounded-md text-sm`}
                    onClick={() => handleToggleActivation(user.username, user.activate)}
                  >
                    {user.activate === 1 ? "Activate" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center space-x-2 fixed bottom-0 left-0 w-full bg-white p-4">
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
