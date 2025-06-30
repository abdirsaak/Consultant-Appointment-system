import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ManageTeachers() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "Male",
  });
  //  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Current State:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.username || !formData.password || !formData.email) {
      console.error("Please fill in all required fields.");
      return;
    }

    const requestData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
    };

    const requestHeader = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    try {
      // Send registration data to the server
      const response = await axios.post(
        "http://localhost:5555/register-teacher",
        requestData,
        requestHeader
      );
      const data = await response.data;
      console.log(data);
      if (data.status === "success") {
        toast.success(data.message);
        fetch_teachers();
        // navigate('/login')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error:", error);
    }
  };

  // .............. fetch teachers
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const fetch_teachers = async () => {
      try {
        const response = await fetch("http://localhost:5555/admin-teachers");
        const data = await response.json();
        console.log("waa data value", data);
        if (data) {
          setTeachers(data);
        } else {
          console.log("failed to get teachers");
        }
      } catch (error) {
        console.error("error happend fetching teachers", error);
      }
    };
    fetch_teachers();
  }, []);
  console.log("value of teachers", teachers);


  // ........ delete teacher
  const handleDelete = async (teacherName) => {
    try {
      console.log("teacherName", teacherName)
      const response = await axios.delete(`http://localhost:5555/teacher-delete/${teacherName}`);
      const data = response.data;

      if (data.status === "success") {
        toast.success(data.message);
        fetch_teachers();
       
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };


  return (
    <div>
      <section class="">
        <h2 class="text-center py-4">Add New Teacher</h2>

        <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your name
            </label>
            <input
              type="text"
              id="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="abdirsaq nor osman"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="rasaaq883@gmail.com"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="mb-5">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register
          </button>
        </form>
      </section>

      {/* ...................... display teacher */}
      <div class="max-w-screen-md mx-auto my-32  overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-50 divide-y divide-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="py-2 px-4 border-b">Teacher id</th>
              <th class="py-2 px-4 border-b">Teacher Name</th>
              <th class="py-2 px-4 border-b">Teacher email</th>
              <th class="py-2 px-4 border-b">SEX</th>
              <th>Action</th>
            </tr>
          
          </thead>
         
          <tbody>
            {Array.isArray(teachers) &&
              teachers.length > 0 &&
              teachers.map((teacher) => (
              <tr  key={teacher.id} className="">
                <td class="py-4 px-4 border-b">{teacher.id}</td>
                <td class="py-4 px-4 border-b">{teacher.name}</td>
                <td class="py-4 px-4 border-b">{teacher.email}</td>
                <td class="py-4 px-4 border-b">{teacher.sex}</td>
                <td><button className="bg-red-500 text-white w-[120px] h-[40px] rounded-md" onClick={() => handleDelete(teacher.name)}>delete</button></td>
              </tr>
            ))}
            {/* <!-- Add more rows as needed --> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageTeachers;
