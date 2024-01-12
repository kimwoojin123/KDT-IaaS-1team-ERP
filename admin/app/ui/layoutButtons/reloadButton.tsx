'use client'
 
 
export default function ReloadButton() {
  
  const handleClick = () =>{
    window.location.href='/'
  }

  return (
    <button className='text-2xl' type="button" onClick={handleClick}>
      DyaBya
    </button>
  )
}