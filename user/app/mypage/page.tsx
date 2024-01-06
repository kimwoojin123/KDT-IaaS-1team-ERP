import ResignButton from "../ui/mypage/resignButton"
import UserInfo from "../ui/mypage/usernameInfo"
import OrderInfoButton from "../ui/mypage/orderInfoButton"

export default function MyPage(){
  return (
    <div className="flex flex-col w-lvw h-lvh justify-center items-center">
      <UserInfo />
      <OrderInfoButton />
      <ResignButton />
    </div>
  )
}