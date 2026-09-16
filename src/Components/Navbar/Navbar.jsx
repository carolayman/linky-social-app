import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { FiLink } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../../Api/getUserProfile.api";

export default function Navbar() {
  const { userLogin, setUserLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!userLogin) {
      setUserProfile(null);
      return;
    }

    try {
      jwtDecode(userLogin);

      getUserProfile()
        .then((response) => {
          const profile =
            response?.data?.data?.user ||
            response?.data?.user ||
            response?.data?.data;

          setUserProfile(profile);
        })
        .catch(() => {
          setUserProfile(null);
        });
    } catch {
      setUserProfile(null);
    }
  }, [userLogin]);

  const signOut = () => {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="navbar mx-auto min-h-16 px-6 sm:px-8 lg:px-14">

        <div className="flex-1">
          <Link
            to="/home"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white">
              <FiLink size={19} />
            </div>

            <span className="text-xl font-bold tracking-tight text-sky-500">
              Linky
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {userLogin === null ? (
            <>
              <NavLink
                to="/"
                className="hidden text-sm font-medium text-gray-500 transition hover:text-sky-500 sm:block"
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
              >
                Login
              </NavLink>
            </>
          ) : (
            <div className="dropdown dropdown-end">

              {/* Avatar */}
              <div
                tabIndex={0}
                role="button"
                className="avatar cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-500 ring-2 ring-sky-100 ring-offset-2">
                  {userProfile?.photo ? (
                    <img
                      src={userProfile.photo}
                      alt={userProfile?.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    userProfile?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
              </div>

              {/* Dropdown */}
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[60] mt-3 w-48 rounded-xl bg-white p-2 shadow-lg"
              >
                <li>
                  <Link to="/home">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/profile">
                    Profile
                  </Link>
                </li>

                <li>
                  <Link to="/changePassword">
                    Settings
                  </Link>
                </li>

                <li>
                  <button
                    onClick={signOut}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </ul>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}