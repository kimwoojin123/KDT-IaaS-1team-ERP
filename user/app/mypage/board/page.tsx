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
export default function Page() {
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



      setBoards(data.boards);
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
    setSelectedBoard(board);
  };

  // 글쓰기 모달이 나오는 이벤트 핸들러입니다.
  const handleWriteButtonClick = () => {
    setShowForm(true);
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

  // 컴포넌트를 렌더링합니다.
  return (
    <div>
      <h1>Q&A 게시판</h1>
      <button onClick={handleWriteButtonClick}>글쓰기</button>
      {showForm && (
        <div
          style={{
            display: "block",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          {/* Modal Form */}
          <div>
            <span
              onClick={handleModalClose}
              style={{ cursor: "pointer", float: "right" }}
            >
              &times;
            </span>
            <h2>글쓰기</h2>
            <div>
              <label htmlFor="title">제목:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={boardInfo.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="content">내용:</label>
              <textarea
                id="content"
                name="content"
                value={boardInfo.content}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="username">유저이름:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={boardInfo.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password">패스워드:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={boardInfo.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button onClick={handleSubmit}>등록</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <table>
          <thead>
            <tr>
              <th>titleKey</th>
              <th>adddate</th>
              <th>username</th>
              {/* <th>password</th> */}
              <th>title</th>
              {/* <th>content</th> */}
              <th>reply</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.titleKey}>
                <td>{board.titleKey}</td>
                <td>{formatDateTime(board.adddate)}</td>
                <td>{board.username}</td>
                {/* <td>{board.password}</td> */}
                <td>{board.title}</td>
                {/* <td>{board.content}</td> */}
                <td>{board.reply}</td>
                <td><button onClick={() => handleRowClick(board)}>보기</button></td>

              </tr>
            ))}
          </tbody>
        </table>
        {selectedBoard && (
          
          <div>
            <div>
              <span onClick={handleModalClose}>&times;</span>
              <h2>titleKey : {selectedBoard.titleKey}</h2>
              <div>adddate : {selectedBoard.adddate}</div>
              <div>username : {selectedBoard.username}</div>
              <div>password : {selectedBoard.password}</div>
              <div>title : {selectedBoard.title}</div>
              <div>content : {selectedBoard.content}</div>
              <div>reply : {selectedBoard.reply}</div>
            </div>
          </div>
        )}
        <div>
          {Array.from(
            { length: pageInfo.totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${
                pageNumber === pageInfo.currentPage ? "active" : ""
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
