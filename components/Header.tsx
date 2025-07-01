import React from "react";
import Image from "next/image";
import UserInfo from "./UserInfo";

interface HeaderProps {
  loggedIn: boolean;
}
export default function Header({ loggedIn }: HeaderProps) {
  return (
    <nav className="absolute top-3 ps-3 z-10 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Image
          src={"/assets/unical-logo.png"}
          width={44}
          height={44}
          alt="Unical Logo"
        />
        <h1 className="font-bold text-2xl text-gray-700">Unical</h1>
      </div>
      {loggedIn && <UserInfo />}
    </nav>
  );
}
