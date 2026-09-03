import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import './BudgetBar.css';

const COST_CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', color: '#B89ADC' },
  { key: 'food',          label: 'Food & Drink',  color: '#22C55E' },
  { key: 'transport',     label: 'Transport',      color: '#F59E0B' },
  { key: 'activities',    label: 'Activities',     color: '#A855F7' },
  { key: 'misc',          label: 'Misc',           color: '#7E22CE' },
];

export default function BudgetBar({ breakdown = {}, total }) {
  const computedTotal = total || Object.values(breakdown).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="budget-bar">
      <div className="budget-bar__header">
        <span className="budget-bar__label">Budget Breakdown</span>
        <span className="budget-bar__total">${computedTotal.toLocaleString()}</span>
      </div>

      {/* Stacked colour bar */}
      <div className="budget-bar__track" role="img" aria-label="Budget breakdown bar">
        {COST_CATEGORIES.map(({ key, color }) => {
          const val = breakdown[key] || 0;
          const pct = computedTotal > 0 ? (val / computedTotal) * 100 : 0;
          if (pct === 0) return null;
          return (
            <Tooltip key={key} title={`${COST_CATEGORIES.find(c => c.key === key)?.label}: $${val}`} arrow>
              <div
                className="budget-bar__segment"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </Tooltip>
          );
        })}
      </div>

      {/* Legend */}
      <div className="budget-bar__legend">
        {COST_CATEGORIES.map(({ key, label, color }) => {
          const val = breakdown[key] || 0;
          if (val === 0) return null;
          const pct = computedTotal > 0 ? Math.round((val / computedTotal) * 100) : 0;
          return (
            <div key={key} className="budget-bar__legend-item">
              <span className="budget-bar__legend-dot" style={{ backgroundColor: color }} />
              <span className="budget-bar__legend-label">{label}</span>
              <span className="budget-bar__legend-val">${val.toLocaleString()}</span>
              <span className="budget-bar__legend-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
