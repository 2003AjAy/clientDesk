import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';

// Pages
import LandingPage from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
// Fix import: ProjectDetail should be a default export, not a named export
import { ProjectDetail } from './pages/ProjectDetails';

import './index.css';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Redirect root to /dashboard if you want dashboard as default */}
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

            {/* Dashboard & Project Detail Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetail />} />

            {/* Fallback or 404 route (optional) */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;
