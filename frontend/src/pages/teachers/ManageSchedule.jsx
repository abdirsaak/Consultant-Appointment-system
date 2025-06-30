import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

function ManageSchedule() {
  const [model, setModel] = useState(false);
  const [updateModel, setUpdateModel] = useState(false);
  const [confirmDeleteModel, setConfirmDeleteModel] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [scheduleDay, setScheduleDay] = useState("");
  const [review, setReview] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const toggleModel = () => {
    setModel(!model);
  };

  const toggleUpdateModel = () => {
    setUpdateModel(!updateModel);
  };

  const closeModel = () => {
    setModel(false);
    setSelectedSchedule(null);
  };

  // .....delete
  const toggleConfirmDeleteModel = (schedule_id) => {
    setScheduleToDelete(schedule_id);
    setConfirmDeleteModel(!confirmDeleteModel);
  };

  const closeConfirmDeleteModel = () => {
    setConfirmDeleteModel(false);
    setScheduleToDelete(null);
  };
  // ............... create schedule

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fromTime || !toTime || !scheduleDay || !review) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      let teacher_id = window.localStorage.getItem("teacher_id");

      const response = await fetch(
        `http://localhost:5555/create-schedule/${teacher_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from_time: fromTime,
            to_time: toTime,
            schedule_day: scheduleDay,
            review: review,
          }),
        }
      );

      if (response.ok) {
        toast.success("Schedule added successfully!");
        setModel(false);
        fetchSchedules(); // Refresh schedules after adding a new one
      } else {
        toast.error("Failed to add schedule. Please try again.");
      }
    } catch (error) {
      console.error("Error adding schedule", error);
    }
  };

  // ............... update schedules
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchedule) {
      return;
    }

    try {
      let teacher_id = window.localStorage.getItem("teacher_id");

      const response = await fetch(
        `http://localhost:5555/update-schedule/${teacher_id}/${selectedSchedule.schedule_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from_time: fromTime,
            to_time: toTime,
            schedule_day: scheduleDay,
            review: review,
          }),
        }
      );

      if (response.ok) {
        toast.success("Schedule updated successfully!");
        setUpdateModel(false);
        fetchSchedules(); // Refresh schedules after updating
      } else {
        toast.error("Failed to update schedule. Please try again.");
      }
    } catch (error) {
      console.error("Error updating schedule", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      let teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(
        `http://localhost:5555/get-all-schedule/${teacher_id}`
      );
      const data = await response.json();
      console.log("Schedules:", data);
      if (data) {
        setSchedules(data.data);
      } else {
        console.log("Failed to get schedules");
      }
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };
  

  // ..... delete schedule
  const deleteSchedule = async () => {
    try {
      let teacher_id = window.localStorage.getItem("teacher_id");

      const response = await fetch(
        `http://localhost:5555/cancel-schedule/${teacher_id}/${scheduleToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacher_id: teacher_id,
            schedule_id: scheduleToDelete,
          }),
        }
      );

      if (response.ok) {
        toast.success("Schedule canceled successfully!");
        closeConfirmDeleteModel();
        fetchSchedules(); // Refresh schedules
      } else {
        toast.error("Failed to cancel schedule. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling schedule", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);


  // ......

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleUpdateClick = (schedule) => {
    setSelectedSchedule(schedule);
    setFromTime(schedule.from_time);
    setToTime(schedule.to_time);
    setScheduleDay(schedule.schedule_day);
    setReview(schedule.review);
    toggleUpdateModel();
  };

  return (
    <>
      <div className="btn flex justify-center items-center">
        <button
          className="bg-[#00ABE4] w-[400px] h-[40px] text-white mt-10"
          onClick={toggleModel}
        >
          Add New Schedule
        </button>
      </div>

{/* .................. add schedule model */}
      {model && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <div className="mb-10 cursor-pointer" onClick={closeModel}>
              <span className="float-right">x</span>
            </div>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <div>
                <input
                  type="time"
                  className="border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black pl-4 outline-emerald-50"
                  placeholder="From Time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="time"
                  className="border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="To Time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="Schedule Day"
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="Review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
              <button
                className="bg-[#00ABE4] w-[290px] lg:w-full md:w-[400px] h-[48px] text-white rounded-md mt-10 text-[16px]"
                type="submit"
              >
                Add Schedule
              </button>
            </form>
          </div>
        </div>
      )}

{/* ........ update schedule model  */}
      {updateModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md lg:w-[500px] w-[340px]">
            <div className="mb-10 cursor-pointer" onClick={toggleUpdateModel}>
              <span className="float-right">x</span>
            </div>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col">
              <div>
                <input
                  type="time"
                  className="border-2 border-gray text-[16px] lg:w-[400px] 
                  w-[240px] h-[50px] my-4 text-black pl-4 outline-emerald-50"
                  placeholder="From Time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="time"
                  className="border-2 border-gray text-[16px] lg:w-[400px] 
                  w-[240px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="To Time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border-2 border-gray text-[16px] lg:w-[400px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="Schedule Day"
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border-2 border-gray text-[16px] lg:w-[400px] h-[50px] my-4 text-black pl-4 outline-none"
                  placeholder="Review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
              <button
                className="bg-[#00ABE4] lg:w-[290px] lg:w-full md:w-[400px] h-[48px] text-white rounded-md mt-10 text-[16px]"
                type="submit"
              >
                Update Schedule
              </button>
            </form>
          </div>
        </div>
      )}

{/* ........... delete schedule model */}
{/* Confirm Delete Model */}
{confirmDeleteModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <div className="mb-10">
              <p>Ma hubta inad delete garenysid schedule-kan?</p>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-red-400 w-[100px] h-[40px] text-white rounded-md"
                onClick={deleteSchedule}
              >
                Haa
              </button>
              <button
                className="bg-green-400 w-[100px] h-[40px] text-white rounded-md"
                onClick={closeConfirmDeleteModel}
              >
                Maya
              </button>
            </div>
          </div>
        </div>
      )}
      {/* .............. view schedule */}

      <div class="max-w-screen-md mx-auto mt-20 overflow-x-auto">
        <table class="min-w-full  bg-white border border-gray-50 divide-y divide-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="py-2 px-4 border-b">Schedule id</th>
              <th class="py-2 px-4 border-b">teacher Name</th>
              <th class="py-2 px-4 border-b">From time</th>
              <th class="py-2 px-4 border-b">To time</th>
              <th class="py-2 px-4 border-b"> Day</th>
              <th class="py-2 px-4 border-b"> Review</th>
              <th class="py-2 px-4 border-b"> Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(schedules) &&
              schedules.length > 0 &&
              schedules.map((schedule) => (
                <tr key={schedule.teacher_id} className="">
                  <td class="py-2 px-4 border-b">{schedule.schedule_id}</td>
                  <td class="py-2 px-4 border-b">{schedule.teacher_name}</td>
                  <td class="py-2 px-4 border-b">{schedule.from_time}</td>
                  <td class="py-2 px-4 border-b">{schedule.to_time}</td>
                  <td class="py-2 px-4 border-b">{schedule.schedule_day}</td>
                  <td class="py-2 px-4 border-b">{schedule.review}</td>
                  <td className="flex gap-3">
                    <button
                      className="bg-green-400 w-[100px] h-[40px] text-white rounded-md"
                      onClick={() => handleUpdateClick(schedule)}
                    >
                      Update
                    </button>
                    <button className="bg-red-400 w-[100px] h-[40px] text-white rounded-md"
                    onClick={() => toggleConfirmDeleteModel(schedule.schedule_id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {schedules.length === 0 && (
          <p className="text-center mt-4">
        wax jadwal ma sameynin  macalinkani
          </p>
        )}
      </div>
    </>
  );
}

export default ManageSchedule;
