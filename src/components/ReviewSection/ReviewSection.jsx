import React, { useState, useEffect } from 'react';
import { Typography, Rating, TextField, Button, Avatar, Divider } from '@mui/material';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import './ReviewSection.css';

export default function ReviewSection({ itineraryId }) {
  const { user, showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/itineraries/${itineraryId}/reviews`);
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    if (itineraryId) fetchReviews();
  }, [itineraryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('You must be logged in to review.', 'error');
      return;
    }
    if (!text.trim()) {
      showToast('Review text is required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/itineraries/${itineraryId}/reviews`, { rating, text });
      if (res.data.success) {
        // Optimistically prepend the new review or use the backend populated one
        const newReview = {
          _id: res.data.data._id || Date.now(),
          rating,
          text,
          createdAt: new Date().toISOString(),
          userId: {
            _id: user._id,
            name: user.name,
            handle: user.handle,
            profileImageUrl: user.profileImageUrl
          }
        };
        setReviews([newReview, ...reviews]);
        setText('');
        setRating(5);
        showToast('Review submitted successfully!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="review-section">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Traveler Reviews
      </Typography>

      {/* Write a Review */}
      {user && (
        <form className="review-form" onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Write a review
          </Typography>
          <Rating 
            value={rating} 
            onChange={(event, newValue) => setRating(newValue || 1)} 
            size="medium" 
            sx={{ mb: 2 }}
          />
          <TextField
            multiline
            rows={3}
            placeholder="Share your experience with this itinerary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={submitting}
            sx={{ alignSelf: 'flex-start', bgcolor: '#7E22CE', '&:hover': { bgcolor: '#581C87' } }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}

      {/* Review List */}
      <div className="review-list">
        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No reviews yet. Be the first to review!
          </Typography>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <Avatar 
                  src={review.userId?.profileImageUrl} 
                  sx={{ width: 40, height: 40, mr: 2, bgcolor: '#E9D5FF', color: '#581C87' }}
                >
                  {review.userId?.name?.charAt(0) || '?'}
                </Avatar>
                <div>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {review.userId?.name || 'Unknown User'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </div>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </div>
              <Typography variant="body2" sx={{ mt: 1.5, color: '#374151', lineHeight: 1.6 }}>
                {review.text}
              </Typography>
              <Divider sx={{ mt: 3 }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
