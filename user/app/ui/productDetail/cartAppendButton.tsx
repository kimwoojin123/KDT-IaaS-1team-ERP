interface CartAppendButtonProp{
  onClick : () => void;
}


export default function CartAppendButton({onClick}:CartAppendButtonProp){

  return (
    <div className="flex justify-center items-center bg-blue-500 w-40 h-12 rounded-md">
      <button onClick={onClick} className="text-white font-semibold text-lg">장바구니</button>
    </div>
  );
}