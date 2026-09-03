import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Explore',   to: '/search' },
  { label: 'My Trips',  to: '/dashboard' },
  { label: 'Create',    to: '/create' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className="navbar"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E9D5FF',
          height: 'var(--nav-height)',
        }}
      >
        <Toolbar className="navbar__toolbar" sx={{ height: '100%', minHeight: 'unset' }}>
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            {/* <span className="navbar__logo-mark">V</span> */}
            <span className="navbar__logo-text">VibeCheck</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar__links" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`navbar__link ${isActive(to) ? 'navbar__link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/create')}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  + New Itinerary
                </Button>
                <Tooltip title={user?.name || 'Profile'} arrow>
                  <Avatar
                    src={user?.profileImageUrl}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      bgcolor: '#B89ADC',
                      cursor: 'pointer',
                      border: '2px solid #E9D5FF',
                      '&:hover': { borderColor: '#B89ADC' },
                      transition: 'border-color 150ms ease',
                    }}
                    onClick={() => navigate('/profile')}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/signup')}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  Sign Up
                </Button>
              </>
            )}
            <IconButton
              className="navbar__hamburger"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#581C87', display: { md: 'none' } }}
              aria-label="Open menu"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid #E9D5FF',
          },
        }}
      >
        <div className="drawer__header">
          <Link to="/" className="navbar__logo" onClick={() => setDrawerOpen(false)}>
            {/* <span className="navbar__logo-mark">V</span> */}
            <span className="navbar__logo-text">VibeCheck</span>
          </Link>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#581C87' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <Divider sx={{ borderColor: '#E9D5FF' }} />
        <List sx={{ pt: 1 }}>
          {NAV_LINKS.map(({ label, to }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton
                component={Link}
                to={to}
                onClick={() => setDrawerOpen(false)}
                selected={isActive(to)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(184, 154, 220,0.12)',
                    '& .MuiListItemText-primary': { color: '#B89ADC', fontWeight: 600 },
                  },
                  '&:hover': { backgroundColor: '#E9D5FF' },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <div className="drawer__footer">
          {isAuthenticated && user ? (
            <div className="drawer__user" onClick={() => { setDrawerOpen(false); navigate('/profile'); }} style={{ cursor: 'pointer' }}>
              <Avatar 
                src={user.profileImageUrl}
                sx={{ width: 36, height: 36, bgcolor: '#B89ADC', fontSize: '0.875rem', fontWeight: 700 }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <div>
                <p className="drawer__user-name">{user.name}</p>
                <p className="drawer__user-handle">@{user.handle}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', padding: '0 1rem' }}>
              <Button variant="outlined" fullWidth onClick={() => { setDrawerOpen(false); navigate('/login'); }}>
                Login
              </Button>
              <Button variant="contained" fullWidth onClick={() => { setDrawerOpen(false); navigate('/signup'); }}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
