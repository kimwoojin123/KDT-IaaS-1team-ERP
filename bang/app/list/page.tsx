"use client";

import React, { useState, useEffect } from "react";

interface UserInfo {
  productKey: number;
  productName: string;
  price: number;
}

export default function UserinfoPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admins");

      const data = await response.json();
      const userList = Array.isArray(data) && data.length > 0 ? data[0] : [];
      setUsers(userList);
      console.log(userList);    
  
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}></h1>
          <table className="innerbox">
            <thead>
              <tr>
                <th>productKey</th>
                <th>productName</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.productKey}>
                  <td>{user.productKey}</td>
                  <td>{user.productName}</td>
                  <td>{user.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </main>
  );
}