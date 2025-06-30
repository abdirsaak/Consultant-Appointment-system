
import React, { useState, useEffect } from "react";
function Dashboard() {
   // ......... total  schedules
   const [Total_schedules, setTotal_schedules] = useState([]);
   useEffect(() => {
     const fetch_total_schedules = async () => {
       try {
        let teacher_id = window.localStorage.getItem("teacher_id")
         const response = await fetch(`http://localhost:5555/total-schedules/${teacher_id}`);
         const data = await response.json();
         console.log("waa data value total scheudle", data);
         if (data) {
          setTotal_schedules(data.data);
         } else {
           console.log("failed to get teachers");
         }
       } catch (error) {
         console.error("error happend fetching teachers", error);
       }
     };
     fetch_total_schedules();
   }, []);
   // ......... total  Booked schedules
   const [Total_schedule_booked, setTotal_schedul_booked] = useState([]);
   useEffect(() => {
     const fetch_total_schedule_booked = async () => {
       try {
        let teacher_id = window.localStorage.getItem("teacher_id")
         const response = await fetch(`http://localhost:5555/total-appoinments/${teacher_id}`);
         const data = await response.json();
         console.log("waa data value total scheudle", data);
         if (data) {
          setTotal_schedul_booked(data.data);
         } else {
           console.log("failed to get teachers");
         }
       } catch (error) {
         console.error("error happend fetching teachers", error);
       }
     };
     fetch_total_schedule_booked();
   }, []);
 
  return (
    <div className='bg-gray-50 w-auto h-screen m-4'>
      <div className="main_sec flex lg:mx-20 mt-20">
        {/* ....... card1  */}
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center">
          <h2>Wadarta Balanta</h2>
          <h1 className='font-bold  pt-4'>{Total_schedule_booked}</h1>
        </div>
        {/* . card 2 */}
        <div className="card1 bg-white shadow-md w-[200px] h-[200px] 
        flex flex-col justify-center items-center ml-20">
          <h2>Wadarta Jadwalka</h2>
          <h1 className='font-bold  pt-4'>{Total_schedules}</h1>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
