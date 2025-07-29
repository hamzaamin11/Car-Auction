const Card = ({ icon, title, totalData, color }) => {
  return (
    <div
      className={`rounded-xl p-5 shadow-md text-white flex items-center gap-4 hover:scale-105 transition-transform duration-200 ${color}`}
    >
      <div className="bg-white p-2 rounded-full text-[#191970]">{icon}</div>
      <div>
        <h3 className="text-md">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{totalData}</p>
      </div>
    </div>
  );
};

export default Card;
