"use client";

import Header from "@/components/Header";
import { auth } from "@/firebase";
import { signInUser } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  async function handleSignUp() {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredentials.user, {
      displayName: name,
    });

    dispatch(
      signInUser({
        name: userCredentials.user.displayName!,
        username: userCredentials.user.email!.split("@")[0],
        email: userCredentials.user.email!,
        uid: userCredentials.user.uid,
        events: [],
      })
    );
    router.push("/");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        return;
      }

      //Handle redux actions
      dispatch(
        signInUser({
          name: currentUser.displayName!,
          username: currentUser.email!.split("@")[0],
          email: currentUser.email!,
          uid: currentUser.uid,
          events: [],
        })
      );
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Header />

      {/* Sign Up Card */}
      <div className="w-full max-w-md rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sign Up</h2>
        </div>
        <div>
          <div className="space-y-4">
            <div className="grid gap-1">
              <span>Name</span>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <span>Username</span>
              <input
                id="username"
                type="text"
                placeholder="username"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <span>Email</span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <span>Password</span>
              <input
                id="password"
                type="password"
                placeholder=""
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <span>Confirm Password</span>
              <input
                id="confirmPassword"
                type="password"
                placeholder=""
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white hover:cursor-pointer"
              onClick={() => handleSignUp()}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:underline hover:cursor-pointer"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
