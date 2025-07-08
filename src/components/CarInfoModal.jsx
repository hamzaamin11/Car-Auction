
export default function CarInfoModal({ car, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4">{car.name}</h3>
        <p className="mb-4">{car.details}</p>
        <h4 className="text-xl font-semibold mb-2">Features:</h4>
        <ul className="list-disc list-inside space-y-1">
          {car.features.map((feat, i) => (
            <li key={i}>{feat}</li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
