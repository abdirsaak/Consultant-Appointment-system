import React, { useEffect, useState } from 'react';
import { MdEdit, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import user_profile from '../../assets/images/user_profile.jpg';

function Teacher_profile() {
  const [teachers, setTeachers] = useState([]);
  const [modal, setModal] = useState({ type: null, open: false });
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      const teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(`http://localhost:5555/display-teachers/${teacher_id}`);
      const data = await response.json();
      if (data) setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const Logout = () => {
    window.localStorage.clear();
    navigate('/login');
  };

  const update_teacherUsername = async (oldName, newName) => {
    try {
      const teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(`http://localhost:5555/update-teacher-name/${teacher_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_teacher_name: oldName, teacher_name: newName }),
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Username updated");
        setModal({ type: null, open: false });
        fetchTeachers();
      } else toast.error(data.message || "Update failed");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const update_teacherEmail = async (oldEmail, newEmail) => {
    try {
      const teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(`http://localhost:5555/update-teacher-email/${teacher_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_email: oldEmail, email: newEmail }),
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Email updated");
        setModal({ type: null, open: false });
        fetchTeachers();
      } else toast.error(data.message || "Update failed");
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const update_teacher_password = async (oldPassword, newPassword) => {
    try {
      const teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(`http://localhost:5555/update-teacher-password/${teacher_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Password updated");
        setModal({ type: null, open: false });
      } else toast.error(data.message || "Update failed");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const update_teacher_sex = async (newSex) => {
    try {
      const teacher_id = window.localStorage.getItem("teacher_id");
      const response = await fetch(`http://localhost:5555/update-gender/${teacher_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_gender: newSex }),
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Gender updated");
        setModal({ type: null, open: false });
        fetchTeachers();
      } else toast.error(data.message || "Update failed");
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };

  const renderModal = () => {
    switch (modal.type) {
      case "username":
        return (
          <Modal title="Update Username" onClose={() => setModal({ type: null, open: false })}
            onSubmit={(e) => {
              e.preventDefault();
              update_teacherUsername(e.target.oldName.value, e.target.newName.value);
            }}
            fields={[
              { name: "oldName", placeholder: "Old Username" },
              { name: "newName", placeholder: "New Username" },
            ]}
          />
        );
      case "email":
        return (
          <Modal title="Update Email" onClose={() => setModal({ type: null, open: false })}
            onSubmit={(e) => {
              e.preventDefault();
              update_teacherEmail(e.target.oldEmail.value, e.target.newEmail.value);
            }}
            fields={[
              { name: "oldEmail", placeholder: "Old Email" },
              { name: "newEmail", placeholder: "New Email" },
            ]}
          />
        );
      case "password":
        return (
          <Modal title="Update Password" onClose={() => setModal({ type: null, open: false })}
            onSubmit={(e) => {
              e.preventDefault();
              update_teacher_password(e.target.oldPassword.value, e.target.newPassword.value);
            }}
            fields={[
              { name: "oldPassword", placeholder: "Old Password" },
              { name: "newPassword", placeholder: "New Password" },
            ]}
          />
        );
      case "sex":
        return (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
            
            <div className="bg-white p-4 rounded-md w-[300px] lg:w-[400px]">
              <div className='mb-10 cursor-pointer' onClick={() => setModal({ type: null, open: false })}>
                <span className='float-right'><MdClose /></span>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                update_teacher_sex(e.target.newSex.value);
              }} className="flex flex-col">
                <select name="newSex" className="border-2 w-full h-[50px] mb-4">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <button type="submit" className="bg-[#00ABE4] text-white rounded-md h-[48px]">Update</button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <section className="min-h-screen pb-10 form lg:m-10 bg-[#E9F1FA] w-auto lg:w-4/5 lg:mr-44 p-10">
        <div>
          {teachers.map((teacher) => (
            <div key={teacher.id}>
               <div className="flex justify-center ">
          <div className="flex flex-col justify-center">
            <img className='w-[200px] h-[200px] rounded-full ' src={user_profile} alt="user_profile" />
          <h1 className='text-[30px] font-bold text-center'>{teacher.name}</h1>
          </div>
        </div>
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{teacher.name}</h3>
                <span className="cursor-pointer" onClick={() => setModal({ type: "username", open: true })}><MdEdit /></span>
              </div>
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{teacher.email}</h3>
                <span className="cursor-pointer" onClick={() => setModal({ type: "email", open: true })}><MdEdit /></span>
              </div>
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>••••••••</h3>
                <span className="cursor-pointer" onClick={() => setModal({ type: "password", open: true })}><MdEdit /></span>
              </div>
              <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
                <h3>{teacher.sex}</h3>
                <span className="cursor-pointer" onClick={() => setModal({ type: "sex", open: true })}><MdEdit /></span>
              </div>
            </div>
          ))}
          <button className='bg-[#00ABE4] w-[150px] h-[48px] text-white rounded-md mt-10' onClick={Logout}>
            Ka bax
          </button>
        </div>
      </section>

      {modal.open && renderModal()}
    </>
  );
}

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

export default Teacher_profile;
