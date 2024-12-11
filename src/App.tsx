import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { RootState } from './store/store';
import Sidebar from './components/Sidebar';
import UserManagement from './components/UserManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import EditProfile from './components/EditProfile';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/" /> : <Signup />} 
        />
        <Route
          path="/*"
          element={
            user ? (
              <div className="min-h-screen bg-gray-50">
                <div className="flex flex-col sm:flex-row min-h-screen">
                  <Sidebar />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 py-8">
                      <Routes>
                        <Route path="/" element={<UserManagement />} />
                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/profile" element={<EditProfile />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;