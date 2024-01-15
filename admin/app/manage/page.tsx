// "use client";

// // React와 관련된 필요한 기능을 가져옵니다.
// import { useState, useEffect } from "react";

// // 사용자 정보를 정의하는 인터페이스를 생성합니다.
// interface User {
//   name: string;
//   username: string;
//   cash: number;
//   activate: number;
//   checked: boolean;
//   addDate: string;
// }

// // ManagePage 컴포넌트를 정의합니다.
// export default function ManagePage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [giveCash, setGiveCash] = useState<string>("");

//   // 컴포넌트가 마운트될 때 사용자 목록을 가져오는 효과를 정의합니다.
//   useEffect(() => {
//     // 서버에서 사용자 목록을 가져오는 API 요청을 보냅니다.
//     fetch("/users")
//       .then((response) => {
//         // 응답이 성공적인지 확인합니다.
//         if (!response.ok) {
//           // 응답이 실패하면 오류를 throw합니다.
//           throw new Error("사용자 정보를 가져오는데 실패했습니다.");
//         }
//         // JSON 형태로 변환된 응답 데이터를 반환합니다.
//         return response.json();
//       })
//       .then((data) => {
//         // 반환된 데이터로 사용자 목록 상태를 업데이트합니다.
//         setUsers(data);
//       })
//       .catch((error) => {
//         // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // 특정 사용자의 활성 상태를 비활성화하는 함수를 정의합니다.
//   const handleToggleActivation = (
//     username: string,
//     currentActivate: number
//   ) => {
//     // 서버에 PUT 요청을 보내 해당 사용자를 비활성화합니다.
//     const newActivate = currentActivate === 1 ? 0 : 1;

//     fetch(`/users/${username}/toggle-activate`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => {
//         // 응답이 성공적인지 확인합니다.
//         if (!response.ok) {
//           // 응답이 실패하면 오류를 throw합니다.
//           throw new Error("사용자를 비활성화하는데 실패했습니다.");
//         }
//         // 사용자 목록을 다시 불러와 업데이트하기 위해 서버에 추가 요청을 보냅니다.
//         return fetch("/users");
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         // 업데이트된 사용자 목록으로 상태를 업데이트합니다.
//         setUsers(data);
//       })
//       .catch((error) => {
//         // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
//         console.error("Error deactivating user:", error);
//       });
//   };

//   const toggleCheckbox = (index: number) => {
//     const updatedUsers = [...users];
//     updatedUsers[index].checked = !updatedUsers[index].checked;
//     setUsers(updatedUsers);
//   };

//   const giveCashToUsers = () => {
//     const checkedUsers = users.filter((user) => user.checked); // 체크된 사용자 필터링
//     if (checkedUsers.length === 0) {
//       alert("캐시를 지급할 사용자를 선택하세요.");
//       return;
//     }
//     const usernamesToGiveCash = checkedUsers.map((user) => user.username);

//     fetch("/give-cash", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ usernames: usernamesToGiveCash, giveCash }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setUsers(data.updatedUsers);
//         setGiveCash("");
//         alert("지급이 완료되었습니다");
//       })
//       .catch((error) => {
//         console.error("Error granting cash:", error);
//       });
//   };
//   return (
//     <div className="relative mx-4 md:mx-8">
//       <h1 className="text-4xl font-bold mb-4">사용자 목록</h1>
//       <div className="mt-4">
//         <input
//           type="number"
//           value={giveCash}
//           onChange={(e) => setGiveCash(e.target.value)}
//           placeholder="캐시를 입력하세요"
//           className="border p-2"
//         />
//         <button
//           onClick={giveCashToUsers}
//           className="bg-blue-500 text-white px-4 py-2 ml-2"
//         >
//           지급
//         </button>
//       </div>
//       <table className="mt-4 border-collapse border w-full">
//         <thead className="w-full md:w-full mx-auto mt-4 md:mt-8 border-solid border-2">
//           <tr className=" text-lg md:text-xl bg-gray-200">
//             <th className="p-2 text-2xl font-bold text-center">Select</th>
//             <th className="p-2 text-2xl font-bold text-center">Name</th>
//             <th className="p-2 text-2xl font-bold text-center">Username</th>
//             <th className="p-2 text-2xl font-bold text-center">Cash</th>
//             <th className="p-2 text-2xl font-bold text-center">AddDate</th>
//             <th className="p-2 text-2xl font-bold text-center">Activation</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user, index) => (
//             <tr key={index} className="border-b">
//               <td className="p-2 text-center">
//                 <input
//                   type="checkbox"
//                   checked={user.checked || false}
//                   onChange={() => toggleCheckbox(index)}
//                 />
//               </td>
//               <td className="p-2 text-center">{user.name}</td>
//               <td className="p-2 text-center">{user.username}</td>
//               <td className="p-2 text-center">{user.cash}</td>
//               <td className="p-2 text-center">
//                 {new Date(user.addDate)
//                   .toISOString()
//                   .replace("T", " ")
//                   .substr(0, 19)}
//               </td>
//               <td className="p-2 text-center">
//                 <button
//                   className={`${
//                     user.activate === 1 ? "bg-green-400" : "bg-red-400"
//                   } text-white px-4 py-2`}
//                   onClick={() =>
//                     handleToggleActivation(user.username, user.activate)
//                   }
//                 >
//                   {user.activate === 1 ? "활성화" : "비활성화"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

interface User {
  name: string;
  username: string;
  cash: number;
  activate: number;
  checked: boolean;
  addDate: string;
}

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [giveCash, setGiveCash] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

useEffect(() => {
  fetchUsers();
}, [currentPage]);

const fetchUsers = () => {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  fetch("/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      setUsers(data.slice(startIndex, endIndex));
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};

useEffect(() => {
  fetchUsers();
}, [currentPage]);

const fetchUsers = () => {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  fetch("/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      setUsers(data.slice(startIndex, endIndex));
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};



  const handleToggleActivation = (username: string, currentActivate: number) => {
    const newActivate = currentActivate === 1 ? 0 : 1;

    fetch(`/users/${username}/toggle-activate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("사용자를 비활성화하는데 실패했습니다.");
        }
        return fetch("/users");
      })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error deactivating user:", error);
      });
  };

  const toggleCheckbox = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].checked = !updatedUsers[index].checked;
    setUsers(updatedUsers);
  };

  const giveCashToUsers = () => {
    const checkedUsers = users.filter((user) => user.checked);
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
        setUsers(data);
        setGiveCash("");
        alert("지급이 완료되었습니다");
      })
      .catch((error) => {
        console.error("Error granting cash:", error);
      });
  };

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="relative mx-4 md:mx-8">
      <h1 className="text-4xl font-bold mb-4">사용자 목록</h1>
      <div className="mt-4">
        <input
          type="number"
          value={giveCash}
          onChange={(e) => setGiveCash(e.target.value)}
          placeholder="캐시를 입력하세요"
          className="border p-2"
        />
        <button
          onClick={giveCashToUsers}
          className="bg-blue-500 text-white px-4 py-2 ml-2"
        >
          지급
        </button>
      </div>
      <table className="mt-4 border-collapse border w-full">
        <thead className="w-full md:w-full mx-auto mt-4 md:mt-8 border-solid border-2">
          <tr className=" text-lg md:text-xl bg-gray-200">
            <th className="p-2 text-2xl font-bold text-center">Select</th>
            <th className="p-2 text-2xl font-bold text-center">Name</th>
            <th className="p-2 text-2xl font-bold text-center">Username</th>
            <th className="p-2 text-2xl font-bold text-center">Cash</th>
            <th className="p-2 text-2xl font-bold text-center">AddDate</th>
            <th className="p-2 text-2xl font-bold text-center">Activation</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="border-b">
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
                  } text-white px-4 py-2`}
                  onClick={() =>
                    handleToggleActivation(user.username, user.activate)
                  }
                >
                  {user.activate === 1 ? "활성화" : "비활성화"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`mx-1 p-2 bg-gray-200 ${
              currentPage === index + 1 ? "text-blue-500" : "text-black"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
