import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    gender: 'Male',
  });
   const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('Current State:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      // Validate form data
  if (!formData.username || !formData.password || !formData.email) {
    toast.error("fadlan buuxi meelaha banaan")
    return;
  }

    const requestData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      gender: formData.gender,
    };

    const requestHeader = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };
    


    try {
      // Send registration data to the server
      const response = await axios.post('http://localhost:5555/register', requestData, requestHeader);
      const data = await response.data
      console.log(data)
      if(data.status === "success"){

        toast.success(data.message)
        navigate('/login')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error:', error);
    }
  }

  return (
    <>
      <section className='flex lg:justify-center lg:items-center md:justify-center md:items-center sm:justify-center sm:items-center'>
        <div className='main'>
          <div className='form lg:m-10 bg-[#E9F1FA] w-[440px] lg:w-[800px] md:w-[900px] sm:w-[660px] p-10'>
            <h1 className='md:text-center lg:text-center font-sans font-bold pb-10 sm:text-center'>
              Register here
            </h1>

            
            <form onSubmit={handleSubmit}>
              {/* User Name */}
              <div className='user_name'>
                <input
                  className='w-[290px] lg:w-[350px] border-gray-300 my-4 h-[48px] pl-4 outline-none rounded-md'
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Username ...'
                />
              </div>

              {/* Password and Confirm Password */}
              <div className='flex flex-col lg:flex-row md:flex-row sm:flex-row'>
                <div className='password'>
                  <input
                    className='w-[290px] lg:w-[290px] border-gray-300 my-4 h-[48px] pl-4 outline-none rounded-md'
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Password ...'
                  />
                </div>
               
              </div>

              {/* Email and Gender */}
              <div className='flex flex-col lg:flex-row md:flex-row sm:flex-row'>
                <div className='password'>
                  <input
                    className='w-[290px] lg:w-[290px] border-gray-300 my-4 h-[48px] pl-4 outline-none rounded-md'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email ...'
                  />
                </div>
                <div className='ConfirmPassword lg:ml-4 sm:ml-4'>
                  <select
                    className='w-[290px] lg:w-[350px] border-gray-300 my-4 h-[48px] pl-4 outline-none rounded-md cursor-pointer'
                    name='gender'
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>
                </div>
              </div>

              {/* Button */}
              <button
                className='bg-[#00ABE4] w-[290px] lg:w-[400px] md:w-[400px] h-[48px] text-white mt-10'
                type='submit'
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default RegisterForm;
