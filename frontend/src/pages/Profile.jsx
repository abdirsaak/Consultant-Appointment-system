import React from 'react'
import { MdEdit, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
function Profile() {
  const [model, SetModel] =  useState(false)

  const toggleModel = () => {
    // alert("clicked")
    SetModel(!model)
  }
  const close_model = () =>{
    SetModel(!model)
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // ...
    closeModel(); // Close the modal after form submission
  };

  const naviagte = useNavigate()
  const Logout = () => {

    console.log("your logut")
    window.localStorage.clear('isLogin')
    naviagte('/login')
  }
  return (
    <div>
      <div className="ml-10 mt-4 mb-2" ><h1 className="font-bold text-3xl text-gray-600">welcome to Profile</h1></div>

      <section>
        <div className="h-[92vh] lg:h-[76vh] pb-10 mb-20 form lg:m-10 bg-[#E9F1FA] w-auto lg:w-4/5 lg:mr-44 md:w-[900px] sm:w-[660px] p-10">
            {/* .......... image and logut button flex */}
            <div className="flex justify-between">
                <div className="image bg-white rounded-full w-[200px] 
                h-[200px] flex justify-center items-center">
                    image
                </div>

                <div className="logut hidden lg:block">
                    <button className='bg-[#00ABE4] w-[290px] lg:w-[150px] md:w-[400px] h-[48px] text-white rounded-md mt-10'  
                    onClick={Logout}>Logout</button>
                </div>

            </div>

                {/* .....             username */}
                <div className="content flex mt-4 items-center justify-between w-[300px] lg:w-[400px] bg-white p-4 rounded-md">
                    <div className="name"><h3>Abdirsaq Nor Osman</h3></div>
                    <div className="name cursor-pointer"><span onClick={toggleModel}><MdEdit /></span></div>
                </div>

                {/* .................... username edit model pop up */}
                {model && (
                <div
                
                className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center"
                  onClick={close_model}
                >
                  <div className="bg-white p-4 rounded-md">
                    {/* Add your modal content here */}
                          <div className='mb-10 cursor-pointer' onClick={close_model}> <span className='float-right'><MdClose /></span>
                          </div>
                      <form  onSubmit={handleFormSubmit} action="" className='flex flex-col'>
                        <div>

                        <input type  = "text" className='border-2  border-gray text-[16px] w-[400px] h-[50px] my-4 text-black 
                        pl-4 outline-emerald-50' placeholder='enter old username'  
                         onClick={(e) => e.stopPropagation()}/>
                        </div>
                        <div>
                        <input type  = "text" className='border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black
                         pl-4 outline-none' placeholder='enter New username'
                         onClick={(e) => e.stopPropagation()} />
                        </div>
                       
                        <button className='bg-[#00ABE4] w-[290px] 
                        lg:w-full  md:w-[400px] h-[48px]
                     text-white rounded-md mt-10 text-[16px]'>Update</button>
                      </form>
                    
                    
                  </div>
                </div>
              )}



                {/* .....             email */}
                <div className="content flex mt-4 items-center justify-between w-[300px] lg:w-[400px] bg-white p-4 rounded-md">
                    <div className="name"><h3>osman@gmail.com</h3></div>
                    <div className="name cursor-pointer" onClick={toggleModel}><span><MdEdit /></span></div>
                </div>
                 {/* .................... email edit model pop up */}
                 {model && (
                <div
                
                className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center"
                  onClick={close_model}
                >
                  <div className="bg-white p-4 rounded-md">
                    {/* Add your modal content here */}
                          <div className='mb-10 cursor-pointer' onClick={close_model}> <span className='float-right'><MdClose /></span>
                          </div>
                      <form  onSubmit={handleFormSubmit} action="" className='flex flex-col'>
                        <div>

                        <input type  = "text" className='border-2  border-gray text-[16px] w-[400px] h-[50px] my-4 text-black 
                        pl-4 outline-emerald-50' placeholder='enter old email'  
                         onClick={(e) => e.stopPropagation()}/>
                        </div>
                        <div>
                        <input type  = "text" className='border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black
                         pl-4 outline-none' placeholder='enter New email'
                         onClick={(e) => e.stopPropagation()} />
                        </div>
                       
                        <button className='bg-[#00ABE4] w-[290px] 
                        lg:w-full  md:w-[400px] h-[48px]
                     text-white rounded-md mt-10 text-[16px]'>Update</button>
                      </form>
                    
                    
                  </div>
                </div>
              )}

                {/* .....             passowrd */}
                <div className="content flex mt-4 items-center justify-between w-[300px] lg:w-[400px] bg-white p-4 rounded-md">
                    <div className="name"><h3>***********</h3></div>
                    <div className="name cursor-pointer" onClick={toggleModel}><span><MdEdit /></span></div>
                </div>
                 {/* .................... username edit model pop up */}
                 {model && (
                <div
                
                className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center"
                  onClick={close_model}
                >
                  <div className="bg-white p-4 rounded-md">
                    {/* Add your modal content here */}
                          <div className='mb-10 cursor-pointer' onClick={close_model}> <span className='float-right'><MdClose /></span>
                          </div>
                      <form  onSubmit={handleFormSubmit} action="" className='flex flex-col'>
                        <div>

                        <input type  = "text" className='border-2  border-gray text-[16px] w-[400px] h-[50px] my-4 text-black 
                        pl-4 outline-emerald-50' placeholder='enter old password'  
                         onClick={(e) => e.stopPropagation()}/>
                        </div>
                        <div>
                        <input type  = "text" className='border-2 border-gray text-[16px] w-[400px] h-[50px] my-4 text-black
                         pl-4 outline-none' placeholder='enter New passowrd'
                         onClick={(e) => e.stopPropagation()} />
                        </div>
                       
                        <button className='bg-[#00ABE4] w-[290px] 
                        lg:w-full  md:w-[400px] h-[48px]
                     text-white rounded-md mt-10 text-[16px]'>Update</button>
                      </form>
                    
                    
                  </div>
                </div>
              )}

                {/* .................... username edit model pop up end */}

                {/* ...end */}
                <div className="logut block lg:hidden">
                    <button className='bg-[#00ABE4] w-[290px] lg:w-[150px] md:w-[400px] h-[48px]
                     text-white rounded-md mt-10' onClick={Logout}>Logout</button>
                </div>

              
        </div>
      </section>
    </div>
  )
}

export default Profile
