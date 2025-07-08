
// src/components/DarkModeToggle.jsx
export default function DarkModeToggle() {
  return (
    <button
      className="absolute top-4 right-4 p-2 border rounded"
      onClick={() => document.documentElement.classList.toggle("dark")}
    >
      Toggle Dark Mode
    </button>
  );
}
