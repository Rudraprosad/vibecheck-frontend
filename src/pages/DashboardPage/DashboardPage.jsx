import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ItineraryCard from '../../components/ItineraryCard/ItineraryCard';
import { itineraries, CATEGORY_META } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import './DashboardPage.css';

const TABS = [
  { id: 'my-trips', label: 'My Trips',  icon: <FlightTakeoffIcon sx={{ fontSize: 16 }} /> },
  { id: 'saved',    label: 'Saved',     icon: <BookmarkIcon sx={{ fontSize: 16 }} />      },
  { id: 'profile',  label: 'Profile',   icon: <PersonIcon sx={{ fontSize: 16 }} />  },
  { id: 'settings', label: 'Settings',  icon: <SettingsOutlinedIcon sx={{ fontSize: 16 }} /> },
];

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="dash__empty">
      <div className="dash__empty-icon">{icon}</div>
      <p className="dash__empty-title">{title}</p>
      {subtitle && <p className="dash__empty-sub">{subtitle}</p>}
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const { tab: tabParam }   = useParams();
  const navigate            = useNavigate();
  const { user } = useApp();

  const [activeTab, setActiveTab] = useState(
    TABS.findIndex(t => t.id === tabParam) !== -1
      ? TABS.findIndex(t => t.id === tabParam)
      : 0
  );

  const [clonedItins, setClonedItins] = useState([]);
  const [createdItins, setCreatedItins] = useState([]);
  const [savedItins, setSavedItins] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [createdRes, savedRes] = await Promise.all([
          api.get('/itineraries/me/created'),
          api.get('/itineraries/me/saved')
        ]);
        
        if (createdRes.data.success) {
          const allCreated = createdRes.data.data;
          setClonedItins(allCreated.filter(it => it.clonedFromId));
          setCreatedItins(allCreated.filter(it => !it.clonedFromId));
        }
        
        if (savedRes.data.success) {
          setSavedItins(savedRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (_, idx) => {
    setActiveTab(idx);
    navigate(`/dashboard/${TABS[idx].id}`, { replace: true });
  };

  return (
    <div className="dash page-enter">
      <div className="dash__layout container">
        {/* ── Sidebar ── */}
        <aside className="dash__sidebar" aria-label="Dashboard navigation">
          {/* User card */}
          <div className="dash__user-card">
            <Avatar 
              src={user.profileImageUrl}
              sx={{
                width: 52,
                height: 52,
                bgcolor: '#B89ADC',
                fontSize: '1.25rem',
                fontWeight: 800,
                border: '2px solid #E9D5FF',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <div>
              <p className="dash__user-name">{user.name}</p>
              <p className="dash__user-handle">@{user.handle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="dash__user-stats">
            <div className="dash__user-stat">
              <span className="dash__user-stat-val">{clonedItins.length + createdItins.length}</span>
              <span className="dash__user-stat-label">trips</span>
            </div>
            <div className="dash__user-stat">
              <span className="dash__user-stat-val">{user.followers}</span>
              <span className="dash__user-stat-label">followers</span>
            </div>
            <div className="dash__user-stat">
              <span className="dash__user-stat-val">{user.following}</span>
              <span className="dash__user-stat-label">following</span>
            </div>
          </div>

          <div className="dash__sidebar-divider" />

          {/* Nav */}
          <nav className="dash__nav" aria-label="Dashboard sections">
            {TABS.map((t, idx) => (
              <button
                key={t.id}
                className={`dash__nav-item ${activeTab === idx ? 'dash__nav-item--active' : ''}`}
                onClick={() => handleTabChange(null, idx)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="dash__sidebar-bottom">
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              sx={{ borderRadius: '8px' }}
            >
              New Itinerary
            </Button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="dash__main" aria-label="Dashboard content">
          {/* Tab 0 — My Trips */}
          {activeTab === 0 && (
            <div className="dash__section-group">
              {/* Cloned */}
              <section aria-labelledby="cloned-heading">
                <div className="dash__section-header">
                  <h2 id="cloned-heading" className="dash__section-title">
                    Cloned Itineraries
                    <span className="dash__section-count">{clonedItins.length}</span>
                  </h2>
                </div>
                {clonedItins.length === 0 ? (
                  <EmptyState
                    icon={<ContentCopyIcon sx={{ fontSize: 28, color: '#D8B4FE' }} />}
                    title="No cloned itineraries yet"
                    subtitle="Browse and clone itineraries from other travelers."
                    action={
                      <Button variant="outlined" size="small" onClick={() => navigate('/search')} sx={{ mt: 2 }}>
                        Explore itineraries
                      </Button>
                    }
                  />
                ) : (
                  <div className="dash__grid">
                    {clonedItins.map(it => (
                      <div key={it._id || it.id} className="dash__grid-card">
                        <ItineraryCard itinerary={it} view="grid" />
                        <div className="dash__card-meta">
                          <span className="dash__card-label">Cloned</span>
                          <span className="dash__card-date">
                            from @{it.contributorId}
                          </span>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => navigate(`/edit/${it._id || it.id}`)}
                            sx={{ ml: 'auto', fontSize: '0.75rem', color: '#B89ADC', p: '2px 8px' }}
                          >
                            Customise
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Created */}
              <section aria-labelledby="created-heading">
                <div className="dash__section-header">
                  <h2 id="created-heading" className="dash__section-title">
                    Created by You
                    <span className="dash__section-count">{createdItins.length}</span>
                  </h2>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create')}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    New
                  </Button>
                </div>
                {createdItins.length === 0 ? (
                  <EmptyState
                    icon={<AddIcon sx={{ fontSize: 28, color: '#D8B4FE' }} />}
                    title="Nothing created yet"
                    subtitle="Start from scratch or clone an existing itinerary and customise it."
                    action={
                      <Button variant="contained" size="small" onClick={() => navigate('/create')} sx={{ mt: 2 }}>
                        Create itinerary
                      </Button>
                    }
                  />
                ) : (
                  <div className="dash__grid">
                    {createdItins.map(it => (
                      <div key={it._id || it.id} className="dash__grid-card">
                        <ItineraryCard itinerary={it} view="grid" />
                        <div className="dash__card-meta">
                          {it.status === 'draft' && (
                            <Chip label="Draft" size="small" sx={{ height: 20, fontSize: '0.6875rem', bgcolor: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'none' }} />
                          )}
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => navigate(`/edit/${it._id || it.id}`)}
                            sx={{ ml: 'auto', fontSize: '0.75rem', color: '#B89ADC', p: '2px 8px' }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Tab 1 — Saved */}
          {activeTab === 1 && (
            <section aria-labelledby="saved-heading">
              <div className="dash__section-header">
                <h2 id="saved-heading" className="dash__section-title">
                  Saved Itineraries
                  <span className="dash__section-count">{savedItins.length}</span>
                </h2>
              </div>
              {savedItins.length === 0 ? (
                <EmptyState
                  icon={<BookmarkIcon sx={{ fontSize: 28, color: '#D8B4FE' }} />}
                  title="Nothing saved yet"
                  subtitle="Bookmark itineraries to come back to them later."
                  action={
                    <Button variant="outlined" size="small" onClick={() => navigate('/search')} sx={{ mt: 2 }}>
                      Browse itineraries
                    </Button>
                  }
                />
              ) : (
                <div className="dash__grid">
                  {savedItins.map(it => <ItineraryCard key={it._id || it.id} itinerary={it} view="grid" />)}
                </div>
              )}
            </section>
          )}

          {/* Tab 2 — Profile */}
          {activeTab === 2 && (
            <section className="dash__profile" aria-labelledby="profile-heading">
              <h2 id="profile-heading" className="dash__section-title" style={{ marginBottom: 24 }}>Profile</h2>
              <div className="dash__profile-card">
                <Avatar 
                  src={user.profileImageUrl}
                  sx={{ width: 72, height: 72, bgcolor: '#B89ADC', fontSize: '1.75rem', fontWeight: 800 }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <div className="dash__profile-info">
                  <h3 className="dash__profile-name">{user.name}</h3>
                  <p className="dash__profile-handle">@{user.handle}</p>
                  <p className="dash__profile-email">{user.email}</p>
                  {user.bio && <p className="dash__profile-bio">{user.bio}</p>}
                </div>
              </div>
              <div className="dash__profile-stats">
                {[
                  { label: 'Itineraries',  val: clonedItins.length + createdItins.length },
                  { label: 'Saved',        val: savedItins.length },
                  { label: 'Followers',    val: user.followers },
                  { label: 'Following',    val: user.following },
                ].map(({ label, val }) => (
                  <div key={label} className="dash__profile-stat">
                    <span className="dash__profile-stat-val">{val}</span>
                    <span className="dash__profile-stat-label">{label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outlined" size="small" sx={{ mt: 3 }}>Edit Profile</Button>
            </section>
          )}

          {/* Tab 3 — Settings */}
          {activeTab === 3 && (
            <section className="dash__settings" aria-labelledby="settings-heading">
              <h2 id="settings-heading" className="dash__section-title" style={{ marginBottom: 24 }}>Settings</h2>
              {[
                { label: 'Email notifications for new reviews',   id: 'notif-reviews' },
                { label: 'Weekly itinerary recommendations',       id: 'notif-recs'    },
                { label: 'Show my profile publicly',               id: 'privacy-public' },
                { label: 'Allow others to clone my itineraries',   id: 'privacy-clone' },
              ].map(({ label, id }) => (
                <label key={id} className="dash__setting-item" htmlFor={id}>
                  <span className="dash__setting-label">{label}</span>
                  <input type="checkbox" id={id} className="dash__toggle" defaultChecked />
                </label>
              ))}
              <div className="dash__settings-footer">
                <Button variant="outlined" color="error" size="small" sx={{ borderColor: '#D8B4FE', color: '#EF4444' }}>
                  Delete account
                </Button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

