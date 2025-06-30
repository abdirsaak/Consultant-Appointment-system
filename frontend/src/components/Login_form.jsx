import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // ✅ Make sure this is installed

function Login_form() {
  const [formData, setFormData] = useState({
    user_type: "student",
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Make this async to await login response
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await login(
      formData.user_type,
      formData.email,
      formData.password
    );

    // if (response?.status === "success") {
    //   toast.success("Login successful");
    // } else if (response?.status === "fail") {
    //   toast.error(response.message || "Email or password wrong");
    // } else {
    //   toast.error("Unexpected error");
    // }

  } catch (error) {
    // Axios throws here for 401, 403, etc.
    const message =
      error?.response?.data?.message || "Server error. Please try again.";
    toast.error(message);
    console.error("Login error:", error);
  }
};


  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="form bg-[#E9F1FA] w-[440px] lg:w-[800px] p-10 rounded">
        <h1 className="text-center font-bold text-xl pb-10">Login here</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            className="w-full max-w-[350px] border border-gray-300 my-2 h-[48px] pl-4 rounded-md"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="User Email..."
          />

          <input
            className="w-full max-w-[350px] border border-gray-300 my-2 h-[48px] pl-4 rounded-md"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password..."
          />

          <select
            onChange={handleChange}
            name="user_type"
            value={formData.user_type}
            className="w-full max-w-[350px] h-[50px] rounded-md text-gray-600 pl-4 my-2"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <button
            className="bg-[#00ABE4] w-full max-w-[350px] h-[48px] text-white mt-6 rounded-md"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login_form;
