import React, { useEffect, useState } from 'react';
import { MdEdit, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Admin_profile() {
  const [model, setModel] = useState(false);
  const [model2, setModel2] = useState(false);
  const [model3, setModel3] = useState(false);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      let admin_id = window.localStorage.getItem("admin_id");
      const response = await fetch(`http://localhost:5555/display-admins/${admin_id}`);
      const data = await response.json();

      if (data) {
        setAdmins(data);
      } else {
        console.log("error getting admins");
      }
    } catch (error) {
      console.error("error fetching admins", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const Logout = () => {
    window.localStorage.clear();
    navigate('/login');
  };

  const update_admin_username = async (newUsername) => {
    try {
      let admin_id = window.localStorage.getItem("admin_id");
      const response = await fetch(`http://localhost:5555/update-admin-username/${admin_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_name: newUsername })
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success("Updated admin username");
        setModel(false);
        await fetchAdmins();
      } else {
        toast.error(data.message || "Error updating username");
      }
    } catch (error) {
      console.error("error updating username", error);
    }
  };

  const update_admin_email = async (newEmail) => {
    try {
      let admin_id = window.localStorage.getItem("admin_id");
      const response = await fetch(`http://localhost:5555/update-admin-email/${admin_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: newEmail })
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success("Updated admin email");
        setModel2(false);
        await fetchAdmins();
      } else {
        toast.error(data.message || "Error updating email");
      }
    } catch (error) {
      console.error("error updating email", error);
    }
  };

  const update_admin_password = async (oldPassword, newPassword) => {
    try {
      let admin_id = window.localStorage.getItem("admin_id");
      const response = await fetch(`http://localhost:5555/update-admin-password/${admin_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: oldPassword, new_password: newPassword })
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success("Password updated successfully");
        setModel3(false);
        await fetchAdmins();
      } else {
        toast.error(data.message || "Error updating password");
      }
    } catch (error) {
      console.error("error updating password", error);
    }
  };

  return (
    <section className="min-h-screen pb-10 form lg:m-10 bg-[#E9F1FA] w-auto lg:w-4/5 lg:mr-44 p-10">
      <div>
        {admins.map((admin) => (
          <div key={admin.admin_id}>
            <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
              <h3>{admin.admin_name}</h3>
              <span className="cursor-pointer" onClick={() => setModel(true)}><MdEdit /></span>
            </div>

            <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
              <h3>{admin.admin_email}</h3>
              <span className="cursor-pointer" onClick={() => setModel2(true)}><MdEdit /></span>
            </div>

            <div className="content flex mt-4 items-center justify-between max-w-md bg-white p-4 rounded-md">
              <h3>••••••••</h3>
              <span className="cursor-pointer" onClick={() => setModel3(true)}><MdEdit /></span>
            </div>
          </div>
        ))}

        <button className='bg-[#00ABE4] w-[150px] h-[48px] text-white rounded-md mt-10' onClick={Logout}>Ka bax</button>
      </div>

      {/* Modal for Username */}
      {model && <Modal title="Update Username" onClose={() => setModel(false)} onSubmit={(e) => {
        e.preventDefault();
        update_admin_username(e.target.newUsername.value);
      }} fields={[{ name: 'newUsername', placeholder: 'Enter new username' }]} />}

      {/* Modal for Email */}
      {model2 && <Modal title="Update Email" onClose={() => setModel2(false)} onSubmit={(e) => {
        e.preventDefault();
        update_admin_email(e.target.newEmail.value);
      }} fields={[{ name: 'newEmail', placeholder: 'Enter new email' }]} />}

      {/* Modal for Password */}
      {model3 && <Modal title="Update Password" onClose={() => setModel3(false)} onSubmit={(e) => {
        e.preventDefault();
        update_admin_password(e.target.oldPassword.value, e.target.newPassword.value);
      }} fields={[
        { name: 'oldPassword', placeholder: 'Enter old password' },
        { name: 'newPassword', placeholder: 'Enter new password' }
      ]} />}
    </section>
  );
}

function Modal({ title, onClose, onSubmit, fields }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[300px] lg:w-[500px]">
        <div className='mb-10 cursor-pointer' onClick={onClose}><span className='float-right'><MdClose /></span></div>
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

export default Admin_profile;
