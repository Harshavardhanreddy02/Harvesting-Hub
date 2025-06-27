import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/actions/userActions";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user data from both localStorage and Redux
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Dispatch actions to clear state
    dispatch({ type: "CLEAR_TOKEN" });
    dispatch(clearUser());

    // Redirect to home page
    navigate("/");
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;