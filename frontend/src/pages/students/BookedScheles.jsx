import React, { useState, useEffect } from "react";


function BookedScheles() {
  
const [bookekAppointments, setBookekAppointment] = useState([]);
const [showCancelModal, setShowCancelModal] = useState(false);
const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
const [teacherId, setTeacherId] = useState(null);
const [userId, setUserId] = useState(null);
const [scheduleId, setScheduleId] = useState(null);
const fetchBookedAppointments = async () => {
  try {
    let student_id = window.localStorage.getItem("student_id")
    const response = await fetch(
      `http://localhost:5555/user-appointment/${student_id}`
    );
    const data = await response.json();
    console.log("booked Schedules:", data);
    if (data) {
      setBookekAppointment(data.data);
    } else {
      console.log("Failed to get booked appointments");
    }
  } catch (error) {
    console.error("Error fetching booked appointment", error);
  }
};
useEffect(() => {
  fetchBookedAppointments();
}, []);
const formatAppointmentDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString(); // Adjust the format as needed
};

const handleCancel = (teacherId, scheduleId) => {
  setTeacherId(teacherId);

  setScheduleId(scheduleId);
  setShowCancelModal(true);
};

const confirmCancel = async () => {
  try {
    console.log("teacher id", teacherId)
    console.log("scheduleId id", scheduleId)
    
    const userId = window.localStorage.getItem("student_id")
    console.log("userId id", userId)

    const response = await fetch(

      `http://localhost:5555/cancel-user-appointment/${teacherId}/${userId}/${scheduleId}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      // Refresh the booked appointments after successful cancellation
      fetchBookedAppointments();
    } else {
      console.log("Failed to cancel appointment");
    }
  } catch (error) {
    console.error("Error cancelling appointment", error);
  } finally {
    // Hide the modal after the request is complete
    setShowCancelModal(false);
  }
};

const closeModal = () => {
  // Close the modal without canceling the appointment
  setShowCancelModal(false);
};


  return (
    <>
     <div>
       <div class="max-w-screen-lg mx-auto mt-20 overflow-x-auto">
        <table class="min-w-full  bg-white border border-gray-50 divide-y divide-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="py-2 px-4 border-b">Appointment id</th>
              <th className="py-2 px-4 border-b hidden" >teacher id</th>
              <th className="py-2 px-4 border-b hidden" >schedule id</th>
              <th class="py-2 px-4 border-b">Appointment Date</th>
          
              <th class="py-2 px-4 border-b">Teacher Name</th>
              <th class="py-2 px-4 border-b">FROM time</th>
              <th class="py-2 px-4 border-b">To time</th>
              <th class="py-2 px-4 border-b"> Day</th>
              <th class="py-2 px-4 border-b"> Review</th>
              <th class="py-2 px-4 border-b"> Action</th>
            
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookekAppointments) &&
              bookekAppointments.length > 0 &&
              bookekAppointments.map((BookAppointment) => (
                <tr key={BookAppointment.appointment_id} className="">

                  <td class="py-2 px-4 border-b">{BookAppointment.appointment_id}</td>
                  <td class="py-2 px-4 border-b">{formatAppointmentDate(BookAppointment.appointment_date)}</td>
                  <td className="py-2 px-4 border-b hidden">{BookAppointment.teacher__id}</td>
                  <td className="py-2 px-4 border-b hidden">{BookAppointment.schedule__id}</td>
                  <td class="py-2 px-4 border-b">{BookAppointment.teacher_name}</td>
                  
                  <td class="py-2 px-4 border-b">{BookAppointment.from_time}</td>
                  <td class="py-2 px-4 border-b">{BookAppointment.to_time}</td>
                  <td class="py-2 px-4 border-b">{BookAppointment.schedule_day}</td>
                  <td class="py-2 px-4 border-b">{BookAppointment.review}</td>
                  <td className="py-2 px-4 border-b  ">
                <button className="bg-red-400 text-white h-[40px] w-[100px] rounded-md" onClick={() => handleCancel(BookAppointment.teacher__id, BookAppointment.schedule__id)}> Cancel </button>
              </td>
                 
                </tr>
              ))}
          </tbody>
        </table>
        {bookekAppointments.length === 0 && (
          <p className="text-center mt-4">
         Areydagani wax balan malahan
          </p>
        )}
      </div>
    </div>


{/* Modal */}
{showCancelModal && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Your icon or image for confirmation */}
                    🚫
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                     Kalaabasho
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        marabta inad kalaabatid balantani
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmCancel}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                 Haa
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Maya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
    
    </>
  )
}

export default BookedScheles
