"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";

interface BoardInfo {
  titleKey: string;
  adddate: string;
  username: string;
  password: string;
  title: string;
  content: string;
  reply: string;
}

export default function Page() {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [boardInfo, setBoardInfo] = useState<BoardInfo>({
    titleKey: "",
    adddate: "",
    username: "",
    password: "",
    title: "",
    content: "",
    reply: "",
  });

  const [selectedBoard, setSelectedBoard] = useState<BoardInfo | null>(null);
  const [editedReply, setEditedReply] = useState<{
    [username: string]: string;
  }>({});

  // 서버에서 게시판 데이터를 가져오는 함수
  const fetchData = useCallback(async (page: number) => {
    try {
      let apiUrl = `/api/qna?page=${page}&pageSize=${pageSize}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      setBoards(data.boards);
      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  }, []);

  const handleRowClick = (board: BoardInfo) => {
    setSelectedBoard(board);
  };

  const handleModalClose = () => {
    setSelectedBoard(null);
  };

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  const handleReplyEdit = async (username: string) => {
    try {
      await fetch(`/api/updateReply/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: editedReply[username] }),
      });

      // 수정 후 데이터 다시 불러오기
      fetchData(pageInfo.currentPage);
      setEditedReply((prev) => ({ ...prev, [username]: "" }));
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const formatDateTime = (datetime: string) => {
    const dateTime = new Date(datetime);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    const dateTimeString = dateTime.toLocaleString();
    return dateTimeString;
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">고객 문의</h1>
      <table>
        {showForm && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-30 backdrop-filter backdrop-blur-sm bg-gray-300 p-8 z-50">
            {/* Modal Form */}
            <div className="bg-white p-8 rounded-md shadow-md w-full md:w-96">
              {/* Close button */}
              <span
                onClick={handleModalClose}
                className="cursor-pointer absolute top-2 right-2 text-2xl"
              >
                &times;
              </span>
            </div>
          </div>
        )}
      </table>

      <div>
        {" "}
        {/* Increased margin-top for spacing */}
        <table className="w-full border-collapse border mt-10">
          <thead className="bg-gray-200">
            <tr className="text-lg md:text-xl">
              <th className="p-2 text-2xl font-bold text-center w-1/12">
                titleKey
              </th>
              <th className="p-2 text-2xl font-bold text-center">adddate</th>
              <th className="p-2 text-2xl font-bold text-center">username</th>
              <th className="p-2 text-2xl font-bold text-center">title</th>
              <th className="p-2 text-2xl font-bold text-center">reply</th>
              <th className="p-2 text-2xl font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board, index) => (
              <tr
                key={board.titleKey}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-2 text-center">{board.titleKey}</td>
                <td className="p-2 text-center">
                  {formatDateTime(board.adddate)}
                </td>
                <td className="p-2 text-center">{board.username}</td>
                <td className="p-2 text-center">{board.title}</td>
                <td className="p-2 text-center">{board.reply}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRowClick(board)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          {selectedBoard && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-30 backdrop-filter backdrop-blur-sm bg-gray-300 p-8 z-50">
              <div className="bg-white p-8 rounded-lg shadow-md md:w-96 w-3/5 relative leading-6">
                <span
                  onClick={handleModalClose}
                  className="cursor-pointer absolute top-2 right-2 text-2xl"
                >
                  &times;
                </span>
                <form action="">
                  <h2 className="text-2xl font-bold">
                    titleKey : {selectedBoard.titleKey}
                  </h2>
                  <div>adddate : {formatDateTime(selectedBoard.adddate)}</div>
                  <div>username : {selectedBoard.username}</div>
                  <div>title : {selectedBoard.title}</div>
                  <div>content : {selectedBoard.content}</div>
                  <div>reply : {selectedBoard.reply}</div>
                  <input
                    type="text"
                    value={editedReply[selectedBoard.username] || ""}
                    onChange={(e) =>
                      setEditedReply((prev) => ({
                        ...prev,
                        [selectedBoard.username]: e.target.value,
                      }))
                    }
                    className="border p-2 mt-2 w-full"
                  />
                  <button
                    onClick={() => handleReplyEdit(selectedBoard.username)}
                    className="bg-blue-500 text-white px-4 py-2 mt-4 mx-auto block border rounded"
                  >
                    등록
                  </button>
                </form>
              </div>
            </div>
          )}
        </table>
        <div className="mt-4 flex items-center justify-center space-x-2">
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
    </div>
  );
}