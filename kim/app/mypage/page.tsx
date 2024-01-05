import ResignButton from "../ui/mypage/resignbutton"
import UserInfo from "../ui/mypage/usernameinfo"

export default function MyPage(){
  return (
    <div className="flex flex-col w-lvw h-lvh justify-center items-center">
      <UserInfo />
      <ResignButton />
    </div>
  )
}