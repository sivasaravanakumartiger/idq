// frontend/src/App.jsx
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AppRoutes from './routes/index.jsx'; // Import the new routes component
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';

function App() {
  // useEffect hook for sidebar toggle remains in App.jsx
  useEffect(() => {
    const toggleSidebar = (e) => {
      if (e) e.preventDefault();
      document.body.classList.toggle('sidebar-collapse');
      const icon = document.getElementById('sidebar-toggle-icon');
      if (document.body.classList.contains('sidebar-collapse')) {
        icon.className = 'fas fa-bars';
        icon.style.transform = 'rotate(0deg)';
      } else {
        icon.className = 'fas fa-thumbtack';
        icon.style.transform = 'rotate(45deg)';
      }
    };

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Initial state check
    const initialIcon = document.getElementById('sidebar-toggle-icon');
    if (document.body.classList.contains('sidebar-collapse')) {
      initialIcon.className = 'fas fa-bars';
    } else {
      initialIcon.className = 'fas fa-thumbtack';
      initialIcon.style.transform = 'rotate(45deg)';
    }

    // Clean up event listener
    return () => {
      if (sidebarToggle) {
        sidebarToggle.removeEventListener('click', toggleSidebar);
      }
    };
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <AppRoutes /> {/* Render the new routes component */}
        <Footer />
      </div>
    </div>
  );
}

export default App;