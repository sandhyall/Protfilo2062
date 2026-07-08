import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
    <p className="text-gray-500 mb-6">Page not found.</p>
    <Link to="/" className="text-blue-600 font-medium hover:underline">
      Go back home
    </Link>
  </div>
);

export default NotFound;