'use client'

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

// pagenation
const pageSize = 10;

export default function Page() {
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

  const [editedReply, setEditedReply] = useState<{ [username: string]: string }>(
    {}
  );

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl =
          "/qna?page=" + page + "&pageSize=" + pageSize;

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
    },[]);

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
      // 수정된 Cash 값을 초기화
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
    <div>
      <h1>고객 문의</h1>
  
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
            {/* 나머지 모달 폼 내용 */}
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
              {/* 나머지 선택된 보드 내용 */}
              <input
                type="text"
                value={editedReply[selectedBoard.username] || ""}
                onChange={(e) =>
                  setEditedReply((prev) => ({
                    ...prev,
                    [selectedBoard.username]: e.target.value,
                  }))
                }
              />
              <button onClick={() => handleReplyEdit(selectedBoard.username)}>
                등록
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  