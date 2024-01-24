"use client";
// 필요한 의존성을 가져옵니다.
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";

// BoardInfo 인터페이스를 정의합니다.
interface BoardInfo {
  titleKey: string;
  adddate: string;
  username: string;
  password: string;
  title: string;
  content: string;
  reply: string;
}

// Page 컴포넌트를 생성합니다.
export default function Board() {
  // 데이터 및 UI 상태를 관리하는 상태 변수들입니다.
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

  // 서버에서 게시판 데이터를 가져오는 함수입니다.
  const fetchData = useCallback(async (page: number) => {
    try {
      let apiUrl = `/api/qna?page=${page}&pageSize=${pageSize}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      setBoards(data.boards); // null 또는 undefined가 아닐 경우에만 설정
      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  }, []);

  const [inputPassword, setInputPassword] = useState("");
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBoardInfo((prevBoardInfo) => ({
      ...prevBoardInfo,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setShowForm(false);
    setSelectedBoard(null);
    setInputPassword(""); // 모달 닫을 때 비밀번호 초기화
  };

  const handlePasswordCheck = () => {
    // 입력한 비밀번호와 글의 비밀번호 비교
    if (inputPassword === selectedBoard?.password) {
      alert("비밀번호 일치! 글을 표시합니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 현재 시간
  const formatDateTime = (date: string) => {
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Seoul",
    };
    const dateTimeString = dateObject.toLocaleString("ko-KR", options);
    return dateTimeString;
  };

  const handleWriteButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      setBoardInfo({
        titleKey: "",
        adddate: "",
        username: "",
        password: "",
        title: "",
        content: "",
        reply: "",
      });
      setSelectedBoard(null); // 글쓰기 모달이 열릴 때 선택된 게시글 초기화
      setInputPassword("");
    }
  };


  const handleSubmit = async () => {
    // content(내용) 필드가 비어 있는지 확인
    if (!boardInfo.content.trim()) {
      alert("내용을 입력하세요."); // 원하는 방식으로 알림을 표시하거나 검증 오류를 처리하세요
      return;
    }
  
    try {
      const response = await fetch("/api/qnawrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardInfo),
      });
  
      if (response.ok) {
        fetchData(pageInfo.currentPage);
        alert("등록 완료");
      } else {
        console.error(`게시글 추가 중 오류 발생: ${response.status}`);
        alert("등록 실패");
      }
  
      // 모달 닫기
      setShowForm(false);
    } catch (error) {
      console.error("게시글 추가 중 오류 발생:", error);
    }
  };


  // 컴포넌트 마운트 또는 페이지 변경 시 데이터를 가져오는 효과입니다.
  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  // 페이징 변경을 처리하는 이벤트 핸들러입니다.
  const handlePageChange = async (newPage: number) => {
    // 페이지 이동 중 로딩 상태를 보여줄 수 있는 UI 추가
    setBoards([]);
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });

    try {
      let apiUrl = `/api/qna?page=${newPage}&pageSize=${pageSize}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("Fetched data:", data);

      setBoards(data.boards || []);
      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleRowClick = async (board: BoardInfo) => {
    const enteredPassword = prompt("비밀번호를 입력하세요:");

    if (enteredPassword === board.password) {
      setShowForm(false);
      setSelectedBoard(board);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Q&A 게시판</h1>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white py-3 px-10 rounded"
          onClick={handleWriteButtonClick}
        >
          글쓰기
        </button>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-30 backdrop-filter backdrop-blur-sm bg-gray-300 p-8 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-9/10 md:w-2/3 lg:w-1/2 xl:w-1/3 relative leading-6">
            <h2 className="text-3xl font-bold mb-4 text-center ">글쓰기</h2>
            <br />
            <span
              onClick={handleModalClose}
              className="cursor-pointer absolute top-2 right-2 text-2xl"
              style={{ zIndex: 1 }} // Updated zIndex value
            >
              &times;
            </span>
            <div className="mb-4">
              <label htmlFor="title" className="text-2xl font-bold mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={boardInfo.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="text-2xl font-bold mb-2">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={boardInfo.content}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="text-2xl font-bold mb-2">
                유저이름
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={boardInfo.username}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-2xl font-bold mb-2">
                패스워드
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={boardInfo.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-4 mt-4 mx-auto block border rounded"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <table className="w-full border-collapse border mt-10">
          <thead className="border-b-2 border-solid border-gray-200">
            <tr className="text-lg md:text-xl bg-gray-200">
              <th className="p-2 text-2xl font-bold text-center w-1/12">
                Title Key
              </th>
              <th className="p-2 text-2xl font-bold w-3/12">Add Date</th>
              <th className="p-2 text-2xl font-bold w-1.2/12">Username</th>
              <th className="p-2 text-2xl font-bold w-3/12">Title</th>
              <th className="p-2 text-2xl font-bold w-3/12">Reply</th>
              <th className="p-2 text-2xl font-bold w-3/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.titleKey}>
                <td className="p-2 text-center border px-4 py-2">
                  {board.titleKey}
                </td>
                <td className="border px-4 py-2 text-center">
                  {formatDateTime(board.adddate)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {board.username}
                </td>
                <td className="border px-4 py-2 text-center">{board.title}</td>
                <td className="border px-4 py-2 text-center">{board.reply}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleRowClick(board)}
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedBoard && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-30 backdrop-filter backdrop-blur-sm bg-gray-300 p-8 z-50">
            <div className="bg-white p-8 rounded-lg shadow-md md:w-96 w-3/5 relative leading-6">
              <span
                onClick={handleModalClose}
                className="absolute top-4 right-4 text-2xl cursor-pointer"
              >
                &times;
              </span>
              <h2 className="text-2xl font-bold mb-4">
                titleKey : {selectedBoard.titleKey}
              </h2>
              <div>adddate : {formatDateTime(selectedBoard.adddate)}</div>
              <div>username : {selectedBoard.username}</div>
              <div>title : {selectedBoard.title}</div>
              <div>content : {selectedBoard.content}</div>
              <div>reply : {selectedBoard.reply}</div>
            </div>
          </div>
        )}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-center space-x-2">
          {Array.from(
            { length: pageInfo.totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`w-10 h-10 px-2 border  rounded ${
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