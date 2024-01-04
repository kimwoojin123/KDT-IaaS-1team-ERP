import Image from "next/image";
import Link from "next/link";
import styles from "./ui/home.module.css";
import React from 'react';

export default function Home() {
  return (
    <div className={styles.homeCont}>
      <div className={styles.homeMenuCont}>
      <Link className={styles.homeMenu} href="/orderManagement">Order Management</Link>
      <Link className={styles.homeMenu} href="/userManagement">User Management</Link>
      <Link className={styles.homeMenu} href="/productList">Product List</Link>
      <Link className={styles.homeMenu} href="/productRegist">Product Regist</Link>
      </div>
    </div>
  );
}
