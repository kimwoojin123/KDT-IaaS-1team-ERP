'use client'

import React, { useState } from 'react';
import Modal from 'react-modal';
import { validatePassword } from '@/app/ui/validation';
const FindPasswordPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);


  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);



  const handleFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/find-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }

      const data = await response.json();
      
      if (data.message === '해당 사용자를 찾았습니다.') {
        // 찾은 사용자가 있을 때 비밀번호 변경 관련 input 표시
        setNewPassword('');
        setError('');
        openModal();
      }
    } catch (error) {
      console.error('Error:', error);
      setError('회원정보를 찾을 수 없습니다.\n입력 정보를 확인해주세요.');
      openModal();
    }
  };

  const handleUpdatePassword = async () => {

    const isPasswordValid = validatePassword(newPassword);

    if (!isPasswordValid) {
      setError('비밀번호는 8~20글자, 영문,숫자,특수문자로 작성하세요.');
      return;
    }

    try {
      const response = await fetch('/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }
      setError('비밀번호가 성공적으로 변경되었습니다.'); // 성공했을 경우 에러 메시지 초기화
    } catch (error) {
      console.error('Error:', error);
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-10 text-3xl font-bold">비밀번호 찾기</h1>
      <form className="w-full max-w-md" onSubmit={handleFindPassword}>
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
          아이디
          <input
            className="w-full border border-black p-2 mb-2"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          이메일
          <input
            className="w-full border border-black p-2 mb-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button 
        className="border border-black p-2 bg-blue-500 text-white rounded"
        type="submit">비밀번호 찾기</button>
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
        contentLabel="비밀번호 찾기 모달"
      >
        <h2>{error ? '' : `비밀번호 변경`}</h2>
        <p>{error || (<div>
          <input
            className='border-gray-300 border pl-2'
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새로운 비밀번호 입력"
          />
          <button className='w-24 h-8 bg-gray-200 rounded-xl ml-2' onClick={handleUpdatePassword}>변경하기</button>
        </div>)}</p>
        <button className="w-40 h-10 rounded-2xl bg-gray-200 mt-5"onClick={closeModal}>닫기</button>
      </Modal>

    </div>
  );
};

export default FindPasswordPage;