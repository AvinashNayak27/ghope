import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";


function Payment() {
  const stripeLink = "https://buy.stripe.com/test_00g7vp5Kl92689ifZ0";
  const cryptoLink =
    "https://ghope.vercel.app/pay/4cd15474-3a36-4ac4-80ab-01da76f83597";

  return (
    <>
      <a
        href={stripeLink}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        target="_blank"
      >
        Pay with Stripe
      </a>
      <a
        href={cryptoLink} // Replace with your actual link for crypto payment
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        target="_blank"
      >
        Pay with Crypto
      </a>
    </>
  );
}

function CoursePage() {
  const courses = [
    { id: 1, title: "Course 1", description: "Description of Course 1" },
    { id: 2, title: "Course 2", description: "Description of Course 2" },
    { id: 3, title: "Course 3", description: "Description of Course 3" },
    { id: 4, title: "Course 4", description: "Description of Course 4" },
  ];
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://coursebackend.fly.dev/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch user profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  if (!token) {
    return (
      <div className="p-8">
        <Navbar />
        <h2 className="text-xl font-bold mb-4">Please Log In</h2>
        <p>
          You must be logged in to view the courses. Please{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            log in
          </Link>{" "}
          to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <h2 className="text-xl font-bold mb-4">Welcome {user?.email}</h2>
      <button
        onClick={handleLogout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
      {user.isPro ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <h2 className="font-bold text-xl mb-2">{course.title}</h2>
              <p className="text-gray-700 text-base">{course.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="font-bold text-xl mb-2">Upgrade to Pro</h2>
          <p className="text-gray-700 text-base">
            You must be a Pro member to view the courses. Please upgrade to Pro
            to continue.
          </p>
          <div className="mt-6">
            <Payment />
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursePage;
