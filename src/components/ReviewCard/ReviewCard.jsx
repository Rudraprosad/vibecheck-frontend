import React from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import './ReviewCard.css';

export default function ReviewCard({ review }) {
  if (!review) return null;
  // Support both mock data and MongoDB populated data
  const userName = review.userName || review.userId?.name || '?';
  const rating = review.rating;
  const text = review.text || review.comment;
  const date = review.date || review.createdAt;
  const helpful = review.helpful || 0;
  const profileImageUrl = review.user?.profileImageUrl || review.userId?.profileImageUrl;

  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__user">
          <Avatar 
            src={profileImageUrl}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#B89ADC',
              fontSize: '1.125rem',
              fontWeight: 700,
              border: '2px solid #E9D5FF',
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <div>
            <p className="review-card__name">{userName}</p>
            <p className="review-card__date">{formatted}</p>
          </div>
        </div>
        <Rating value={rating} readOnly precision={0.5} size="small" />
      </div>
      <p className="review-card__text">{text}</p>
      <div className="review-card__footer">
        <button className="review-card__helpful" type="button">
          <ThumbUpIcon sx={{ fontSize: 13 }} />
          <span>Helpful ({helpful})</span>
        </button>
      </div>
    </div>
  );
}

