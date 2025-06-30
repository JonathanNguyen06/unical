"use client";

import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import { auth } from "@/firebase";
import { signInUser } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Header />

        {/* Sign Up Card */}
        <div className="w-full lg:w-xl rounded-2xl shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 m-4">Sign Up</h2>
          </div>
          <div>
            <div className="space-y-4">
              <div className="grid gap-1 m-4">
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full h-10 border-gray-200 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-1 m-4">
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="w-full h-10 border-gray-200 border rounded-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-1 m-4">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full h-10 border-gray-200 border rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                className="h-10 border border-gray-200 m-4
                outline-none rounded-[4px]
                transition flex items-center overflow-hidden pr-3"
              >
                <input
                  className="w-full h-full outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
                <div
                  className="w-7 h-7 text-gray-400 cursor-pointer
                "
                  onClick={handleShowPassword}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </div>
              </div>
              <div className="grid gap-1 m-4">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full h-10 border-gray-200 border rounded-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full lg:w-md bg-purple-600 hover:bg-purple-700 text-white hover:cursor-pointer rounded-full h-10 block mx-auto"
                onClick={() => handleSignUp()}
              >
                Sign Up
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600 mb-3">
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
    </>
  );
}
