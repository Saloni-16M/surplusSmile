import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const images = [
  {
    src: "ngo.jpeg",
    title: "Connecting NGOs with Resources",
    description: "Bridging the gap between surplus and need"
  },
  {
    src: "resort.jpeg",
    title: "Resort Partnerships",
    description: "Turning excess into opportunities for communities"
  },
  {
    src: "community.jpeg",
    title: "Community Impact",
    description: "Creating smiles through sustainable solutions"
  }
];

const features = [
  {
    icon: "🚚",
    title: "Efficient Distribution",
    description: "Streamlined pickup and delivery system for food donations"
  },
  {
    icon: "📱",
    title: "Real-time Tracking",
    description: "Track donations from source to recipient in real-time"
  },
  {
    icon: "🤝",
    title: "Verified Partners",
    description: "All NGOs and resorts are thoroughly vetted for reliability"
  },
  {
    icon: "🌱",
    title: "Sustainability",
    description: "Reducing food waste while helping communities thrive"
  }
];

const testimonials = [
  {
    quote: "SurplusSmile has transformed how we manage our excess food. Now we know it's going to people who truly need it.",
    author: "Resort Manager, Goa"
  },
  {
    quote: "As a small NGO, this platform has given us access to quality food donations we couldn't get before.",
    author: "NGO Director, Mumbai"
  },
  {
    quote: "The transparency and ease of use makes this the best donation platform we've worked with.",
    author: "Community Leader, Bangalore"
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignupDrop, setIsSignupDrop] = useState(false);
  const [isLoginDrop, setIsLoginDrop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const signupDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setIsSignupDrop(false);
    setIsLoginDrop(false);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className={`w-full flex justify-between items-center p-4 transition-all duration-300 fixed top-0 left-0 right-0 z-50 ${isScrolled ? "bg-teal-800 shadow-lg py-3" : "bg-teal-700/90 backdrop-blur-md"}`}>
        <Link to="/" className="flex items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center">
            <span className="mr-2">SurplusSmile</span>
            <span className="text-2xl">😊</span>
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
          <button
            className="text-white hover:text-teal-200 px-3 py-2 rounded-md transition font-medium"
            onClick={() => scrollToSection("mission")}
          >
            Mission
          </button>

          <button
            className="text-white hover:text-teal-200 px-3 py-2 rounded-md transition font-medium"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            className="text-white hover:text-teal-200 px-3 py-2 rounded-md transition font-medium"
            onClick={() => scrollToSection("about-us")}
          >
            About Us
          </button>

          {/* Signup Dropdown */}
          <div className="relative" ref={signupDropdownRef}>
            <button
              className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition font-medium flex items-center"
              onClick={() => {
                setIsSignupDrop(!isSignupDrop);
                setIsLoginDrop(false);
              }}
            >
              Signup <span className="ml-1">▼</span>
            </button>
            {isSignupDrop && (
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden w-48 z-50 border border-teal-100">
                <Link 
                  to="/ngo/register" 
                  className="block px-5 py-3 text-gray-700 hover:bg-teal-50 transition flex items-center"
                  onClick={() => setIsSignupDrop(false)}
                >
                  <span className="mr-2">🏢</span> NGO
                </Link>
                <Link 
                  to="/resort/register" 
                  className="block px-5 py-3 text-gray-700 hover:bg-teal-50 transition flex items-center"
                  onClick={() => setIsSignupDrop(false)}
                >
                  <span className="mr-2">🏨</span> Resort
                </Link>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative" ref={loginDropdownRef}>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition font-medium flex items-center"
              onClick={() => {
                setIsLoginDrop(!isLoginDrop);
                setIsSignupDrop(false);
              }}
            >
              Login <span className="ml-1">▼</span>
            </button>
            {isLoginDrop && (
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden w-48 z-50 border border-teal-100">
                <Link 
                  to="/ngo/login" 
                  className="block px-5 py-3 text-gray-700 hover:bg-teal-50 transition flex items-center"
                  onClick={() => setIsLoginDrop(false)}
                >
                  <span className="mr-2">🏢</span> NGO
                </Link>
                <Link 
                  to="/resort/login" 
                  className="block px-5 py-3 text-gray-700 hover:bg-teal-50 transition flex items-center"
                  onClick={() => setIsLoginDrop(false)}
                >
                  <span className="mr-2">🏨</span> Resort
                </Link>
                <Link 
                  to="/admin/login" 
                  className="block px-5 py-3 text-gray-700 hover:bg-teal-50 transition flex items-center border-t border-teal-100"
                  onClick={() => setIsLoginDrop(false)}
                >
                  <span className="mr-2">🔒</span> Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen max-h-[90vh] mt-16 overflow-hidden">
        {/* Carousel */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center px-6 max-w-4xl">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
                    {image.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-teal-100 mb-8 animate-fadeIn delay-100">
                    {image.description}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link 
                      to="/resort/register" 
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg animate-fadeIn delay-200"
                    >
                      I'm a Resort
                    </Link>
                    <Link 
                      to="/ngo/register" 
                      className="bg-white hover:bg-gray-100 text-teal-700 px-6 py-3 rounded-lg font-medium transition shadow-lg animate-fadeIn delay-200"
                    >
                      I'm an NGO
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl p-2 bg-teal-700/70 rounded-full shadow-md hover:bg-teal-700 transition backdrop-blur-sm"
          onClick={goToPrevSlide}
        >
          ❮
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl p-2 bg-teal-700/70 rounded-full shadow-md hover:bg-teal-700 transition backdrop-blur-sm"
          onClick={goToNextSlide}
        >
          ❯
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition ${index === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-teal-700 text-white py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">0</div>
            <div className="text-teal-100">Partner Resorts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">0</div>
            <div className="text-teal-100">Registered NGOs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">0</div>
            <div className="text-teal-100">Meals Donated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">0</div>
            <div className="text-teal-100">Cities Covered</div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div id="mission" className="w-full max-w-6xl p-8 md:p-12 my-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-teal-600 p-8 flex items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-teal-100 text-lg leading-relaxed">
                  To create <strong>sustainable connections</strong> between food sources and communities in need, transforming excess into nourishment and hope.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                SurplusSmile is on a mission to create <strong>strong partnerships</strong> between NGOs and resorts, ensuring <strong>food surplus gets to those in need</strong> rather than being wasted.
                We believe in <strong>sustainability</strong>, <strong>community care</strong>, and <strong>transforming excess resources into hope</strong>.  
                By fostering <strong>efficient donation systems</strong>, we empower resorts and NGOs to work hand in hand, reducing waste and <strong>amplifying social impact</strong>.
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => scrollToSection("features")}
                  className="text-teal-600 font-medium hover:text-teal-800 transition flex items-center"
                >
                  Learn more about our features
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="w-full max-w-6xl p-8 md:p-12 my-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-teal-700 mb-4">Why Choose SurplusSmile?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers comprehensive solutions to make food donation seamless and impactful
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-teal-50 flex flex-col items-center text-center"
            >
              {/* <div className="text-4xl mb-4">{feature.icon}</div> */}
              <h4 className="text-xl font-bold text-teal-700 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full bg-teal-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-teal-700 text-center mb-12">What Our Partners Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="text-teal-600 text-4xl mb-4">"</div>
                <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                <p className="text-teal-700 font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us */}
      <div id="about-us" className="w-full max-w-6xl p-8 md:p-12 my-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex flex-row-reverse">
            <div className="md:w-1/2 bg-teal-600 p-8 flex items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">About Us</h3>
                <p className="text-teal-100 text-lg leading-relaxed">
                  We're a team passionate about <strong>sustainability</strong> and <strong>social impact</strong>, building bridges between businesses and communities.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>SurplusSmile</strong> was founded with a vision: connecting <strong>resorts with NGOs</strong> for <strong>seamless food donation and impact-driven partnerships</strong>.  
                Resorts often have excess food, but <strong>distribution challenges</strong> leave valuable resources untouched.  
                We <strong>bridge that gap</strong>—creating a <strong>transparent</strong>, <strong>accessible</strong>, and <strong>community-driven</strong> solution where surplus food transforms into nourishment for those in need.  
                Our platform simplifies <strong>pickup requests</strong>, <strong>donation tracking</strong>, and <strong>real-time communication</strong>, making food rescue effortless.
              </p>
              <div className="mt-6">
                <Link 
                  to="/about" 
                  className="text-teal-600 font-medium hover:text-teal-800 transition flex items-center"
                >
                  More about our story
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-teal-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h3>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Join our growing network of resorts and NGOs working together to reduce waste and feed communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/resort/register" 
              className="bg-white hover:bg-gray-100 text-teal-700 px-8 py-3 rounded-lg font-medium transition shadow-lg"
            >
              Register Your Resort
            </Link>
            <Link 
              to="/ngo/register" 
              className="bg-teal-600 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg border border-white/20"
            >
              Register Your NGO
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-teal-900 text-white pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">SurplusSmile</span>
                <span>😊</span>
              </h4>
              <p className="text-teal-200">
                Bridging the gap between surplus food and those in need through technology and compassion.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("mission")} className="text-teal-200 hover:text-white transition">Mission</button></li>
                <li><button onClick={() => scrollToSection("features")} className="text-teal-200 hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection("about-us")} className="text-teal-200 hover:text-white transition">About Us</button></li>
                <li><Link to="/contact" className="text-teal-200 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Get Started</h5>
              <ul className="space-y-2">
                <li><Link to="/resort/register" className="text-teal-200 hover:text-white transition">For Resorts</Link></li>
                <li><Link to="/ngo/register" className="text-teal-200 hover:text-white transition">For NGOs</Link></li>
                <li><Link to="/admin/login" className="text-teal-200 hover:text-white transition">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Connect With Us</h5>
              <div className="flex gap-4 mb-4">
                <a href="#" className="text-teal-200 hover:text-white text-2xl transition">📱</a>
                <a href="#" className="text-teal-200 hover:text-white text-2xl transition">📘</a>

              </div>
              <p className="text-teal-200">
                Email: <a href="mailto:surplusmile@gmail.com" className="hover:text-white transition">surplussmile@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="border-t border-teal-800 pt-6 text-center text-teal-400">
            <p>© {new Date().getFullYear()} SurplusSmile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;