import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginInFailure, loginInStart, loginInSuccess } from "./redux/user/userSlice";
import { storeContext } from "./redux/context/storeContext";
import OAuth from "../components/OAuth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import loginBg from "../../assets/signbg.jpg";

export const Login = () => {
  const [formData, setFormData] = useState({});
  const { setToken } = useContext(storeContext);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    dispatch(loginInStart());
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
      console.log('Login Response:', res.data);
      
      if (!res.data.success) {
        const errorMessage = res.data.message || "Login failed";
        dispatch(loginInFailure(errorMessage));
        toast.error(errorMessage);
        return;
      }
      
      const { user, token } = res.data;
      if (!user || !token) {
        dispatch(loginInFailure("Invalid server response"));
        toast.error("Invalid server response");
        return;
      }
      
      // Store token and user info
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
      
      dispatch(loginInSuccess(user));
      setToken(token);
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect all other users (including farmers) to landing page
      }
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      dispatch(loginInFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-no-repeat"
      style={{
        minHeight: "89vh",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-40 backdrop-blur-md shadow-2xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
        <h1 className="text-4xl text-center font-bold text-purple-700 mb-6">Login</h1>

        <form onSubmit={submitForm} className="flex flex-col gap-5">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full pl-10 p-3 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-md transition-all duration-200"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-10 p-3 border-2 border-pink-400 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none shadow-md transition-all duration-200"
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg uppercase font-bold hover:shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <OAuth />
        </form>
        <div className="flex justify-center items-center mt-5">
          <p className="text-gray-600">Do not have an account?</p>
          <Link to="/Signup">
            <span className="text-blue-600 font-bold ml-2 hover:underline">Sign up</span>
          </Link>
        </div>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};
