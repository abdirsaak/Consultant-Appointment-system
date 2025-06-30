import React, { useEffect, useLayoutEffect, useState } from 'react'

import toast from "react-hot-toast";
function CheckSchedule() {
    const [teacherNames, setTeacherNames] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teacherSchedule, setTeacherSchedule] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
 
    // ........ teacher names
    const fetchteacherNames = async () => {
      try {
        const response = await fetch(  "http://localhost:5555/get-teacher-names" );

        const data = await response.json();
        console.log("teacher Names:", data);
        if (data) {
            setTeacherNames(data.data);
            if (data.data.length > 0) {
              setSelectedTeacher(data.data[0].teacher_name);
            }
        } else {
          console.log("Failed to get teacher names");
        }
      } catch (error) {
        console.error("Error fetching teacher names", error);
      }
    };
    useEffect(() => {
        fetchteacherNames();
    }, []);


    // ................ teacher shcedule

     const fetchTeacherSchedule = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5555/teacher-schedule-by-name/${selectedTeacher}`);

        const data = await response.json();
        setIsLoading(false);
        console.log("teacher Names:", data);
        if (data && data.data && data.data.length > 0) {
            // Extract teacher_id from the first schedule
            const teacherId = data.data[0].teacher_id;
      
            // Include teacher_id in each schedule
            const schedulesWithTeacherId = data.data.map(schedule => ({
              ...schedule,
              teacher_id: teacherId,
            }))
    
            setTeacherSchedule(schedulesWithTeacherId);
          } 
        else if(data.status === "fail"){
                toast.error("un get schedu")
        }
        else {
          console.log("Failed to get teacher schedules");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching teacher schedules", error);
      }
    };

    const handleTeacherChange = (event) => {
        setSelectedTeacher(event.target.value);
      };
    
      const handleCheckSchedule = (event) => {
        event.preventDefault();
        fetchTeacherSchedule();
      };

    //   ............. Book schedule
    const openModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setSelectedAppointment(null);
        setIsModalOpen(false);
      };
    const handleConfirmBooking = async () => {
        try {
            let student_id = window.localStorage.getItem("student_id")
            console.log("schedule id: ", selectedAppointment.schedule_id)
            console.log("teacher id: ", selectedAppointment.teacher_id)
            console.log("student id: ", student_id)
            if (selectedAppointment && selectedAppointment.status === "booked") {
                toast.error('This schedule has already been booked by another student.');
                closeModal();
                return;
              }
          const response = await fetch(
            `http://localhost:5555/create-appointment/${selectedAppointment.schedule_id}/${selectedAppointment.teacher_id}/${student_id}`,
            {
              method: 'POST',
            }
          );
    
          const data = await response.json();
    
          if (data.status == "success") {
            console.log('Appointment created successfully:', data.data);
            toast.success('si saxan ayad u qabsatay Balanta. ');
            closeModal();
          }
          else if (data.status == "taked"){
            toast.error('jadwalkani ardey ayaa horey u qabsaday!');
            closeModal();
          }
           else {
            console.error('Error creating appointment:', data);
            toast.error('qalad ayaa dhacay, markale ku celi.');
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          toast.error('An error occurred. Please try again later.');
        }
      };
    
  return (
    <>
    <section>
    <div class="check">
            <div class="flex justify-center items-center">
                <div class="flex flex-col">
                    {/* <h1 class="text-2xl text-gray-700">Check schedule by teacher</h1> */}
                    <p class="text-gray-500 pt-4">Halkan ayad ka eegi kartaa macalimiinta</p>
                </div>
            </div>

            <div class="flex justify-center items-center mt-6">
                <form className='flex' action="" onSubmit={handleCheckSchedule}>

             
                <div class="select">
                    <select class="border-2 border-gray-100 pl-4 outline-none 
                    lg:w-[300px] w-[150px] h-[40px] cursor-pointer" 
                    onChange={handleTeacherChange}
                    value={selectedTeacher}
                    name="" id="">
                    {Array.isArray(teacherNames) &&
              teacherNames.length > 0 &&
              teacherNames.map((teacherName) => (

                   
                             <option  key={teacherName.teacher_id} value={teacherName.teacher_name}>{teacherName.teacher_name}</option>

                        ))}
                    
                    {teacherNames.length === 0 && (
                                <option>Empty teacher</option>
                              )}

                    </select>
                </div>
                <div class="btn">
                    <button  class="bg-blue-400 text-white w-[150px] h-[40px]  ml-4 ">Check Now</button>
                </div>
                </form>
            </div>

        </div>
        {/* <!-- ...... table --> */}
        <div class="relative overflow-x-auto mt-10 flex justify-center">
            <table class="w-2/3 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class=" hidden">
                            teacher id
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Schedule id
                        </th>
                        <th scope="col" class="px-6 py-3">
                             teacher name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            From time
                        </th>
                        <th scope="col" class="px-6 py-3">
                            To time
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Day
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Review
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                {Array.isArray(teacherSchedule) && teacherSchedule.length > 0 ? (
                teacherSchedule.map((schedule) => (
                  <tr key={schedule.schedule_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    {/* Adjust the key and data accordingly */}
                    <td scope="row" className="hidden">
                      {schedule.teacher_id}
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {schedule.schedule_id}
                    </th>
                    <td className='px-6 py-4'>{schedule.teacher_name}</td>
                    <td className="px-6 py-4">{schedule.from_time}</td>
                    <td className="px-6 py-4">{schedule.to_time}</td>
                    <td className="px-6 py-4">{schedule.schedule_day}</td>
                    <td className="px-6 py-4">{schedule.review}</td>
                    <td>
                      <button className="bg-green-400 text-white w-[100px] h-[40px]"
                        onClick={() => openModal(schedule)}
                      >Book Now</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                  {Array.isArray(teacherSchedule) ? 'macalin ma dooranin,dooro macalin .' : 'Empty Schedule.'}
                  </td>
                </tr>
              )}
                 
                </tbody>
              
            </table>
         
          
        </div>
        {isModalOpen && (
        <div className="custom-modal flex justify-center  relative">
          <div className="
          modal-content bg-white
           shadow-lg w-[350px] h-[190px] 
           absolute -top-40 left-[300px]
           p-10
           ">
           
            <p className='font-bold text-[16px]'>Ma rabtaa inad Balan ka qabsatid jadwalkan</p>
          <div className="mt-10">
          <button className='bg-green-400 text-white  w-[100px] h-[40px]' onClick={handleConfirmBooking}>Haa</button>
            <button className='bg-red-400 text-white mx-2 w-[100px] h-[40px]' onClick={closeModal}>Maya</button>
          </div>
          </div>
        </div>
      )}
    </section>
    
    </>
  )
}

export default CheckSchedule
