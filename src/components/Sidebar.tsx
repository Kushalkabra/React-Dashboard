import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, X, Users, BarChart2, LogOut, User } from 'react-feather';
import { RootState } from '../store/store';

function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => location.pathname === path;

  const NavContent = () => (
    <>
      <div className="p-6 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <span className="text-white font-semibold text-xl">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 px-3">
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
            isActive('/') 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5 mr-3" />
          <span className="font-medium">User Management</span>
        </Link>
        <Link
          to="/analytics"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
            isActive('/analytics') 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart2 className="h-5 w-5 mr-3" />
          <span className="font-medium">Analytics</span>
        </Link>
        <Link
          to="/profile"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
            isActive('/profile') 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="h-5 w-5 mr-3" />
          <span className="font-medium">Profile</span>
        </Link>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-20 sm:hidden bg-white p-2 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/10 z-10 sm:hidden transition-opacity"
             onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <NavContent />
          </div>
        </div>
      )}

      <div className="hidden sm:block w-64 bg-white shadow-xl min-h-screen relative">
        <NavContent />
      </div>
    </>
  );
}

export default Sidebar;