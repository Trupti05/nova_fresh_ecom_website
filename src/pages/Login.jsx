import React, { useState } from "react";
import logo from "../component/images/logo.png";
import { RxCross2 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";

function Login({ setSignUpModal, setLogInModal }) {
  // const navigate = useNavigate();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: "", password: "" });
  // const [token, setToken] = useState(localStorage.getItem("token") || ""); // ✅ State to store token

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    const payload = { ...formData };

    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to login user");

      const data = await response.json();
      console.log("Login successful:", data);
      console.log("Printing User Data", data);

      // Save Token to State and Local Storage
      // setToken(data.token);
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));

      localStorage.setItem("token", data.token);
      // localStorage.setItem("user", data);

      console.log("Stored Token:", data.token);

      // Clear form
      setFormData({ email: "", password: "" });
      setLogInModal(false)
    } catch (error) {
      console.error("Error sending login data:", error);
    }
  };

  // console.log("Printing token", token);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg relative">
        <button
          onClick={() => setLogInModal(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
        >
          <RxCross2 size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <img src={logo} className="w-40" alt="Logo" />
        </div>

        <p className="text-center text-gray-600 mb-4">Login</p>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 bg-green-50 text-gray-700 p-3 rounded-md"
            placeholder="E-mail"
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
          />
          <input
            className="w-full border border-gray-300 bg-green-50 text-gray-700 p-3 rounded-md"
            placeholder="Password"
            type="password"
            name="password"
            value={password}
            onChange={handleOnChange}
          />
          <div className="flex items-center">
            <input type="checkbox" id="keepLoggedIn" className="mr-2" />
            <label htmlFor="keepLoggedIn" className="text-sm text-gray-600">
              Keep me logged in
            </label>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-700 text-white font-bold p-3 rounded-lg hover:bg-green-800 transition"
          >
            Log in
          </button>
        </form>

        <div className="text-center text-gray-600 my-4">Or log in with</div>

        <div className="space-y-2">
          <button className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-md">
            <FcGoogle className="mr-2" /> Continue with Google
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-md text-blue-600">
            <FaFacebook className="mr-2" /> Continue with Facebook
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-md text-black">
            <FaXTwitter className="mr-2" /> Continue with X
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          Not a member yet?{" "}
          <span
            className="text-green-700 cursor-pointer"
            onClick={() => {
              setSignUpModal(true);
              setLogInModal(false);
            }}
          >
            Register now
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
