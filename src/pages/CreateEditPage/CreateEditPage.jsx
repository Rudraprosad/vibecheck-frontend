import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PublishIcon from '@mui/icons-material/Publish';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useApp } from '../../context/AppContext';
import { CATEGORY_META } from '../../data/mockData';
import api from '../../services/api';
import './CreateEditPage.css';

const TAGS = Object.keys(CATEGORY_META);
const ACTIVITY_TYPES = ['activity', 'food', 'transport', 'accommodation', 'misc'];

const emptyActivity = () => ({
  id:       `act-${Date.now()}-${Math.random()}`,
  time:     '',
  name:     '',
  location: '',
  cost:     '',
  type:     'activity',
  notes:    '',
});

const emptyDay = (dayNum) => ({
  day:        dayNum,
  title:      '',
  activities: [emptyActivity()],
  photos:     [],
});

const defaultForm = {
  title:       '',
  destination: '',
  country:     '',
  duration:    '',
  budget:      '',
  currency:    'USD',
  description: '',
  tags:        [],
  coverImage:  null,   // { url: string, file: File }
  days:        [emptyDay(1)],
};

export default function CreateEditPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user, getItinerary, createItinerary, updateItinerary } = useApp();

  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchItinerary = async () => {
        try {
          const res = await api.get(`/itineraries/${id}`);
          if (res.data.success) {
            const existing = res.data.data;
            setForm({
              title:       existing.title || '',
              destination: existing.destination || '',
              country:     existing.country || '',
              duration:    existing.duration || '',
              budget:      existing.budget || '',
              currency:    existing.currency || 'USD',
              description: existing.description || '',
              tags:        existing.tags || [],
              coverImage:  existing.coverImageUrl ? { url: existing.coverImageUrl, file: null } : null,
              days:        existing.days?.length > 0
                ? existing.days.map(d => ({
                    ...d,
                    photos:     d.photos || [],
                    activities: (d.activities || []).map(a => ({ ...a, cost: a.cost?.toString() || '' })),
                  }))
                : [emptyDay(1)],
            });
          }
        } catch (err) {
          console.error('Failed to load itinerary for editing', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchItinerary();
    }
  }, [id, isEdit]);

  /* ── Cover photo ── */
  const coverInputRef = useRef(null);
  const [coverDragOver, setCoverDragOver] = useState(false);

  const handleCoverFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setField('coverImage', { url, file });
  }, []);

  const handleCoverChange = (e) => {
    handleCoverFile(e.target.files[0]);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setCoverDragOver(false);
    handleCoverFile(e.dataTransfer.files[0]);
  };

  const removeCover = () => {
    if (form.coverImage?.url?.startsWith('blob:')) URL.revokeObjectURL(form.coverImage.url);
    setField('coverImage', null);
  };

  /* ── Day photos ── */
  const dayPhotoInputRefs = useRef({});

  const handleDayPhotos = (dayIdx, files) => {
    const newPhotos = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ url: URL.createObjectURL(f), file: f, id: `photo-${Date.now()}-${Math.random()}` }));
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx ? { ...d, photos: [...(d.photos || []), ...newPhotos] } : d
      ),
    }));
  };

  const removeDayPhoto = (dayIdx, photoId) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) => {
        if (i !== dayIdx) return d;
        const photo = d.photos.find(p => p.id === photoId);
        if (photo?.url?.startsWith('blob:')) URL.revokeObjectURL(photo.url);
        return { ...d, photos: d.photos.filter(p => p.id !== photoId) };
      }),
    }));
  };

  // Revoke all blob URLs on unmount
  useEffect(() => {
    return () => {
      if (form.coverImage?.url?.startsWith('blob:')) URL.revokeObjectURL(form.coverImage.url);
      form.days.forEach(d => (d.photos || []).forEach(p => {
        if (p.url?.startsWith('blob:')) URL.revokeObjectURL(p.url);
      }));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived: total cost from all activities
  const totalCost = form.days.reduce((acc, d) => {
    return acc + d.activities.reduce((a2, act) => a2 + (parseFloat(act.cost) || 0), 0);
  }, 0);

  /* ── Form field handlers ── */
  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  /* ── Day handlers ── */
  const addDay = () => {
    setForm(prev => ({
      ...prev,
      days: [...prev.days, emptyDay(prev.days.length + 1)],
    }));
  };

  const removeDay = (dayIdx) => {
    setForm(prev => ({
      ...prev,
      days: prev.days
        .filter((_, i) => i !== dayIdx)
        .map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const setDayField = (dayIdx, field, value) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d),
    }));
  };

  /* ── Activity handlers ── */
  const addActivity = (dayIdx) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx ? { ...d, activities: [...d.activities, emptyActivity()] } : d
      ),
    }));
  };

  const removeActivity = (dayIdx, actIdx) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx
          ? { ...d, activities: d.activities.filter((_, j) => j !== actIdx) }
          : d
      ),
    }));
  };

  const setActivityField = (dayIdx, actIdx, field, value) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              activities: d.activities.map((a, j) =>
                j === actIdx ? { ...a, [field]: value } : a
              ),
            }
          : d
      ),
    }));
  };

  /* ── Submit ── */
  const handleSubmit = async (status) => {
    setIsSubmitting(true);
    
    try {
      // 1. Upload Cover Image if it's a new blob
      let finalCoverUrl = form.coverImage?.url;
      if (form.coverImage?.url?.startsWith('blob:') && form.coverImage?.file) {
        const formData = new FormData();
        formData.append('image', form.coverImage.file);
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        finalCoverUrl = res.data.url;
      }

      // 2. Upload Day Photos
      const finalDays = await Promise.all(form.days.map(async (d) => {
        const uploadedPhotos = await Promise.all((d.photos || []).map(async (p) => {
          if (p.url?.startsWith('blob:') && p.file) {
            const formData = new FormData();
            formData.append('image', p.file);
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            return { url: res.data.url };
          }
          return { url: p.url }; // existing photo
        }));

        return {
          ...d,
          photos: uploadedPhotos,
          activities: d.activities.map(a => ({ ...a, cost: parseFloat(a.cost) || 0 })),
        };
      }));

      const payload = {
        ...form,
        duration:    parseInt(form.duration) || form.days.length,
        budget:      parseFloat(form.budget)  || totalCost,
        status,
        coverImageUrl: finalCoverUrl,
        days: finalDays,
      };

      if (isEdit) {
        await updateItinerary(id, payload);
        navigate(`/itinerary/${id}`);
      } else {
        await createItinerary(payload);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create page-enter">
      {/* ── Sticky top bar ── */}
      <div className="create__topbar">
        <div className="create__topbar-inner container">
          <button className="create__back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>{isEdit ? 'Back to itinerary' : 'Cancel'}</span>
          </button>
          <div className="create__topbar-title">
            <h1>{isEdit ? 'Edit Itinerary' : 'Create Itinerary'}</h1>
          </div>
          <div className="create__topbar-actions">
            <Button
              variant="outlined"
              size="small"
              startIcon={<SaveOutlinedIcon />}
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<PublishIcon />}
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="create__body container">
        {/* Left — form */}
        <div className="create__form">
          {/* Section: Details */}
          <section className="create__section" aria-labelledby="details-heading">
            <h2 id="details-heading" className="create__section-heading">Itinerary Details</h2>

            <div className="create__fields">
              <TextField
                id="create-title"
                label="Title"
                placeholder="e.g., 7-Day Bali Adventure"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                fullWidth
                required
              />
              <TextField
                id="create-description"
                label="Description"
                placeholder="Briefly describe the itinerary, who it's best for, and what makes it special..."
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <div className="create__row">
                <TextField
                  id="create-destination"
                  label="Destination"
                  placeholder="e.g., Bali"
                  value={form.destination}
                  onChange={e => setField('destination', e.target.value)}
                  sx={{ flex: 1.5 }}
                />
                <TextField
                  id="create-country"
                  label="Country"
                  placeholder="e.g., Indonesia"
                  value={form.country}
                  onChange={e => setField('country', e.target.value)}
                  sx={{ flex: 1.5 }}
                />
                <TextField
                  id="create-budget"
                  label="Total Budget"
                  placeholder="1200"
                  type="number"
                  value={form.budget}
                  onChange={e => setField('budget', e.target.value)}
                  InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 0.5, color: '#A855F7', fontSize: 16 }} /> }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  id="create-duration"
                  label="Duration (days)"
                  placeholder={form.days.length.toString()}
                  type="number"
                  value={form.duration}
                  onChange={e => setField('duration', e.target.value)}
                  sx={{ flex: 1 }}
                />
              </div>

              {/* Tags */}
              <div className="create__field-group">
                <label className="create__label">Travel Type</label>
                <div className="create__tag-grid">
                  {TAGS.map(tag => {
                    const active = form.tags.includes(tag);
                    const meta   = CATEGORY_META[tag];
                    return (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={() => toggleTag(tag)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          color:           active ? meta.color  : '#7E22CE',
                          backgroundColor: active ? meta.bg     : 'transparent',
                          border:          `1px solid ${active ? meta.color + '40' : '#E9D5FF'}`,
                          transition: 'all 150ms ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cover photo */}
            <div className="create__field-group">
              <label className="create__label">Cover Photo</label>
              {form.coverImage ? (
                <div className="create__cover-preview">
                  <img src={form.coverImage.url} alt="Cover preview" className="create__cover-img" />
                  <button
                    className="create__cover-remove"
                    onClick={removeCover}
                    type="button"
                    aria-label="Remove cover photo"
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </button>
                  <button
                    className="create__cover-change"
                    onClick={() => coverInputRef.current?.click()}
                    type="button"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <div
                  className={`create__cover-dropzone${coverDragOver ? ' create__cover-dropzone--over' : ''}`}
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                  onDragLeave={() => setCoverDragOver(false)}
                  onDrop={handleCoverDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload cover photo"
                  onKeyDown={(e) => e.key === 'Enter' && coverInputRef.current?.click()}
                >
                  <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 28, color: '#3F3F46' }} />
                  <span className="create__dropzone-text">Click or drag to upload a cover photo</span>
                  <span className="create__dropzone-sub">JPG, PNG, WEBP · Max 10 MB</span>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverChange}
                aria-label="Cover photo file input"
              />
            </div>
          </section>

          <Divider sx={{ borderColor: '#E9D5FF', my: 1 }} />

          {/* Section: Days */}
          <section className="create__section" aria-labelledby="days-heading">
            <h2 id="days-heading" className="create__section-heading">Daily Activities</h2>

            <div className="create__days">
              {form.days.map((day, dayIdx) => (
                <div key={dayIdx} className="create__day">
                  <div className="create__day-header">
                    <span className="create__day-label">Day {day.day}</span>
                    <TextField
                      id={`day-${dayIdx}-title`}
                      placeholder="Day title (optional)"
                      value={day.title}
                      onChange={e => setDayField(dayIdx, 'title', e.target.value)}
                      size="small"
                      sx={{ flex: 1, mx: 1.5 }}
                      variant="standard"
                      InputProps={{
                        disableUnderline: false,
                        sx: { color: '#2E1065', fontSize: '0.875rem', '&:before': { borderColor: '#E9D5FF' }, '&:after': { borderColor: '#B89ADC' } },
                      }}
                    />
                    {form.days.length > 1 && (
                      <Tooltip title="Remove day" arrow>
                        <IconButton
                          size="small"
                          onClick={() => removeDay(dayIdx)}
                          sx={{ color: '#A855F7', '&:hover': { color: '#EF4444' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>

                  {/* Day photos strip */}
                  {(day.photos?.length > 0) && (
                    <div className="create__day-photos">
                      {(day.photos || []).map(photo => (
                        <div key={photo.id || photo._id || Math.random()} className="create__day-photo-thumb">
                          <img src={photo.url} alt="Day photo" />
                          <button
                            className="create__day-photo-remove"
                            onClick={() => removeDayPhoto(dayIdx, photo.id)}
                            type="button"
                            aria-label="Remove photo"
                          >
                            <CloseIcon sx={{ fontSize: 11 }} />
                          </button>
                        </div>
                      ))}
                      <button
                        className="create__day-photo-add"
                        onClick={() => dayPhotoInputRefs.current[dayIdx]?.click()}
                        type="button"
                        aria-label="Add more photos"
                      >
                        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 18, color: '#52525B' }} />
                      </button>
                    </div>
                  )}

                  <div className="create__activities">
                    {(day.activities || []).map((act, actIdx) => (
                      <div key={act.id || act._id || Math.random()} className="create__activity-row">
                        <DragIndicatorIcon sx={{ fontSize: 16, color: '#E9D5FF', flexShrink: 0 }} />

                        <TextField
                          id={`act-${dayIdx}-${actIdx}-time`}
                          placeholder="09:00"
                          value={act.time}
                          onChange={e => setActivityField(dayIdx, actIdx, 'time', e.target.value)}
                          size="small"
                          sx={{ width: 80, flexShrink: 0 }}
                          inputProps={{ 'aria-label': 'Activity time' }}
                        />

                        <FormControl size="small" sx={{ width: 120, flexShrink: 0 }}>
                          <Select
                            value={act.type}
                            onChange={e => setActivityField(dayIdx, actIdx, 'type', e.target.value)}
                            inputProps={{ 'aria-label': 'Activity type' }}
                          >
                            {ACTIVITY_TYPES.map(t => (
                              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                                {t}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          id={`act-${dayIdx}-${actIdx}-name`}
                          placeholder="Activity name"
                          value={act.name}
                          onChange={e => setActivityField(dayIdx, actIdx, 'name', e.target.value)}
                          size="small"
                          sx={{ flex: 2 }}
                          inputProps={{ 'aria-label': 'Activity name' }}
                        />

                        <TextField
                          id={`act-${dayIdx}-${actIdx}-location`}
                          placeholder="Location"
                          value={act.location}
                          onChange={e => setActivityField(dayIdx, actIdx, 'location', e.target.value)}
                          size="small"
                          sx={{ flex: 1.2 }}
                          inputProps={{ 'aria-label': 'Activity location' }}
                        />

                        <TextField
                          id={`act-${dayIdx}-${actIdx}-cost`}
                          placeholder="$0"
                          type="number"
                          value={act.cost}
                          onChange={e => setActivityField(dayIdx, actIdx, 'cost', e.target.value)}
                          size="small"
                          sx={{ width: 80, flexShrink: 0 }}
                          inputProps={{ 'aria-label': 'Activity cost' }}
                        />

                        {day.activities.length > 1 && (
                          <Tooltip title="Remove activity" arrow>
                            <IconButton
                              size="small"
                              onClick={() => removeActivity(dayIdx, actIdx)}
                              sx={{ color: '#A855F7', flexShrink: 0, '&:hover': { color: '#EF4444' } }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    ))}

                    <button
                      className="create__add-activity-btn"
                      onClick={() => addActivity(dayIdx)}
                      type="button"
                    >
                      <AddIcon sx={{ fontSize: 15 }} />
                      Add Activity
                    </button>

                    {/* Add photos button (shown when no photos yet) */}
                    {(!day.photos || day.photos.length === 0) && (
                      <button
                        className="create__add-activity-btn create__add-photo-btn"
                        onClick={() => dayPhotoInputRefs.current[dayIdx]?.click()}
                        type="button"
                      >
                        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 15 }} />
                        Add Day Photos
                      </button>
                    )}
                    <input
                      ref={el => dayPhotoInputRefs.current[dayIdx] = el}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => handleDayPhotos(dayIdx, e.target.files)}
                      aria-label={`Day ${day.day} photos`}
                    />
                  </div>
                </div>
              ))}

              <button className="create__add-day-btn" onClick={addDay} type="button">
                <AddIcon sx={{ fontSize: 16 }} />
                Add Day
              </button>
            </div>
          </section>
        </div>

        {/* Right — summary sidebar */}
        <aside className="create__sidebar" aria-label="Cost summary">
          <div className="create__sidebar-card">
            <h3 className="create__sidebar-heading">Cost Summary</h3>

            <div className="create__cost-total">
              <span className="create__cost-total-val">
                ${totalCost.toFixed(2)}
              </span>
              <span className="create__cost-total-label">estimated total</span>
            </div>

            <Divider sx={{ borderColor: '#E9D5FF', my: 2 }} />

            <div className="create__cost-breakdown">
              {form.days.map((d, i) => {
                const dayCost = d.activities.reduce((a, act) => a + (parseFloat(act.cost) || 0), 0);
                if (dayCost === 0) return null;
                return (
                  <div key={i} className="create__cost-row">
                    <span className="create__cost-label">Day {d.day}</span>
                    <span className="create__cost-val">${dayCost.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <Divider sx={{ borderColor: '#E9D5FF', my: 2 }} />

            <div className="create__sidebar-meta">
              <div className="create__meta-row">
                <span>Days planned</span>
                <span>{form.days.length}</span>
              </div>
              <div className="create__meta-row">
                <span>Activities</span>
                <span>
                  {form.days.reduce((acc, d) => acc + (d.activities || []).filter(a => a.name).length, 0)}
                </span>
              </div>
              <div className="create__meta-row">
                <span>Tags</span>
                <span>{form.tags.length > 0 ? form.tags.join(', ') : '—'}</span>
              </div>
            </div>
          </div>

          <div className="create__sidebar-actions">
            <Button
              variant="outlined"
              fullWidth
              startIcon={<SaveOutlinedIcon />}
              onClick={() => handleSubmit('draft')}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PublishIcon />}
              onClick={() => handleSubmit('published')}
              sx={{ borderRadius: '10px', py: 1.25, fontWeight: 700 }}
            >
              Publish Itinerary
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
