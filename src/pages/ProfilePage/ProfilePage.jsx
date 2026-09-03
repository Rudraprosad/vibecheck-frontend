import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PublicIcon from '@mui/icons-material/Public';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useApp } from '../../context/AppContext';
import { reviews, CATEGORY_META, contributors } from '../../data/mockData';
import ItineraryCard from '../../components/ItineraryCard/ItineraryCard';
import api from '../../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    updateProfile,
    logout,
  } = useApp();

  const [editMode, setEditMode]     = useState(false);
  const [editPwd, setEditPwd]       = useState(false);
  const [form, setForm]             = useState({
    name:  user.name,
    email: user.email,
    bio:   user.bio || '',
    profileImageUrl: user.profileImageUrl || '',
  });
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [myContributions, setMyContributions] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userStats, setUserStats] = useState({ createdItineraries: 0, countriesVisited: 0, reviewsGiven: 0 });
  const [myReviews, setMyReviews] = useState([]);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [contribRes, statsRes] = await Promise.all([
          api.get('/itineraries/me/created'),
          api.get('/users/me/stats')
        ]);
        if (contribRes.data.success) {
          setMyContributions(contribRes.data.data.slice(0, 4));
        }
        if (statsRes.data.success) {
          setUserStats(statsRes.data.stats);
          if (statsRes.data.recentReviews) {
            setMyReviews(statsRes.data.recentReviews);
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };
    fetchData();
  }, []);


  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data.url) {
        setForm(prev => ({ ...prev, profileImageUrl: res.data.url }));
      }
    } catch (err) {
      console.error('Failed to upload image', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ 
      name: form.name, 
      email: form.email, 
      bio: form.bio,
      profileImageUrl: form.profileImageUrl 
    });
    setEditMode(false);
  };

  const handleChangePwd = (e) => {
    e.preventDefault();
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError('Passwords do not match.');
      return;
    }
    if (pwdForm.next.length < 6) {
      setPwdError('Password must be at least 6 characters.');
      return;
    }
    setPwdError('');
    setEditPwd(false);
    setPwdForm({ current: '', next: '', confirm: '' });
    // Prototype: no real password change
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const STATS = [
    {
      icon: <FlightTakeoffIcon sx={{ fontSize: 20, color: '#B89ADC' }} />,
      value: userStats.createdItineraries,
      label: 'Itineraries Created',
    },
    {
      icon: <RateReviewIcon sx={{ fontSize: 20, color: '#22C55E' }} />,
      value: userStats.reviewsGiven,
      label: 'Reviews Given',
    },
    {
      icon: <PublicIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
      value: userStats.countriesVisited,
      label: 'Countries Visited',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 20, color: '#06B6D4' }} />,
      value: userStats.followers || 0,
      label: 'Followers',
    },
    {
      icon: <PersonAddIcon sx={{ fontSize: 20, color: '#EC4899' }} />,
      value: userStats.following || 0,
      label: 'Following',
    },
  ];

  return (
    <div className="profile page-enter">
      <div className="profile__layout container">
        {/* ── Profile Card ── */}
        <section className="profile__card" aria-labelledby="profile-heading">
          <div className="profile__card-body">
            {/* Avatar */}
            <div className="profile__avatar-col">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <div 
                style={{ position: 'relative', cursor: editMode ? 'pointer' : 'default' }}
                onClick={() => editMode && !uploadingImage && fileInputRef.current?.click()}
              >
                <Avatar 
                  src={form.profileImageUrl || user.profileImageUrl}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#B89ADC',
                    fontSize: '2rem',
                    fontWeight: 800,
                    border: '3px solid #E9D5FF',
                    opacity: uploadingImage ? 0.5 : 1,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                {editMode && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#A855F7',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    color: 'white'
                  }}>
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </div>
                )}
              </div>
              <Tooltip title="Log out" arrow>
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{ color: '#A855F7', mt: 0.5, '&:hover': { color: '#EF4444' } }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>

            {/* Fields */}
            <div className="profile__fields">
              {editMode ? (
                <>
                  <TextField
                    id="profile-name"
                    label="Display Name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    id="profile-email"
                    label="Email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    id="profile-bio"
                    label="Bio"
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Tell other travelers a little about yourself..."
                  />
                </>
              ) : (
                <>
                  <div className="profile__read-field">
                    <span className="profile__read-label">Display Name</span>
                    <span className="profile__read-value">{user.name}</span>
                  </div>
                  <div className="profile__read-field">
                    <span className="profile__read-label">Email</span>
                    <span className="profile__read-value">{user.email}</span>
                  </div>
                  <div className="profile__read-field">
                    <span className="profile__read-label">Bio</span>
                    <span className="profile__read-value profile__read-value--muted">
                      {user.bio || 'No bio yet.'}
                    </span>
                  </div>
                  <div className="profile__read-field">
                    <span className="profile__read-label">Handle</span>
                    <span className="profile__read-value">@{user.handle}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="profile__card-actions">
              {editMode ? (
                <>
                  <Button variant="contained" size="small" startIcon={<CheckIcon />} onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LockOutlinedIcon />}
                    onClick={() => setEditPwd(v => !v)}
                  >
                    Change Password
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Change Password panel */}
          {editPwd && (
            <form className="profile__pwd-panel" onSubmit={handleChangePwd}>
              <Divider sx={{ borderColor: '#E9D5FF', mb: 2 }} />
              <div className="profile__pwd-fields">
                <TextField
                  id="pwd-current"
                  label="Current Password"
                  type="password"
                  value={pwdForm.current}
                  onChange={e => setPwdForm(p => ({ ...p, current: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  id="pwd-new"
                  label="New Password"
                  type="password"
                  value={pwdForm.next}
                  onChange={e => setPwdForm(p => ({ ...p, next: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  id="pwd-confirm"
                  label="Confirm New Password"
                  type="password"
                  value={pwdForm.confirm}
                  onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                  error={!!pwdError}
                  helperText={pwdError}
                />
              </div>
              <Button type="submit" variant="contained" size="small" sx={{ mt: 1.5 }}>
                Update Password
              </Button>
            </form>
          )}
        </section>

        {/* ── Stats bar ── */}
        <div className="profile__stats" role="list">
          {STATS.map(({ icon, value, label }) => (
            <div key={label} className="profile__stat" role="listitem">
              <div className="profile__stat-icon">{icon}</div>
              <span className="profile__stat-value">{value}</span>
              <span className="profile__stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* ── My Contributions ── */}
        <section aria-labelledby="contributions-heading">
          <h2 id="contributions-heading" className="profile__section-title">My Contributions</h2>
          {myContributions.length === 0 ? (
            <div className="profile__empty">
              <p>No itineraries yet.</p>
              <Button variant="outlined" size="small" onClick={() => navigate('/create')} sx={{ mt: 1.5 }}>
                Create your first itinerary
              </Button>
            </div>
          ) : (
            <div className="profile__contrib-grid">
              {myContributions.map(it => (
                <ItineraryCard key={it._id || it.id} itinerary={it} view="grid" />
              ))}
            </div>
          )}
        </section>

        {/* ── Recent Reviews ── */}
        <section aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="profile__section-title">Recent Reviews</h2>
          {myReviews.length === 0 ? (
            <div className="profile__empty">
              <p>You haven't reviewed any itineraries yet.</p>
            </div>
          ) : (
            <div className="profile__reviews-list">
              {myReviews.map(r => (
                <div key={r._id || r.id} className="profile__review-row">
                  <div className="profile__review-header">
                    <div>
                      <p className="profile__review-target">{r.itineraryId}</p>
                      <Rating value={r.rating} readOnly precision={0.5} size="small" />
                    </div>
                    <span className="profile__review-date">
                      {new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="profile__review-text">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

