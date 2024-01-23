import ResignButton from "../ui/mypage/resignbutton"
import UserInfo from "../ui/mypage/usernameinfo"
import OrderInfoButton from "../ui/mypage/orderInfoButton"
import UserEditButton from "../ui/mypage/userEditButton"
import Link from "next/link"

export default function MyPage(){
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-gray-100">
      <div className="text-4xl font-semibold mb-12">MYPAGE</div>
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <div className="mb-8">
          <div className="text-xl font-medium mb-4">
            <UserInfo />
            <div className="h-2 w-full bg-gray-300"></div>
          </div>
          <OrderInfoButton />
        </div>

        <div className="mb-8">
          <div className="text-xl font-medium mb-4">나의 계정정보</div>
          <div className="h-2 w-full bg-gray-300 mb-6"></div>
          <div className="flex flex-col">
            <UserEditButton />
            <ResignButton />
          </div>
        </div>

        <div>
          <div className="text-xl font-medium mb-4">고객센터</div>
          <div className="h-2 w-full bg-gray-300 mb-6"></div>
          <button className="text-center text-blue-600 hover:underline">
            <Link href={"../board"}>1:1 문의하기</Link>
          </button>
        </div>
      </div>
    </div>
  );
}