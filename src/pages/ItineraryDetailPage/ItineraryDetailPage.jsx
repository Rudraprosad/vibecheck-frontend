import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlaceIcon from '@mui/icons-material/Place';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrustBadge from '../../components/TrustBadge/TrustBadge';
import BudgetBar from '../../components/BudgetBar/BudgetBar';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { CATEGORY_META } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import './ItineraryDetailPage.css';

const ACTIVITY_ICONS = {
  transport: <DirectionsBusIcon sx={{ fontSize: 14 }} />,
  accommodation: <HotelIcon sx={{ fontSize: 14 }} />,
  food: <RestaurantOutlinedIcon sx={{ fontSize: 14 }} />,
  activity: <LocalActivityIcon sx={{ fontSize: 14 }} />,
  misc: <MoreHorizIcon sx={{ fontSize: 14 }} />,
};

function TabPanel({ children, value, index }) {
  return value === index ? <div role="tabpanel">{children}</div> : null;
}

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    user, 
    cloneItinerary, 
    saveItinerary, 
    isSaved,
    toggleFollowUser,
    isFollowing 
  } = useApp();

  const [itinerary, setItinerary] = useState(null);
  const [itinReviews, setItinReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itinRes, reviewsRes] = await Promise.all([
          api.get(`/itineraries/${id}`),
          api.get(`/itineraries/${id}/reviews`)
        ]);
        if (itinRes.data.success) setItinerary(itinRes.data.data);
        if (reviewsRes.data.success) setItinReviews(reviewsRes.data.reviews);
      } catch (error) {
        console.error('Error fetching itinerary details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('You must be logged in to review.', 'error');
      return;
    }
    if (!reviewText.trim()) {
      showToast('Review text is required.', 'error');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await api.post(`/itineraries/${id}/reviews`, { rating: reviewRating, text: reviewText });
      if (res.data.success) {
        const newReview = {
          _id: res.data.data._id || Date.now(),
          rating: reviewRating,
          text: reviewText,
          createdAt: new Date().toISOString(),
          userId: {
            _id: user._id,
            name: user.name,
            handle: user.handle,
            profileImageUrl: user.profileImageUrl
          }
        };
        setItinReviews([newReview, ...itinReviews]);
        setReviewText('');
        setReviewRating(5);
        showToast('Review submitted successfully!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="detail__not-found container page-enter"><p>Loading...</p></div>;
  }

  if (!itinerary) {
    return (
      <div className="detail__not-found container page-enter">
        <p className="detail__not-found-title">Itinerary not found</p>
        <Button variant="outlined" onClick={() => navigate('/search')} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to search
        </Button>
      </div>
    );
  }

  const {
    title, destination, country, duration, budget, currency = 'USD',
    tags = [], primaryTag, rating, reviewCount = 0, cloneCount = 0,
    contributorId, description, budgetBreakdown = {}, days = [],
    coverImageUrl,
  } = itinerary;

  const saved = isSaved(id);
  const meta = CATEGORY_META[primaryTag] || CATEGORY_META['City'];
  const contrib = contributorId && typeof contributorId === 'object' ? contributorId : null;
  const contribIdStr = contrib ? (contrib._id || contrib.id || '').toString() : '';
  const isOwner = !!(user && contribIdStr && user._id?.toString() === contribIdStr);
  const cloned = false; // Assuming we check clone lineage differently later

  const handleClone = () => cloneItinerary(id);
  const handleSave = () => saveItinerary(id);

  return (
    <div className="detail page-enter">
      {/* ── Header bar ── */}
      <div className="detail__header-bar">
        <div className="detail__header-inner container">
          {/* Back */}
          <button className="detail__back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Back</span>
          </button>

          <div className="detail__header-meta">
            {/* Category accent strip */}
            <div className="detail__accent" style={{ backgroundColor: meta.color }} />
            <div className="detail__header-text">
              <div className="detail__tags-row">
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: CATEGORY_META[tag]?.color || '#581C87',
                      backgroundColor: CATEGORY_META[tag]?.bg || 'rgba(161,161,170,0.08)',
                      border: 'none',
                    }}
                  />
                ))}
              </div>
              <h1 className="detail__title">{title}</h1>
              <div className="detail__subtitle-row">
                <PlaceIcon sx={{ fontSize: 15, color: '#7E22CE' }} />
                <span className="detail__location">{destination}, {country}</span>
                <span className="detail__dot">·</span>
                <AccessTimeIcon sx={{ fontSize: 13, color: '#7E22CE' }} />
                <span className="detail__meta-val">{duration} days</span>
                <span className="detail__dot">·</span>
                <AttachMoneyIcon sx={{ fontSize: 16, color: '#7E22CE' }} />
                <span className="detail__meta-val">{(budget || 0).toLocaleString()} {currency}</span>
                <span className="detail__dot">·</span>
                <Rating value={rating} readOnly precision={0.1} size="small" sx={{ ml: 0.5 }} />
                <span className="detail__rating-val">{rating?.toFixed(1)}</span>
                <span className="detail__review-count">({reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="detail__header-actions">
            {isOwner && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(`/edit/${id}`)}
              >
                Edit
              </Button>
            )}
            <Tooltip title={saved ? 'Remove from saved' : 'Save itinerary'} arrow>
              <IconButton onClick={handleSave} sx={{ color: saved ? '#B89ADC' : '#A855F7' }}>
                {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant={cloned ? 'outlined' : 'contained'}
              startIcon={cloned ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleClone}
              disabled={cloned}
              size="small"
            >
              {cloned ? 'Cloned' : 'Clone Itinerary'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Cover photo hero ── */}
      {coverImageUrl && (
        <div className="detail__cover">
          <img src={coverImageUrl} alt={`${title} cover`} className="detail__cover-img" />
          <div className="detail__cover-gradient" />
        </div>
      )}
      {/* ── Body ── */}
      <div className="detail__body container">
        {/* Left column */}
        <div className="detail__left">
          {/* Description */}
          {description && (
            <p className="detail__description">{description}</p>
          )}

          {/* Tabs */}
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Itinerary sections">
            <Tab id="tab-itinerary" label="Itinerary" />
            <Tab id="tab-reviews" label={`Reviews (${itinReviews.length || reviewCount})`} />
          </Tabs>

          {/* Tab 0 — Day timeline */}
          <TabPanel value={tab} index={0}>
            <div className="detail__days">
              {days.map(({ day, title: dayTitle, activities = [], photos = [] }) => (
                <div key={day} className="detail__day">
                  <div className="detail__day-header">
                    <span className="detail__day-label">Day {day}</span>
                    {dayTitle && <span className="detail__day-title">{dayTitle}</span>}
                  </div>
                  <div className="detail__activities">
                    {activities.map(act => (
                      <div key={act._id || act.id} className="detail__activity">
                        <div className="detail__activity-time">{act.time}</div>
                        <div className="detail__activity-line">
                          <div className="detail__activity-dot" />
                        </div>
                        <div className="detail__activity-body">
                          <div className="detail__activity-top">
                            <span className="detail__activity-icon">
                              {ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.misc}
                            </span>
                            <span className="detail__activity-name">{act.name}</span>
                            {act.cost > 0 && (
                              <span className="detail__activity-cost">${act.cost}</span>
                            )}
                          </div>
                          <div className="detail__activity-bottom">
                            <PlaceIcon sx={{ fontSize: 12, color: '#A855F7' }} />
                            <span className="detail__activity-location">{act.location}</span>
                          </div>
                          {act.notes && (
                            <p className="detail__activity-notes">{act.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Day photos */}
                  {photos.length > 0 && (
                    <div className="detail__day-photos">
                      {photos.map(photo => (
                        <img
                          key={photo._id || photo.id}
                          src={photo.url}
                          alt="Day photo"
                          className="detail__day-photo"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tab 1 — Reviews */}
          <TabPanel value={tab} index={1}>
            <div className="detail__reviews" style={{ padding: '24px 0' }}>
              {user && (
                <form 
                  onSubmit={handleReviewSubmit} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', padding: '24px', backgroundColor: '#FAFAFA', borderRadius: '12px', border: '1px solid #F3F4F6' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Write a review</Typography>
                  <Rating 
                    value={reviewRating} 
                    onChange={(_, newValue) => setReviewRating(newValue || 1)} 
                    size="medium" 
                  />
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={submittingReview}
                    sx={{ alignSelf: 'flex-start', bgcolor: '#7E22CE', '&:hover': { bgcolor: '#581C87' } }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              )}
              
              {itinReviews.length === 0 ? (
                <p className="detail__no-reviews">No reviews yet. Be the first to clone and review this itinerary.</p>
              ) : (
                itinReviews.map(r => <ReviewCard key={r._id || r.id} review={r} />)
              )}
            </div>
          </TabPanel>
        </div>

        {/* Right column — sidebar */}
        <aside className="detail__sidebar" aria-label="Itinerary sidebar">
          {/* Contributor */}
          {contrib && (
            <div className="detail__sidebar-section">
              <h3 className="detail__sidebar-heading">Contributor</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <TrustBadge contributor={contrib} />
                {!isOwner && user && contrib && (
                  <Button
                    variant={isFollowing(contribIdStr) ? "outlined" : "contained"}
                    size="small"
                    onClick={() => toggleFollowUser(contribIdStr)}
                    sx={{ 
                      alignSelf: 'flex-start', 
                      borderRadius: 6, 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      borderColor: '#D8B4FE', 
                      color: isFollowing(contribIdStr) ? '#7E22CE' : '#fff', 
                      backgroundColor: isFollowing(contribIdStr) ? 'transparent' : '#7E22CE', 
                      '&:hover': { 
                        backgroundColor: isFollowing(contribIdStr) ? '#F3E8FF' : '#581C87', 
                        borderColor: '#C084FC' 
                      } 
                    }}
                  >
                    {isFollowing(contribIdStr) ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Budget */}
          {Object.keys(budgetBreakdown).length > 0 && (
            <div className="detail__sidebar-section">
              <h3 className="detail__sidebar-heading">Budget</h3>
              <BudgetBar breakdown={budgetBreakdown} total={budget} />
            </div>
          )}

          {/* Quick stats */}
          <div className="detail__sidebar-section">
            <h3 className="detail__sidebar-heading">At a glance</h3>
            <div className="detail__stats-grid">
              <div className="detail__stat-item">
                <span className="detail__stat-val">{(cloneCount || 0).toLocaleString()}</span>
                <span className="detail__stat-label">Clones</span>
              </div>
              <div className="detail__stat-item">
                <span className="detail__stat-val">{(reviewCount || 0).toLocaleString()}</span>
                <span className="detail__stat-label">Reviews</span>
              </div>
              <div className="detail__stat-item">
                <span className="detail__stat-val">{days.length}</span>
                <span className="detail__stat-label">Days</span>
              </div>
              <div className="detail__stat-item">
                <span className="detail__stat-val">
                  {days.reduce((acc, d) => acc + d.activities.length, 0)}
                </span>
                <span className="detail__stat-label">Activities</span>
              </div>
            </div>
          </div>

          {/* Clone CTA */}
          {!cloned && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<ContentCopyIcon />}
              onClick={handleClone}
              sx={{ borderRadius: '10px', py: 1.25, fontWeight: 700 }}
            >
              Clone this Itinerary
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}

