import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";



function Dashboard() {
  // ............. total male eusers
  const [Total_male_users, setTotalMaleUsers] = useState([]);
  useEffect(() => {
    const fetch_total_male_users = async () => {
      try {
        const response = await fetch("http://localhost:5555/total-male-users");
        const data = await response.json();
        console.log("waa data value", data);
        if (data) {
          setTotalMaleUsers(data);
        } else {
          console.log("failed to get teachers");
        }
      } catch (error) {
        console.error("error happend fetching teachers", error);
      }
    };
    fetch_total_male_users();
  }, []);
  // ............. total male eusers
  const [Total_female_users, setTotalFemaleUsers] = useState([]);
  useEffect(() => {
    const fetch_total_female_users = async () => {
      try {
        const response = await fetch("http://localhost:5555/total-female-users");
        const data = await response.json();
        console.log("waa data value", data);
        if (data) {
          setTotalFemaleUsers(data);
        } else {
          console.log("failed to get teachers");
        }
      } catch (error) {
        console.error("error happend fetching teachers", error);
      }
    };
    fetch_total_female_users();
  }, []);
  // ......... total male teacher
  const [Total_male_teachers, setTotalMaleTeachers] = useState([]);
  useEffect(() => {
    const fetch_total_male_teacher = async () => {
      try {
        const response = await fetch("http://localhost:5555/total-male-teacher");
        const data = await response.json();
        console.log("waa data value", data);
        if (data) {
          setTotalMaleTeachers(data);
        } else {
          console.log("failed to get teachers");
        }
      } catch (error) {
        console.error("error happend fetching teachers", error);
      }
    };
    fetch_total_male_teacher();
  }, []);
  // ......... total female teacher
  const [Total_female_teachers, setTotalFemaleTeachers] = useState([]);
  useEffect(() => {
    const fetch_total_female_teacher = async () => {
      try {
        const response = await fetch("http://localhost:5555/total-female-teacher");
        const data = await response.json();
        console.log("waa data value", data);
        if (data) {
          setTotalFemaleTeachers(data);
        } else {
          console.log("failed to get teachers");
        }
      } catch (error) {
        console.error("error happend fetching teachers", error);
      }
    };
    fetch_total_female_teacher();
  }, []);

  return (
    <div>
      <div className='bg-gray-50 w-auto h-screen mb-32'>
      <div className="main_sec flex mx-20 mt-20 gap-10 flex-wrap">
        {/* ....... card1  */}
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center">
          <h2>Total students</h2>
          <h1 className='font-bold  pt-4'>{Total_male_users}</h1>
          <h2>Male</h2>
        </div>
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center">
          <h2>Total students</h2>
          <h1 className='font-bold  pt-4'>{Total_female_users}</h1>
          <h2>female</h2>
        </div>
        {/* . card 2 */}
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center ">
          <h2>Total teachers</h2>
          <h1 className='font-bold  pt-4'>{Total_male_teachers}</h1>
          <h2>Male</h2>
        </div>
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center">
          <h2>Total teachers</h2>
          <h1 className='font-bold  pt-4'>{Total_female_teachers}</h1>
          <h2>female</h2>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Dashboard
