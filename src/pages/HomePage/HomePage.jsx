import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyIcon from '@mui/icons-material/Money';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ItineraryCard from '../../components/ItineraryCard/ItineraryCard';
import { CATEGORY_META } from '../../data/mockData';
import api from '../../services/api';
import './HomePage.css';

const CATEGORY_ICONS = {
  Beach:     <WbSunnyIcon fontSize="small" />,
  Adventure: <LandscapeIcon fontSize="small" />,
  Culture:   <AccountBalanceIcon fontSize="small" />,
  Budget:    <MoneyIcon fontSize="small" />,
  City:      <LocationCityIcon fontSize="small" />,
  Nature:    <NaturePeopleIcon fontSize="small" />,
  Food:      <RestaurantIcon fontSize="small" />,
  Luxury:    <StarIcon fontSize="small" />,
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

export default function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation]   = useState('');
  const [budget, setBudget]       = useState('');
  const [duration, setDuration]   = useState('');
  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await api.get('/itineraries');
        if (res.data.success) {
          setItineraries(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching itineraries', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (budget)   params.set('budget',   budget);
    if (duration) params.set('duration', duration);
    navigate(`/search?${params.toString()}`);
  };

  const featured  = itineraries.filter(it => it.rating >= 4.0).slice(0, 6);
  const trending  = [...itineraries].sort((a, b) => (b.cloneCount || 0) - (a.cloneCount || 0)).slice(0, 4);

  return (
    <div className="home page-enter">
      {/* ── Search bar strip (centered, just under navbar) ── */}
      <div className="home__search-strip">
        <form className="home__search-form" onSubmit={handleSearch} aria-label="Search itineraries">
          <div className="home__search-fields">
            <TextField
              id="search-location"
              placeholder="Destination or country"
              value={location}
              onChange={e => setLocation(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 2 }}
            />
            <TextField
              id="search-budget"
              placeholder="Max budget (USD)"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1.5 }}
            />
            <TextField
              id="search-duration"
              placeholder="Days"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ fontSize: 14, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{ flexShrink: 0, px: 3, height: 40 }}
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* ── Hero (text + stats, left-aligned) ── */}
      <section className="home__hero" aria-label="Hero">
        <div className="home__hero-content">
          {/* <div className="home__hero-badge">
            <TrendingUpIcon sx={{ fontSize: 13 }} />
            <span>98,000+ travelers trust peer-built itineraries</span>
          </div> */}

          <h1 className="home__headline">
            Plan trips the way<br />
            <span className="home__headline-accent">real travelers</span> do.
          </h1>
          <p className="home__subline">
            Browse peer-verified itineraries. Clone what works.<br className="home__br" />
            Make it yours in minutes.
          </p>

          {/* Stats strip */}
          {/* <div className="home__stats" role="list">
            {STATS.map(({ value, label }) => (
              <div key={label} className="home__stat" role="listitem">
                <span className="home__stat-value">{value}</span>
                <span className="home__stat-label">{label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="home__section container" aria-labelledby="featured-heading">
        <div className="home__section-header">
          <h2 id="featured-heading" className="home__section-title">Featured Itineraries</h2>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/search')}
            sx={{ color: '#B89ADC', fontWeight: 600 }}
          >
            View all
          </Button>
        </div>
        <div className="home__grid">
          {featured.map(it => (
            <ItineraryCard key={it._id || it.id} itinerary={it} view="grid" />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="home__section container" aria-labelledby="categories-heading">
        <div className="home__section-header">
          <h2 id="categories-heading" className="home__section-title">Browse by Category</h2>
        </div>
        <div className="home__categories">
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                className="home__cat-tile"
                style={{ '--cat-color': meta.color, '--cat-bg': meta.bg }}
                onClick={() => navigate(`/search?tag=${cat}`)}
                aria-label={`Browse ${cat} itineraries`}
              >
                <span className="home__cat-icon">{CATEGORY_ICONS[cat]}</span>
                <span className="home__cat-name">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="home__section container" aria-labelledby="trending-heading">
        <div className="home__section-header">
          <h2 id="trending-heading" className="home__section-title">
            <TrendingUpIcon sx={{ fontSize: 18, color: '#B89ADC', mr: 0.75, verticalAlign: 'middle' }} />
            Trending This Week
          </h2>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/search?sort=clones')}
            sx={{ color: '#B89ADC', fontWeight: 600 }}
          >
            View all
          </Button>
        </div>
        <div className="home__trending-list">
          {trending.map((it, index) => (
            <div key={it._id || it.id} className="home__trending-row" onClick={() => navigate(`/itinerary/${it._id || it.id}`)}>
              <span className="home__trending-rank">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="home__trending-info">
                <span className="home__trending-title">{it.title}</span>
                <span className="home__trending-sub">
                  {it.destination}, {it.country} · {it.duration}d · ${(it.budget || 0).toLocaleString()}
                </span>
              </div>
              <div className="home__trending-meta">
                <span className="home__trending-clones">{(it.cloneCount || 0).toLocaleString()} clones</span>
                <span className="home__trending-rating">★ {it.rating || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

