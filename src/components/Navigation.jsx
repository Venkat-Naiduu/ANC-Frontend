import React from "react";
import './Navigation.css';
import logo from '../images/image.png';
import { Button } from '@carbon/react';

import { useNavigate, useLocation } from 'react-router-dom';
import { Logout } from '@carbon/icons-react';

const navRoutes = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Entity Input', path: '/entity-input' },
  { label: 'Schedule Manager', path: '/schedule-manager' },
  // { label: 'Keyword Master', path: '/keyword-master' },
];

const Navigation = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // const handleLogout = () => {
  //   logout();
  //   localStorage.removeItem('logged_in_user'); // Clear localStorage
  //   navigate('/login', { replace: true }); // Replace history entry
  // };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-anc">Name Clearing</div>
        <div className="navbar-by-logo">
          <span>by</span>
          <img src={logo} alt="logo" className="navbar-logo-img" />
        </div>
      </div>
      <ul className="navbar-links">
        <div className="navbar-divider" />
        {navRoutes.map(({ label, path }) => (
          <React.Fragment key={label}>
            <li
              className={`nav-item${location.pathname === path ? ' selected' : ''}`}
              onClick={() => navigate(path)}
              style={{ cursor: 'pointer' }}
            >
              {label}
            </li>
            <div className="navbar-divider" />
          </React.Fragment>
        ))}
      </ul>
      {/* Always show logout icon, not based on user */}
      <span
        style={{ marginLeft: 'auto', color: '#FF0000', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 12px', height: 48 }}
        // onClick={handleLogout}
        title="Logout"
      >
        <Logout size={20} />
      </span>
    </nav>
  );
};

export default Navigation;
