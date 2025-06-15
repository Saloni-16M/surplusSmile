import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const images = ["ngo.jpeg", "resort.jpeg", "community.jpeg"];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignupDrop, setIsSignupDrop] = useState(false);
  const [isLoginDrop, setIsLoginDrop] = useState(false);

  const signupDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (signupDropdownRef.current && !signupDropdownRef.current.contains(event.target)) {
        setIsSignupDrop(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setIsLoginDrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#E8F5E9] min-h-screen flex flex-col items-center">
      {/* Enhanced Navbar */}
      <nav className="w-full flex justify-between items-center p-5 bg-green-700 shadow-lg fixed top-0 left-0 right-0 z-50">
        <h1 className="text-3xl font-bold text-white">SurplusSmile</h1>

        <div className="flex gap-6">
          <button className="text-white font-semibold hover:text-gray-300 transition text-lg" onClick={() => scrollToSection("mission")}>
            Mission
          </button>
          <button className="text-white font-semibold hover:text-gray-300 transition text-lg" onClick={() => scrollToSection("about-us")}>
            About Us
          </button>

          {/* Signup Dropdown */}
          <div className="relative" ref={signupDropdownRef}>
            <button className="text-white font-semibold hover:text-gray-300 transition text-lg" onClick={() => { setIsSignupDrop(!isSignupDrop); setIsLoginDrop(false); }}>
              Signup ▼
            </button>
            {isSignupDrop && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300">
                <Link to="/ngo/register" className="block px-5 py-3 text-gray-700 hover:bg-gray-100">Signup as NGO</Link>
                <Link to="/resort/register" className="block px-5 py-3 text-gray-700 hover:bg-gray-100">Signup as Resort</Link>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative" ref={loginDropdownRef}>
            <button className="text-white font-semibold hover:text-gray-300 transition text-lg" onClick={() => { setIsLoginDrop(!isLoginDrop); setIsSignupDrop(false); }}>
              Login ▼
            </button>
            {isLoginDrop && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300">
                <Link to="/ngo/login" className="block px-5 py-3 text-gray-700 hover:bg-gray-100">Login as NGO</Link>
                <Link to="/resort/login" className="block px-5 py-3 text-gray-700 hover:bg-gray-100">Login as Resort</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Image Carousel Section */}
      <div className="relative flex items-center justify-center w-full h-[50vh] mt-24">
        <button className="absolute left-4 text-gray-600 text-4xl px-5 bg-white rounded-full shadow-md hover:bg-gray-200 transition duration-200" onClick={() => setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1)}>❮</button>

        <div className="w-full h-full overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
          <img src={images[currentIndex]} alt="NGO-Resort" className="w-full h-full object-cover" />
        </div>

        <button className="absolute right-4 text-gray-600 text-4xl px-5 bg-white rounded-full shadow-md hover:bg-gray-200 transition duration-200" onClick={() => setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1)}>❯</button>
      </div>

      {/* Content Sections */}
      <div id="mission" className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg mt-12">
        <h3 className="text-2xl font-bold text-green-700">Our Mission</h3>
        <p className="text-gray-700 mt-2">Our mission is to bridge the gap between NGOs and Resorts by fostering partnerships that drive meaningful social impact.</p>
      </div>

      <div id="about-us" className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg mt-10">
        <h3 className="text-2xl font-bold text-green-700">About Us</h3>
        <p className="text-gray-700 mt-2">SurplusSmile connects NGOs with resorts, ensuring that surplus resources reach those in need.</p>
      </div>
    </div>
  );
};

export default Home;