import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { contributors, CATEGORY_META } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import './ItineraryCard.css';

export default function ItineraryCard({ itinerary, view = 'grid' }) {
  const navigate = useNavigate();
  const { cloneItinerary, saveItinerary, isCloned, isSaved } = useApp();

  if (!itinerary) return null;

  const {
    _id, title, destination, country, duration, budget,
    currency = 'USD', tags = [], primaryTag, rating,
    reviewCount = 0, cloneCount = 0, contributorId, coverImageUrl,
  } = itinerary;

  const id = _id || itinerary.id; // fallback for mock data if any left

  // In the real DB, we expect contributorId to be populated, so it has .handle
  // If it's just a string, we won't show it, or we'll fallback safely
  const contrib = typeof contributorId === 'object' ? contributorId : null;

  const cloned = isCloned ? isCloned(id) : false; // we removed isCloned from context!
  const saved = isSaved ? isSaved(id) : false;
  const meta = CATEGORY_META[primaryTag] || CATEGORY_META['City'];

  const handleClone = (e) => {
    e.stopPropagation();
    cloneItinerary(id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    saveItinerary(id);
  };

  const handleCardClick = () => navigate(`/itinerary/${id}`);

  if (view === 'list') {
    return (
      <Card className="icard icard--list" onClick={handleCardClick} role="button" tabIndex={0}>
        {/* Accent strip */}
        <div 
          className="icard__strip" 
          style={{ 
            backgroundColor: coverImageUrl ? 'transparent' : meta.color,
            backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />

        <CardContent className="icard__list-content" sx={{ p: 0 }}>
          {/* Destination initial block */}
          {/* <div className="icard__initial" style={{ backgroundColor: meta.bg, color: meta.color }}>
            <span>{destination.charAt(0)}</span>
          </div> */}

          <div className="icard__list-body">
            <div className="icard__list-top">
              <div>
                <h3 className="icard__title">{title}</h3>
                <p className="icard__meta">
                  {destination}, {country}
                  <span className="icard__dot">·</span>
                  <AccessTimeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />
                  {' '}{duration} days
                  <span className="icard__dot">·</span>
                  <AttachMoneyIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />
                  {(budget || 0).toLocaleString()} {currency}
                </p>
              </div>
              <div className="icard__rating-row">
                <Rating value={rating} readOnly precision={0.1} size="small" />
                <span className="icard__rating-val">{rating?.toFixed(1)}</span>
                <span className="icard__review-count">({reviewCount})</span>
              </div>
            </div>

            <div className="icard__list-bottom">
              <div className="icard__tags">
                {tags.slice(0, 3).map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#1f0d2e',
                      // color: CATEGORY_META[tag]?.color || '#581C87',
                      backgroundColor: 'rgba(202, 155, 249, 0.48)',
                      // backgroundColor: CATEGORY_META[tag]?.bg || 'rgba(161,161,170,0.08)',
                      border: 'none',
                    }}
                  />
                ))}
              </div>
              <div className="icard__clone-info">
                <PeopleIcon sx={{ fontSize: 13, color: '#A855F7' }} />
                <span className="icard__clone-count">{(cloneCount || 0).toLocaleString()} clones</span>
              </div>
            </div>
          </div>

          <div className="icard__list-actions">
            <Tooltip title={saved ? 'Remove from saved' : 'Save'} arrow>
              <IconButton onClick={handleSave} size="small" sx={{ color: saved ? '#B89ADC' : '#A855F7' }}>
                {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Button
              variant={cloned ? 'outlined' : 'contained'}
              size="small"
              startIcon={cloned ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleClone}
              disabled={cloned}
              sx={{ minWidth: 90, fontSize: '0.75rem' }}
            >
              {cloned ? 'Cloned' : 'Clone'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ---- Grid view (default) ---- */
  return (
    <Card className="icard icard--grid" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Header — typographic destination block */}
      <div 
        className="icard__header" 
        style={{ 
          backgroundColor: coverImageUrl ? 'transparent' : meta.bg,
          backgroundImage: coverImageUrl ? `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%), url(${coverImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="icard__header-bg-text" style={{ color: coverImageUrl ? '#fff' : undefined }}>{destination}</div>
        <div className="icard__header-overlay">
          <Chip
            label={primaryTag}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: meta.color,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${meta.color}40`,
            }}
          />
          <div className="icard__header-rating">
            <span style={{ color: '#F59E0B', fontSize: '0.75rem' }}>★</span>
            <span className="icard__header-rating-val">{rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <CardContent className="icard__grid-content" sx={{ p: '16px 16px 0' }}>
        <h3 className="icard__title">{title}</h3>
        <p className="icard__destination">{destination}, {country}</p>

        <div className="icard__stats">
          <span className="icard__stat">
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            {duration}d
          </span>
          <span className="icard__stat">
            <AttachMoneyIcon sx={{ fontSize: 13 }} />
            {(budget || 0).toLocaleString()}
          </span>
          <span className="icard__stat">
            <PeopleIcon sx={{ fontSize: 13 }} />
            {(cloneCount || 0).toLocaleString()}
          </span>
        </div>

        {contrib && (
          <p className="icard__contributor">
            by <strong>@{contrib.handle}</strong>
            {contrib.verified && <span className="icard__verified">✓</span>}
          </p>
        )}
      </CardContent>

      <CardActions className="icard__grid-actions" sx={{ px: 2, pb: 2, pt: 1 }}>
        <Tooltip title={saved ? 'Remove from saved' : 'Save'} arrow>
          <IconButton onClick={handleSave} size="small" sx={{ color: saved ? '#B89ADC' : '#A855F7', mr: 'auto' }}>
            {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Button
          variant={cloned ? 'outlined' : 'contained'}
          size="small"
          startIcon={cloned ? <CheckIcon /> : <ContentCopyIcon />}
          onClick={handleClone}
          disabled={cloned}
          sx={{ fontSize: '0.75rem' }}
        >
          {cloned ? 'Cloned' : 'Clone'}
        </Button>
      </CardActions>
    </Card>
  );
}

