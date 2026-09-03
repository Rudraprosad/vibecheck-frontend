import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TuneIcon from '@mui/icons-material/Tune';
import ItineraryCard from '../../components/ItineraryCard/ItineraryCard';
import { CATEGORY_META } from '../../data/mockData';
import api from '../../services/api';
import './SearchPage.css';

const REGIONS = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
const TAGS    = Object.keys(CATEGORY_META);
const SORT_OPTIONS = [
  { value: 'rating',    label: 'Highest Rated'  },
  { value: 'clones',    label: 'Most Cloned'    },
  { value: 'budget-lo', label: 'Budget: Low–High' },
  { value: 'budget-hi', label: 'Budget: High–Low' },
  { value: 'duration',  label: 'Duration'        },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [locationQ, setLocationQ]   = useState(searchParams.get('location') || '');
  const [budgetRange, setBudgetRange] = useState([0, 5000]);
  const [durationRange, setDurationRange] = useState([1, 21]);
  const [selectedTags, setSelectedTags]   = useState(
    searchParams.get('tag') ? [searchParams.get('tag')] : []
  );
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sortBy, setSortBy]   = useState(searchParams.get('sort') || 'rating');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
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

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleRegion = (region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const clearAll = () => {
    setLocationQ('');
    setBudgetRange([0, 5000]);
    setDurationRange([1, 21]);
    setSelectedTags([]);
    setSelectedRegions([]);
    setSortBy('rating');
    setSearchParams({});
  };

  const results = useMemo(() => {
    let filtered = [...itineraries];

    if (locationQ.trim()) {
      const q = locationQ.toLowerCase();
      filtered = filtered.filter(it =>
        it.destination.toLowerCase().includes(q) ||
        it.country.toLowerCase().includes(q) ||
        it.title.toLowerCase().includes(q)
      );
    }

    filtered = filtered.filter(it =>
      it.budget >= budgetRange[0] && it.budget <= budgetRange[1]
    );

    filtered = filtered.filter(it =>
      it.duration >= durationRange[0] && it.duration <= durationRange[1]
    );

    if (selectedTags.length > 0) {
      filtered = filtered.filter(it =>
        selectedTags.some(tag => it.tags?.includes(tag))
      );
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter(it => selectedRegions.includes(it.region));
    }

    switch (sortBy) {
      case 'rating':    filtered.sort((a, b) => (b.rating||0) - (a.rating||0));       break;
      case 'clones':    filtered.sort((a, b) => (b.cloneCount||0) - (a.cloneCount||0)); break;
      case 'budget-lo': filtered.sort((a, b) => a.budget - b.budget);        break;
      case 'budget-hi': filtered.sort((a, b) => b.budget - a.budget);        break;
      case 'duration':  filtered.sort((a, b) => a.duration - b.duration);    break;
    }

    return filtered;
  }, [itineraries, locationQ, budgetRange, durationRange, selectedTags, selectedRegions, sortBy]);

  const activeFilterCount =
    (locationQ ? 1 : 0) +
    (selectedTags.length) +
    (selectedRegions.length) +
    (budgetRange[0] > 0 || budgetRange[1] < 5000 ? 1 : 0) +
    (durationRange[0] > 1 || durationRange[1] < 21 ? 1 : 0);

  const renderFilterPanel = () => (
    <aside className="search__filters" aria-label="Search filters">
      <div className="search__filters-header">
        <span className="search__filters-title">Filters</span>
        {activeFilterCount > 0 && (
          <button className="search__clear-btn" onClick={clearAll}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Location */}
      <div className="search__filter-group">
        <label className="search__filter-label">Destination</label>
        <TextField
          id="filter-location"
          placeholder="Country or city..."
          value={locationQ}
          onChange={e => setLocationQ(e.target.value)}
          size="small"
          fullWidth
        />
      </div>

      {/* Budget */}
      <div className="search__filter-group">
        <label className="search__filter-label">
          Budget (USD)
          <span className="search__filter-range">
            ${budgetRange[0].toLocaleString()} – ${budgetRange[1].toLocaleString()}
          </span>
        </label>
        <Slider
          value={budgetRange}
          onChange={(_, v) => setBudgetRange(v)}
          min={0}
          max={5000}
          step={50}
          disableSwap
          aria-label="Budget range"
        />
      </div>

      {/* Duration */}
      <div className="search__filter-group">
        <label className="search__filter-label">
          Duration
          <span className="search__filter-range">
            {durationRange[0]}–{durationRange[1]} days
          </span>
        </label>
        <Slider
          value={durationRange}
          onChange={(_, v) => setDurationRange(v)}
          min={1}
          max={21}
          step={1}
          disableSwap
          aria-label="Duration range"
        />
      </div>

      {/* Tags */}
      <div className="search__filter-group">
        <label className="search__filter-label">Travel Type</label>
        <div className="search__tag-grid">
          {TAGS.map(tag => {
            const active  = selectedTags.includes(tag);
            const meta    = CATEGORY_META[tag];
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
                  color:            active ? meta.color  : '#7E22CE',
                  backgroundColor:  active ? meta.bg     : 'transparent',
                  border:           `1px solid ${active ? meta.color + '40' : '#E9D5FF'}`,
                  transition: 'all 150ms ease',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Regions */}
      <div className="search__filter-group">
        <label className="search__filter-label">Region</label>
        <div className="search__region-list">
          {REGIONS.map(region => (
            <label key={region} className="search__region-item">
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => toggleRegion(region)}
                className="search__checkbox"
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="search page-enter">
      <div className="search__layout container">
        {/* Desktop sidebar */}
        <div className="search__sidebar-desktop">
          {renderFilterPanel()}
        </div>

        {/* Main content */}
        <div className="search__main">
          <div className="search__topbar">
            <div className="search__result-info">
              <span className="search__result-count">{results.length}</span>
              <span className="search__result-label">
                {results.length === 1 ? 'itinerary found' : 'itineraries found'}
              </span>
            </div>

            <div className="search__controls">
              {/* Mobile filter toggle */}
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="search__filter-toggle"
                size="small"
                sx={{ display: { md: 'none' } }}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  label="Sort by"
                  onChange={e => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Mobile filter panel */}
          {mobileFiltersOpen && (
            <div className="search__mobile-filters">
              {renderFilterPanel()}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="search__empty">
              <p className="search__empty-title">Loading itineraries...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search__empty">
              <p className="search__empty-title">No itineraries match your filters</p>
              <p className="search__empty-sub">Try widening your budget range or removing some filters.</p>
              <Button variant="outlined" size="small" onClick={clearAll} sx={{ mt: 2 }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="search__results">
              {results.map(it => (
                <ItineraryCard key={it._id || it.id} itinerary={it} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
