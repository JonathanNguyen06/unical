"use client";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import { auth } from "@/firebase";
import { AppDispatch } from "@/redux/store";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signInUser } from "@/redux/slices/userSlice";
export default function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dispatch: AppDispatch = useDispatch();

  async function handleLogIn() {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredentials.user, {
      displayName: userCredentials.user.displayName,
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

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Header />

        {/* Log In Card */}
        <div className="w-full lg:w-xl h-fit rounded-2xl shadow-lg">
          <div>
            <h2 className="font-bold text-gray-900 m-4 text-3xl">Log In</h2>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
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
              <div className="grid gap-1 m-4">
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full h-10 border-gray-200 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="w-full lg:w-md bg-purple-600 hover:bg-purple-700 transition text-white hover:cursor-pointer rounded-full h-10 block mx-auto"
                onClick={() => handleLogIn()}
              >
                Log In
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600 mb-3">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-purple-600 hover:underline hover:cursor-pointer"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
