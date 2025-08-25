// frontend/src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [isIDQOpen, setIsIDQOpen] = useState(false);

    // Auto-expand IDQ if current route is inside it
    useEffect(() => {
        if (location.pathname.startsWith('/manage_rulesets') || location.pathname.startsWith('/test_suite_configuration')) {
            setIsIDQOpen(true);
        }
    }, [location]);

    const toggleIDQ = () => {
        setIsIDQOpen(!isIDQOpen);
    };

    return (
        <aside className="main-sidebar">
            <div className="sidebar-top">
                <a className="nav-link sidebar-toggle" href="#" role="button">
                    <i id="sidebar-toggle-icon" className="fas fa-bars"></i>
                </a>
            </div>
            <nav className="main-nav">
                <ul className="nav nav-pills nav-sidebar flex-column">
                    
                    {/* Dashboard */}
                    <li className="nav-item">
                        <Link 
                            to="/" 
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            <i className="nav-icon fas fa-tachometer-alt"></i>
                            <p>Dashboard</p>
                        </Link>
                    </li>

                    {/* IDQ expandable */}
                    <li className={`nav-item ${isIDQOpen ? 'menu-open' : ''}`}>
                        <a 
                            href="#"
                            className="nav-link"
                            onClick={toggleIDQ}
                        >
                            {/* ✅ Updated Icon */}
                            <i className="fa-solid fa-shield-halved nav-icon"></i>
                            <p>
                                IDQ
                                <i className="right fas fa-angle-left"></i>
                            </p>
                        </a>

                        {/* Submenu */}
                        {isIDQOpen && (
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link 
                                        to="/manage_rulesets"
                                        className={`nav-link ${location.pathname.startsWith('/manage_rulesets') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-tasks nav-icon"></i>
                                        <p>Rule Management</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to="/test_suite_configuration"
                                        className={`nav-link ${location.pathname.startsWith('/test_suite_configuration') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-cogs nav-icon"></i>
                                        <p>Test Suite</p>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
