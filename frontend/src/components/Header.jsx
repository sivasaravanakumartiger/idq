// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="main-header navbar navbar-expand navbar-dark">
            <div className="navbar-nav">
                <Link className="navbar-brand text-white" to="/">
                    <img src="niagara_logo.svg" alt="Niagara Logo" className="d-inline-block align-text-top" style={{ height: '30px' }} />
                </Link>
            </div>
            <div className="navbar-nav mx-auto">
                <Link className="navbar-brand text-white" to="/">
                    <b>IDQ</b> <span className="mx-2 fw-light opacity-50">|</span> <small className="fw-light">Intelligent Data Quality</small>
                </Link>
            </div>
            <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown">
                    <a className="nav-link" data-bs-toggle="dropdown" href="#">
                        <i className="far fa-bell"></i>
                        <span className="badge bg-warning navbar-badge">3</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                        <span className="dropdown-item dropdown-header">3 Notifications</span>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-envelope me-2"></i> New job run
                            <span className="float-end text-muted text-sm">3 mins</span>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-users me-2"></i> 8 new users
                            <span className="float-end text-muted text-sm">12 hours</span>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-file me-2"></i> New report ready
                            <span className="float-end text-muted text-sm">2 days</span>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item dropdown-footer">See All Notifications</a>
                    </div>
                </li>
                <li className="nav-item dropdown ms-2">
                    <a className="nav-link" data-bs-toggle="dropdown" href="#">
                        <i className="fas fa-user-circle fa-lg"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-user-circle me-2"></i> Profile
                        </a>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-cog me-2"></i> Settings
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item text-danger">
                            <i className="fas fa-sign-out-alt me-2"></i> Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Header;