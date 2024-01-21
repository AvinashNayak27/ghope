import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";

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
      const response = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch user profile.");
    }
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
      {
        user.isPro ? (
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
            <p className="text-gray-700 text-base">You must be a Pro member to view the courses. Please upgrade to Pro to continue.</p>
          </div>
        )
      }


    </div>
  );
}

export default CoursePage;
