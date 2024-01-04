import Image from "next/image";
import Link from "next/link";
import styles from "./ui/home.module.css";

export default function Home() {
  return (
    <div className={styles.homeCont}>
      <div className={styles.homeMenuCont}>
      <Link className={styles.homeMenu} href="/OrderManagement">Order Management</Link>
      <Link className={styles.homeMenu} href="/UserManagement">User Management</Link>
      <Link className={styles.homeMenu} href="/productList">product List</Link>
      <Link className={styles.homeMenu} href="/ProductRegist">Product Regist</Link>
      </div>
    </div>
  );
}
