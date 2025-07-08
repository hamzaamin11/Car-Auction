
import React from 'react';

const FilterControls = ({ filters, onChange }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <select value={filters.make} onChange={(e) => onChange('make', e.target.value)} className="p-2 border rounded">
        <option value="">Select Make</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Suzuki">Suzuki</option>
      </select>

      <select value={filters.year} onChange={(e) => onChange('year', e.target.value)} className="p-2 border rounded">
        <option value="">Select Year</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <select value={filters.transmission} onChange={(e) => onChange('transmission', e.target.value)} className="p-2 border rounded">
        <option value="">Transmission</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
    </div>
  );
};

export default FilterControls;
