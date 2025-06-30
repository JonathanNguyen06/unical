import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="absolute top-3 left-5 z-10 flex items-center">
      <Image
        src={"/assets/unical-logo.png"}
        width={44}
        height={44}
        alt="Unical Logo"
      />
      <h1 className="font-bold text-2xl text-gray-700">Unical</h1>
    </nav>
  );
}
