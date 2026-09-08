import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import logo from '../assets/logo-adaptlearn.webp';

const DashboardLayout = () => {
  const [userProfile] = useState(() => {
    const profileStr = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
    return profileStr ? JSON.parse(profileStr) : null;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("userProfile");
    sessionStorage.removeItem("userSession");
    sessionStorage.removeItem("userProfile");
    window.location.href = "/";
  };

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <nav className="h-16 border-b border-background-alt flex items-center justify-between px-4 md:px-6 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="AdaptLearn Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900">
              Adapt<span className="text-primary">Learn</span>
            </span>
          </Link>
        </div>

        {/* Dynamic Learning Style */}
        <div className="hidden md:flex bg-background-alt text-text-primary px-4 py-1.5 rounded-full font-bold text-sm items-center">
          {userProfile.learning_style || "Visual"} Learner
        </div>

        <div className="flex items-center gap-4 relative">
          <button className="text-text-secondary hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg hover:shadow-lg transition-all active:scale-95 select-none"
          >
            {userProfile.name.charAt(0).toUpperCase()}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-background-alt rounded-xl shadow-xl py-2 z-50">
               <div className="px-4 py-2 border-b border-background-alt mb-1">
                 <p className="text-xs text-text-secondary">Logged in as</p>
                 <p className="text-sm font-bold text-text-primary truncate">{userProfile.name}</p>
               </div>
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
               >
                 <LogOut size={16} />
                 Logout
               </button>
            </div>
          )}
        </div>
      </nav>

      <main className="grow"> 
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;