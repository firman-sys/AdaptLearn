import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo-adaptlearn.webp';


const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("userSession") || !!sessionStorage.getItem("userSession");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 pl-6 md:pl-14 pr-6 md:pr-14 bg-muted shadow-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="font-bold text-primary text-xl">            
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="AdaptLearn Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">
                Adapt<span className="text-primary">Learn</span>
              </span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center font-bold">
            <a href="/" className="hover:text-orange-500 transition">Home</a>
            <a href="#fitur" className="hover:text-orange-500 transition">Fitur</a>
            <a href="#langkah-mulai" className="hover:text-orange-500 transition">Langkah Mulai</a>
            <a href="#gaya-belajar" className="hover:text-orange-500 transition">Gaya Belajar</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-3 items-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="bg-orange-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md">
                  Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-white border-2 border-primary text-orange-400 px-5 py-2 rounded-full font-semibold hover:bg-orange-50 transition">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-orange-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md">
                    Register →
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-gray-900 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="flex flex-col space-y-3 font-bold">
              <a href="/" className="hover:text-orange-500 transition py-2">Home</a>
              <a href="#" className="hover:text-orange-500 transition py-2">About Us</a>
              <a href="#fitur" className="hover:text-orange-500 transition py-2">Fitur</a>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="w-full bg-orange-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md">
                    Dashboard →
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <button className="w-full bg-white border-2 border-primary text-orange-400 px-5 py-2 rounded-full font-semibold hover:bg-orange-50 transition">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full bg-orange-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-md">
                      Register →
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <main className="grow">
        {/* Halaman Landing/Login */}
        <Outlet /> 
      </main>

      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="AdaptLearn Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold">
                  Adapt<span className="text-primary">Learn</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Platform rekomendasi materi belajar adaptif yang menyesuaikan konten materi berdasarkan gaya belajar siswa.
              </p>
            </div>

            {/* Empty space */}
            <div className="md:col-span-2"></div>

            {/* Quick Link */}
            <div className="md:col-span-2">
              <h3 className="text-primary font-bold mb-4">Quick Link</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="#fitur" className="hover:text-white transition">Fitur</a></li>
                <li><a href="#langkah-mulai" className="hover:text-white transition">Langkah Mulai</a></li>
                <li><a href="#gaya-belajar" className="hover:text-white transition">Gaya Belajar</a></li>
              </ul>
            </div>

            {/* More About Us */}
            <div className="md:col-span-3">
              <h3 className="text-primary font-bold mb-4">More About Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/instagram" className="hover:text-white transition">Instagram</a></li>
                <li><a href="/facebook" className="hover:text-white transition">Facebook</a></li>
                <li><a href="/x" className="hover:text-white transition">X</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-700 mb-6" />

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p>2026 AdaptLearn. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;