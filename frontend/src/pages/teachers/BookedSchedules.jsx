import React, { useState, useEffect } from "react";

function BookedSchedules() {
  const [bookedSchedules, setBookedschedule] = useState([]);
 

  const fetchBookedSchedules = async () => {
    try {
      let teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(
        `http://localhost:5555/teacher-appointment/${teacher_id}`
      );
      const data = await response.json();
      console.log("booked Schedules:", data);
      if (data) {
        setBookedschedule(data.data);
      } else {
        console.log("Failed to get nooked schedules");
      }
    } catch (error) {
      console.error("Error fetching booked schedules", error);
    }
  };
  useEffect(() => {
    fetchBookedSchedules();
  }, []);
  const formatAppointmentDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString(); // Adjust the format as needed
  };
  

  return (
    <div>
       <div class="max-w-screen-md mx-auto mt-20 overflow-x-auto">
        <table class="min-w-full  bg-white border border-gray-50 divide-y divide-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="py-2 px-4 border-b">Appointment id</th>
              <th class="py-2 px-4 border-b">Schedule id</th>
              <th class="py-2 px-4 border-b">Student Name</th>
              <th class="py-2 px-4 border-b">Appointment Date</th>
              <th class="py-2 px-4 border-b">FROM time</th>
              <th class="py-2 px-4 border-b">To time</th>
              <th class="py-2 px-4 border-b"> Day</th>
              <th class="py-2 px-4 border-b"> Review</th>
            
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookedSchedules) &&
              bookedSchedules.length > 0 &&
              bookedSchedules.map((BookSchedule) => (
                <tr key={BookSchedule.scheduled_id} className="">
                  <td class="py-2 px-4 border-b">{BookSchedule.appointment_id}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.scheduled_id}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.student_name}</td>
                  <td class="py-2 px-4 border-b">{formatAppointmentDate(BookSchedule.appointment_date)}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.from_time}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.to_time}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.schedule_day}</td>
                  <td class="py-2 px-4 border-b">{BookSchedule.schedule_review}</td>
                 
                </tr>
              ))}
          </tbody>
        </table>
        {bookedSchedules.length === 0 && (
          <p className="text-center mt-4">
           wax balan u taalo ma jirto macalinkani
          </p>
        )}
      </div>
    </div>
  )
}

export default BookedSchedules
