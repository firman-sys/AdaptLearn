import { Outlet, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import logo from '../assets/logo-adaptlearn.webp';

const LearningLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header Like Dashboard Layout */}
      <nav className="h-16 border-b border-background-alt flex items-center justify-between px-4 md:px-6 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="AdaptLearn Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900">
              Adapt<span className="text-primary">Learn</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex bg-background-alt text-text-primary px-4 py-1.5 rounded-full font-bold text-sm items-center">
          Visual Learner
        </div>

        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-light"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Copyright Footer */}
      <footer className="w-full py-8 text-center text-xs font-bold text-gray-900 bg-[#fffbf0]">
        2026 AdaptLearn. All Rights Reserved
      </footer>
    </div>
  );
};

export default LearningLayout;