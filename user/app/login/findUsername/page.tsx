'use client'

import React, { useState } from 'react';
import Modal from 'react-modal';


const FindUsernamePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');  const [error, setError] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/find-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }

      const data = await response.json();
      setUsername(data.username);
      setError(''); // 성공했을 경우 에러 메시지 초기화
      openModal();
    } catch (error) {
      console.error('Error:', error);
      setUsername(''); // 아이디를 찾지 못했을 때 아이디 초기화
      setError('아이디를 찾을 수 없습니다.\n입력 정보를 확인해주세요.');
      openModal(); // 모달 열기
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-10 text-3xl font-bold">아이디 찾기</h1>
      <form className="w-full max-w-md" onSubmit={(e) => handleSubmit(e)}>
        <label>
          이름
          <input
            className="w-full border border-black p-2 mb-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          이메일
          <input
            className="w-full border border-black p-2 mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button 
        className="border border-black p-2 bg-blue-500 text-white rounded"
        type="submit">아이디 찾기</button>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: " rgba(0, 0, 0, 0.4)",
            width: "100%",
            height: "100vh",
            zIndex: "10",
            position: "fixed",
            top: "0",
            left: "0",
          },
          content: {
            display:"flex",
            flexDirection : "column",
            alignItems : 'center',
            width: "360px",
            height: "180px",
            zIndex: "150",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
            backgroundColor: "white",
            justifyContent: "center",
            overflow: "auto",
            whiteSpace: 'pre-line',
          },
        }}
        contentLabel="아이디 찾기 모달"
      >
        <h2>{error ? '' : `${name}님의 아이디`}</h2>
        <p>{error || `${username}`}</p>
        <button className="w-40 h-10 rounded-2xl bg-gray-200 mt-5"onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default FindUsernamePage;