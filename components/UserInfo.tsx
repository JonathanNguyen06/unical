"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ClickAwayListener, Popper } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useDispatch } from "react-redux";
import { signOutUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) {
      setAnchorEl(null);
      setIsOpen(false);
    } else {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    }
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node;
    if (popperRef.current?.contains(target) || anchorEl?.contains(target)) {
      return;
    }
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(signOutUser());
        setAnchorEl(null); // Close the Popper after successful sign out
      })
      .catch((err) => console.error("Sign out failed:", err));
    // Close the Popper after successful sign out
    setIsOpen(false);

    router.push("/");
  };

  return (
    <>
      <div className="pe-3 hover:cursor-pointer" onClick={handleToggle}>
        <Image
          src="/assets/guest-profile.png"
          height={44}
          width={44}
          alt="Profile"
          className="rounded-full"
        />
      </div>

      <Popper open={isOpen} anchorEl={anchorEl} placement="bottom">
        <ClickAwayListener onClickAway={handleClickAway}>
          <div
            ref={popperRef}
            className="shadow-xl rounded-xl  sm:w-[80px] m:w-[120px] items-center justify-center flex flex-col xl:w-[240px] text-sm xl:text-[17px] overflow-hidden bg-white"
          >
            <div className="w-full text-center py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200">
              Profile
            </div>
            <div
              className="w-full text-center py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                handleSignOut();
              }}
            >
              Sign Out
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
