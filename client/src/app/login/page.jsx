"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { login, register, user } = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      const result = await register(email, password, name);
      if (result.message) {
        setError(result.message);
        return;
      }
      alert("Registration successful!");
    } else {
      const result = await login(email, password);
      if (result.message) {
        setError(result.message);
        return;
      }
    }

    router.push("/");
  };

  if (user) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Welcome, {user.name}!</h1>
        <p>You are already logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6  shadow rounded">
      <h1 className="text-xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-black px-3 py-2 border rounded"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-black px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-black px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        {isRegister
          ? "Already have an account?"
          : "Don't have an account yet?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
