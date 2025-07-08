
import React, { useState } from 'react';
import FilterControls from './FilterControls';
import VehicleList from './VehicleList';

const vehicleData = [
  {
    make: 'Toyota',
    model: 'Corolla X',
    year: '2022',
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '32,000 km',
    color: 'Silver',
    image: '/card1slide1.jpg',
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: '2021',
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: '20,000 km',
    color: 'White',
    image: '/card1slide2.jpg',
  },
  {
    make: 'Suzuki',
    model: 'Alto',
    year: '2020',
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '15,000 km',
    color: 'Blue',
    image: '/card1slide3.jpg',
  },
];

const FilteredVehiclePage = () => {
  const [filters, setFilters] = useState({
    make: '',
    year: '',
    transmission: '',
  });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredVehicles = vehicleData.filter((v) => {
    return (
      (!filters.make || v.make === filters.make) &&
      (!filters.year || v.year === filters.year) &&
      (!filters.transmission || v.transmission === filters.transmission)
    );
  });

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Find Your Ideal Car</h1>
      <FilterControls filters={filters} onChange={handleFilterChange} />
      <VehicleList vehicles={filteredVehicles} />
    </div>
  );
};

export default FilteredVehiclePage;
