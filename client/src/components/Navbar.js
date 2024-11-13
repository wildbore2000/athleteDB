// client/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              AthleteDB
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/add" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Assessment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;