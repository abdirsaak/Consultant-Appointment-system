import { Route, Routes } from "react-router-dom";
import "./App.css";

import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Header from "./components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import AdminDashboard from './pages/admin/Dashboard'
import ManageTeachers from './pages/admin/ManageTeachers'

import TeacherDashboard from './pages/teachers/Dashboard'
import ManageShedules from './pages/teachers/ManageSchedule'
import Bookedschedules from './pages/teachers/BookedSchedules'
import Teacher_profile from './pages/teachers/Teacher_profile'

import ChechSchedules from './pages/students/CheckSchedule'
import BookedLists from './pages/students/BookedScheles'
import Student_profile from './pages/students/Student_profile'
import Home from "./pages/Home";
import Admin_profile from "./pages/admin/Admin_profile";
function App() {
  const isLogin = window.localStorage.getItem("isLogin");
  const user_type = window.localStorage.getItem("user_type")

  const navigate = useNavigate();

  useEffect(() => {
    console.log("inside app.jsx", isLogin);
    const isRegisterPath = window.location.pathname !== "/register";
    if (!isLogin && isRegisterPath) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <>
      {/*.........................   pages */}
      <Toaster />
      <Header />
      <Routes>
        {/* ..... register and login are public  */}
    
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* ......... every userType can made login,can see profile */}
        {/* <Route path="/profile" element={<Profile />} /> */}

        {/* ......... only admin can create  */}
        {isLogin && user_type === "admin" &&(
          <>
        <Route path="/Admin-Dashboard" element = {<AdminDashboard />} ></Route>
        <Route path="/manage-teacher" element = {<ManageTeachers  />} ></Route>
        <Route path="/admin-profile" element  = {<Admin_profile/>}></Route>
          </>
        )}
      {/*  ............ only teachers */}

      {isLogin && user_type === "teacher" &&(
        <>
        
        <Route path="/Teaceher-Dashboard"  element = {<TeacherDashboard />} ></Route>
        <Route path="/Manage-schedule"  element = {<ManageShedules />} ></Route>
        <Route path="/Booked-schedules"  element = {<Bookedschedules />} ></Route>
        <Route path="/teacher-profile" element ={<Teacher_profile />}></Route>
        </>
      )}



        {/* ......... only students */}


        {isLogin && user_type === "student" &&(

       <>
        <Route path="/" element={<Home />} />
        <Route path="/Check-schedule" element = {<ChechSchedules />} ></Route>
        <Route path="/Booked-list" element = {<BookedLists />} ></Route>
        <Route path="/student-profile" element = {<Student_profile />}></Route>
       </>
        )}




      
      
      </Routes>

      
      <Footer />
    </>
  );
}

export default App;
