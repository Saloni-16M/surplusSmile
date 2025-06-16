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
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#E0F2F1] min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-5 bg-teal-700/80 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-4xl font-extrabold text-white tracking-wide">SurplusSmile</h1>

<div className="flex gap-4">
<button
  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition"
  onClick={() => scrollToSection("mission")}
>
  Mission
</button>

<button
  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition"
  onClick={() => scrollToSection("about-us")}
>
  About Us
</button>


  {/* Signup Dropdown */}
  <div className="relative" ref={signupDropdownRef}>
    <button
  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition"
      onClick={() => {
        setIsSignupDrop(!isSignupDrop);
        setIsLoginDrop(false);
      }}
    >
      Signup ▼
    </button>
    {isSignupDrop && (
      <div 
      className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
        <Link to="/ngo/register" className="block px-5 py-3 text-gray-700 hover:bg-teal-100">Signup as NGO</Link>
        <Link to="/resort/register" className="block px-5 py-3 text-gray-700 hover:bg-teal-100">Signup as Resort</Link>
        
      </div>
    )}
  </div>

  {/* Login Dropdown */}
  <div className="relative" ref={loginDropdownRef}>
    <button
  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition"
      onClick={() => {
        setIsLoginDrop(!isLoginDrop);
        setIsSignupDrop(false);
      }}
    >
      Login ▼
    </button>
    {isLoginDrop && (
      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
        <Link to="/ngo/login" className="block px-5 py-3 text-gray-700 hover:bg-teal-100">Login as NGO</Link>
        <Link to="/resort/login" className="block px-5 py-3 text-gray-700 hover:bg-teal-100">Login as Resort</Link>
        <Link to="/admin/login" className="block px-5 py-3 text-gray-700 hover:bg-teal-100">Login as Admin</Link>
      </div>
    )}
  </div>
</div>
      </nav>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full h-[50vh] mt-24">
        <button
          className="absolute left-4 text-teal-600 text-4xl px-4 bg-white rounded-full shadow-md hover:bg-teal-100 transition"
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        >
          ❮
        </button>

        <div className="w-full h-full overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt="NGO-Resort"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          className="absolute right-4 text-teal-600 text-4xl px-4 bg-white rounded-full shadow-md hover:bg-teal-100 transition"
          onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
        >
          ❯
        </button>
      </div>

      {/* Mission */}
      <div id="mission" className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg mt-12">
        <h3 className="text-3xl font-bold text-teal-700">Our Mission</h3>
        <p className="text-gray-700 mt-3 text-lg leading-relaxed">
          SurplusSmile is on a mission to create <strong>strong partnerships</strong> between NGOs and resorts, ensuring <strong>food surplus gets to those in need</strong> rather than being wasted.
          We believe in <strong>sustainability</strong>, <strong>community care</strong>, and <strong>transforming excess resources into hope</strong>.  
          By fostering <strong>efficient donation systems</strong>, we empower resorts and NGOs to work hand in hand, reducing waste and <strong>amplifying social impact</strong>. 🌍✨
        </p>
      </div>

      {/* About Us */}
      <div id="about-us" className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg mt-10 mb-12">
        <h3 className="text-3xl font-bold text-teal-700">About Us</h3>
        <p className="text-gray-700 mt-3 text-lg leading-relaxed">
          <strong>SurplusSmile</strong> was founded with a vision: connecting <strong>resorts with NGOs</strong> for <strong>seamless food donation and impact-driven partnerships</strong>.  
          Resorts often have excess food, but <strong>distribution challenges</strong> leave valuable resources untouched.  
          We <strong>bridge that gap</strong>—creating a <strong>transparent</strong>, <strong>accessible</strong>, and <strong>community-driven</strong> solution where surplus food transforms into nourishment for those in need.  
          Our platform simplifies <strong>pickup requests</strong>, <strong>donation tracking</strong>, and <strong>real-time communication</strong>, making food rescue effortless. Together, we <strong>reduce waste, empower communities, and create a more sustainable future</strong>. ♻️💚
        </p>
      </div>
    </div>
  );
};

export default Home;
