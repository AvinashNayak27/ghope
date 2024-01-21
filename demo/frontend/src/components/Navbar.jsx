import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/courses" className="hover:text-gray-300">Courses</Link>
          <Link to="/register" className="hover:text-gray-300">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
