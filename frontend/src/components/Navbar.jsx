import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLogin = window.localStorage.getItem("isLogin");
  const user_type = window.localStorage.getItem("user_type");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navigate = useNavigate();

  const Logout = () => {
    console.log("your logout");
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <div className="bg-[#00ABE4] h-[50px] flex items-center justify-between px-4 lg:px-10 text-white">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link
            to={
              user_type === "student"
                ? "/Check-schedule"
                : user_type === "admin"
                ? "/admin-dashboard"
                : "/Teaceher-Dashboard"
            }
            className="font-bold"
          >
            <span className="text-red-700 text-2xl">Consultant</span> appointment System
          </Link>
        </div>

        {/* Center: Nav links */}
        {isLogin && (
          <ul className="hidden lg:flex flex-1 justify-center gap-x-10 items-center">
            {user_type === "student" && (
              <>
                <li>
                  <Link to="/Check-schedule">Check schedule</Link>
                </li>
                <li>
                  <Link to="/Booked-list">Booked schedule</Link>
                </li>
                <li>
                  <Link to="/student-profile">Profile</Link>
                </li>
              </>
            )}

            {user_type === "teacher" && (
              <>
                <li>
                  <Link to="/Teaceher-Dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/manage-schedule">Manage schedule</Link>
                </li>
                <li>
                  <Link to="/Booked-schedules">Booked schedule</Link>
                </li>
                <li>
                  <Link to="/teacher-profile">Profile</Link>
                </li>
              </>
            )}

            {user_type === "admin" && (
              <>
                <li>
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/manage-teacher">Manage teachers</Link>
                </li>
                <li>
                  <Link to="/admin-profile">Profile</Link>
                </li>
              </>
            )}
          </ul>
        )}

        {/* Right: Logout or Auth */}
        <div className="flex items-center space-x-4">
          {isLogin ? (
            <>
              <button
                className="bg-[#00ABE4] w-[100px] h-[40px] text-white border border-white rounded-md"
                onClick={Logout}
              >
                Ka bax
              </button>
              <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
                <MdMenu size={30} />
              </div>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden w-screen h-auto p-4 bg-[#00ABE4] text-white">
          <nav>
            <ul className="space-y-3">
              {isLogin && (
                <>
                  {user_type === "student" && (
                    <>
                      <li>
                        <Link onClick={closeMenu} to="/Check-schedule">
                          Check schedule
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/Booked-list">
                          Booked schedule
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/student-profile">
                          Profile
                        </Link>
                      </li>
                    </>
                  )}

                  {user_type === "teacher" && (
                    <>
                      <li>
                        <Link onClick={closeMenu} to="/Teaceher-Dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/manage-schedule">
                          Manage schedule
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/Booked-schedules">
                          Booked schedule
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/teacher-profile">
                          Profile
                        </Link>
                      </li>
                    </>
                  )}

                  {user_type === "admin" && (
                    <>
                      <li>
                        <Link onClick={closeMenu} to="/admin-dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/manage-teacher">
                          Manage teachers
                        </Link>
                      </li>
                      <li>
                        <Link onClick={closeMenu} to="/admin-profile">
                          Profile
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar;
