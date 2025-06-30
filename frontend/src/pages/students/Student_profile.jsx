import React, { useEffect, useState } from 'react';
import { MdEdit, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Student_profile() {
  const [model, setModel] = useState(false);
  const [model2, setModel2] = useState(false);
  const [model3, setModel3] = useState(false);
  const [model4, setModel4] = useState(false);

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  // ✅ Moved to top level so all functions can access it
  const fetchStudents = async () => {
    try {
      let student_id = window.localStorage.getItem("student_id");
      const response = await fetch(`http://localhost:5555/display-students/${student_id}`);
      const data = await response.json();

      if (data) {
        setStudents(data.data);
      } else {
        console.log("error getting students");
      }
    } catch (error) {
      console.error("error fetching students", error.message);
    }
  };

  // ✅ Called once when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  const Logout = () => {
    console.log("logout");
    window.localStorage.clear();
    navigate('/login');
  };

  const update_studentUsername = async (oldName, newName) => {
    try {
      let student_id = window.localStorage.getItem("student_id");
      const response = await fetch(`http://localhost:5555/update-username/${student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_username: oldName, username: newName }),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast.success("si saxan ayad u badashay magacaaga");
        setModel(false);
        await fetchStudents(); // ✅ Refresh after update
      } else {
        toast.error(data.message || "Qalad ayaa dhacay");
      }
    } catch (error) {
      console.error("error updating username", error);
    }
  };

  const update_UserEmail = async (oldEmail, newEmail) => {
    try {
      let student_id = window.localStorage.getItem("student_id");
      const response = await fetch(`http://localhost:5555/update-user-email/${student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_email: oldEmail, email: newEmail }),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast.success("si saxan ayad u badashay email");
        setModel2(false);
        await fetchStudents();
      } else {
        toast.error(data.message || "Qalad ayaa dhacay");
      }
    } catch (error) {
      console.error("error updating email", error);
    }
  };

  const update_student_password = async (oldPassword, newPassword) => {
    try {
      let student_id = window.localStorage.getItem("student_id");
      const response = await fetch(`http://localhost:5555/update-user-password/${student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast.success("password updated successfully");
        setModel3(false);
      } else {
        toast.error(data.message || "Qalad ayaa dhacay");
      }
    } catch (error) {
      console.error("error updating password", error);
    }
  };

  const update_student_sex = async (newSex) => {
    try {
      let student_id = window.localStorage.getItem("student_id");
      const response = await fetch(`http://localhost:5555/update-student-gender/${student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_gender: newSex }),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast.success("gender updated successfully");
        setModel4(false);
        await fetchStudents();
      } else {
        toast.error(data.message || "Qalad ayaa dhacay");
      }
    } catch (error) {
      console.error("error updating gender", error);
    }
  };

  return (
    <>
      <section className="min-h-screen pb-10 form lg:m-10 bg-[#E9F1FA] w-auto lg:w-4/5 lg:mr-44 p-10">
        <div>
          {students.map((student) => (
            <div key={student.id}>
              {/* Username */}
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{student.name}</h3>
                <span className="cursor-pointer" onClick={() => setModel(true)}><MdEdit /></span>
              </div>

              {/* Email */}
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{student.email}</h3>
                <span className="cursor-pointer" onClick={() => setModel2(true)}><MdEdit /></span>
              </div>

              {/* Password */}
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>••••••••</h3>
                <span className="cursor-pointer" onClick={() => setModel3(true)}><MdEdit /></span>
              </div>

              {/* Gender */}
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{student.sex}</h3>
                <span className="cursor-pointer" onClick={() => setModel4(true)}><MdEdit /></span>
              </div>
            </div>
          ))}

          {/* Logout */}
          <button className='bg-[#00ABE4] w-[150px] h-[48px] text-white rounded-md mt-10' onClick={Logout}>
            Ka bax
          </button>
        </div>
      </section>

      {/* Username Modal */}
      {model && (
        <Modal title="Update Username" onClose={() => setModel(false)} onSubmit={(e) => {
          e.preventDefault();
          update_studentUsername(e.target.oldName.value, e.target.newName.value);
        }} fields={[
          { name: "oldName", placeholder: "Enter old username" },
          { name: "newName", placeholder: "Enter new username" },
        ]} />
      )}

      {/* Email Modal */}
      {model2 && (
        <Modal title="Update Email" onClose={() => setModel2(false)} onSubmit={(e) => {
          e.preventDefault();
          update_UserEmail(e.target.oldEmail.value, e.target.newEmail.value);
        }} fields={[
          { name: "oldEmail", placeholder: "Enter old email" },
          { name: "newEmail", placeholder: "Enter new email" },
        ]} />
      )}

      {/* Password Modal */}
      {model3 && (
        <Modal title="Update Password" onClose={() => setModel3(false)} onSubmit={(e) => {
          e.preventDefault();
          update_student_password(e.target.oldPassword.value, e.target.newPassword.value);
        }} fields={[
          { name: "oldPassword", placeholder: "Enter old password" },
          { name: "newPassword", placeholder: "Enter new password" },
        ]} />
      )}

      {/* Gender Modal */}
      {model4 && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-[300px] lg:w-[400px]">
            <div className='mb-10 cursor-pointer' onClick={() => setModel4(false)}>
              <span className='float-right'><MdClose /></span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              update_student_sex(e.target.newSex.value);
            }} className="flex flex-col">
              <select name="newSex" className="border-2 w-full h-[50px] mb-4">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <button type="submit" className="bg-[#00ABE4] text-white rounded-md h-[48px]">Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable Modal component
function Modal({ title, onClose, onSubmit, fields }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[300px] lg:w-[500px]">
        <div className='mb-10 cursor-pointer' onClick={onClose}>
          <span className='float-right'><MdClose /></span>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col">
          {fields.map((field, i) => (
            <input
              key={i}
              name={field.name}
              placeholder={field.placeholder}
              className="border-2 border-gray my-2 h-[50px] px-4"
              required
            />
          ))}
          <button type="submit" className="bg-[#00ABE4] text-white rounded-md mt-6 h-[48px]">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Student_profile;
