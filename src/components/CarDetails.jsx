
export default function CarDetails({ car }) {
  return (
    <div className="mt-4 bg-white p-4 rounded shadow">
      <p className="text-lg font-semibold">{car.rating}/10</p>
      <p>{car.city}</p>
      <p>
        {car.year} {car.km} {car.fuel} {car.engine} {car.transmission}
      </p>
      <p className="text-sm text-gray-500">Updated {car.updated}</p>
    </div>
  );
}
