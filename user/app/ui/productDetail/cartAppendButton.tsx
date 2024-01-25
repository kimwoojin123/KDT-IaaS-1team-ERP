interface CartAppendButtonProp{
  onClick : () => void;
}


export default function CartAppendButton({onClick}:CartAppendButtonProp){

  return (
    <div className="flex justify-center items-center font-bold bg-green-500 text-white w-40 h-12 rounded-lg" >
      <button onClick={onClick}>ADD TO CART</button>
    </div>
  )
}