import Link from "next/link";

export default function Page() {
  return (
    <div className="w-lvw h-1/4">
      <ul>
        <li className="display: flex flex-grow-1 space-x-40 flex-wrap">
          <Link href="registration">
            <li className="w-60 h-60 bg-cyan-300 ">1</li>
          </Link>
          <Link href="list">
            <li className="w-60 h-60 bg-cyan-600 ">2</li>
          </Link>
        </li>
        <li className="display: flex space-x-40">
          <Link href="user">
            <li className="w-60 h-60 bg-cyan-900">3</li>
          </Link>
          <Link href="order">
            <li className="w-60 h-60 bg-red-500">4</li>
          </Link>
        </li>
      </ul>
    </div>
  );
}
