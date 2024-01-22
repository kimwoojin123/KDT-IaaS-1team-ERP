"use client"
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

// 페이징을 위한 페이지 크기를 설정합니다.
const pageSize = 10;

// Page 컴포넌트를 생성합니다.
export default function Board() {
  // 데이터 및 UI 상태를 관리하는 상태 변수들입니다.
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
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
      
      console.log("Fetched data:", data);  // 로그 추가
  
      setBoards(data.boards || []); // null 또는 undefined가 아닐 경우에만 설정
      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  }, []);

  // 모달 폼 내의 입력 값 변경을 처리하는 이벤트 핸들러입니다.
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBoardInfo((prevBoardInfo) => ({
      ...prevBoardInfo,
      [name]: value,
    }));
  };

  // 행을 클릭하여 세부 정보를 표시하는 이벤트 핸들러입니다.
  const handleRowClick = (board: BoardInfo) => {
    setShowForm(false);
    setSelectedBoard(board);
  };

  // 글쓰기 모달이 나오는 이벤트 핸들러입니다.
  const handleWriteButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      setSelectedBoard(null); // 글쓰기 모달이 열릴 때 선택된 게시글 초기화
    }
  };

  // 모달을 닫는 이벤트 핸들러입니다.
  const handleModalClose = () => {
    setShowForm(false);
    setSelectedBoard(null);
  };

  // 현재 시간 
  const formatDateTime = (date: string) => {
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Seoul'
    };
    const dateTimeString = dateObject.toLocaleString('ko-KR', options);
    return dateTimeString;
  };

  // 페이징 변경을 처리하는 이벤트 핸들러입니다.
  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  // 폼을 제출하는 이벤트 핸들러입니다.
  const handleSubmit = async () => {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Q&A 게시판</h1>
      
      <button
  className="bg-blue-500 text-white py-2 px-4 rounded"
  onClick={handleWriteButtonClick}
>
  글쓰기
</button>
{showForm && (
  // <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white p-8 rounded-md">
    {/* <div className="bg-white p-8 rounded-md"> */}
      <span onClick={handleModalClose} className="cursor-pointer absolute top-4 right-4 text-2xl">&times;</span>
      <h2 className="text-2xl font-bold mb-4">글쓰기</h2>
      <div className="mb-4">
        <label htmlFor="title" className="text-lg font-bold mb-2">제목:</label>
        <input type="text" id="title" name="title" value={boardInfo.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="text-lg font-bold mb-2">내용:</label>
        <textarea id="content" name="content" value={boardInfo.content} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded"></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="text-lg font-bold mb-2">유저이름:</label>
        <input type="text" id="username" name="username" value={boardInfo.username} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="text-lg font-bold mb-2">패스워드:</label>
        <input type="password" id="password" name="password" value={boardInfo.password} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div>
        <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">등록</button>
      </div>
    </div>
  </div>
)}


      <div className="mt-8">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title Key</th>
              <th className="border px-4 py-2">Add Date</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Reply</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.titleKey}>
                <td className="border px-4 py-2">{board.titleKey}</td>
                <td className="border px-4 py-2">{formatDateTime(board.adddate)}</td>
                <td className="border px-4 py-2">{board.username}</td>
                <td className="border px-4 py-2">{board.title}</td>
                <td className="border px-4 py-2">{board.reply}</td>
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white py-1 px-2 rounded mr-2" onClick={() => handleRowClick(board)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedBoard && (
          <div className="mt-4 p-4 bg-gray-100">
            <span onClick={handleModalClose}>&times;</span>
            <h2>titleKey : {selectedBoard.titleKey}</h2>
            <div>adddate : {formatDateTime(selectedBoard.adddate)}</div>
            <div>username : {selectedBoard.username}</div>
            <div>password : {selectedBoard.password}</div>
            <div>title : {selectedBoard.title}</div>
            <div>content : {selectedBoard.content}</div>
            <div>reply : {selectedBoard.reply}</div>
          </div>
        )}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-center space-x-2">
          {Array.from({ length: pageInfo.totalPages }, (_, index) => index + 1).map((pageNumber) => (
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