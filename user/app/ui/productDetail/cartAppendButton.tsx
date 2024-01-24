interface CartAppendButtonProp{
  onClick : () => void;
}


export default function CartAppendButton({onClick}:CartAppendButtonProp){

  return (
    <div className="flex justify-center items-center bg-gray-300 w-20 h-7" >
      <button onClick={onClick}>장바구니</button>
    </div>
  )
}