"use client";

export default function ReloadButton() {
  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <button type="button" onClick={handleClick}>
      <img style={{ width: "8vw" }} src="/logo.png" alt="logo" />
    </button>
  );
}