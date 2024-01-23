import ResignButton from "../ui/mypage/resignbutton"
import UserInfo from "../ui/mypage/usernameinfo"
import OrderInfoButton from "../ui/mypage/orderInfoButton"
import UserEditButton from "../ui/mypage/userEditButton"

export default function MyPage(){
  return (
    <div className="flex flex-col w-lvw h-lvh justify-center items-center">
      <UserInfo />
      <UserEditButton />
      <OrderInfoButton />
      <ResignButton />
    </div>
  )
}