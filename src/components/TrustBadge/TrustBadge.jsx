import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PeopleIcon from '@mui/icons-material/People';
import './TrustBadge.css';

export default function TrustBadge({ contributor, compact = false }) {
  if (!contributor) return null;
  const { name, handle, tripCount, followers, verified } = contributor;

  if (compact) {
    return (
      <div className="trust-badge trust-badge--compact">
        <Avatar 
          src={contributor.profileImageUrl}
          sx={{ width: 24, height: 24, bgcolor: '#E9D5FF', fontSize: '0.7rem', fontWeight: 700, color: '#581C87' }}
        >
          {name.charAt(0)}
        </Avatar>
        <span className="trust-badge__handle-sm">@{handle}</span>
        {verified && (
          <Tooltip title="Verified contributor" arrow>
            <VerifiedIcon sx={{ fontSize: 14, color: '#B89ADC' }} />
          </Tooltip>
        )}
      </div>
    );
  }

  return (
    <div className="trust-badge">
      <Avatar 
        src={contributor.profileImageUrl}
        sx={{
          width: 44,
          height: 44,
          bgcolor: '#E9D5FF',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#581C87',
          border: '2px solid #D8B4FE',
        }}
      >
        {name.charAt(0)}
      </Avatar>
      <div className="trust-badge__info">
        <div className="trust-badge__name-row">
          <span className="trust-badge__name">{name}</span>
          {verified && (
            <Tooltip title="Verified contributor" arrow>
              <VerifiedIcon sx={{ fontSize: 16, color: '#B89ADC' }} />
            </Tooltip>
          )}
        </div>
        <span className="trust-badge__handle">@{handle}</span>
      </div>
      <div className="trust-badge__stats">
        <div className="trust-badge__stat">
          <FlightTakeoffIcon sx={{ fontSize: 14, color: '#A855F7' }} />
          <span className="trust-badge__stat-val">{tripCount}</span>
          <span className="trust-badge__stat-label">trips</span>
        </div>
        <div className="trust-badge__stat">
          <PeopleIcon sx={{ fontSize: 14, color: '#A855F7' }} />
          <span className="trust-badge__stat-val">{(followers || 0).toLocaleString()}</span>
          <span className="trust-badge__stat-label">followers</span>
        </div>
      </div>
    </div>
  );
}

