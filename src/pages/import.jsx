import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Dropdown = ({ label, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-5 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}*
      </label>
      <div className="relative" ref={ref}>
        <div
          className="border px-4 py-2 rounded-md bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          onClick={() => setOpen(!open)}
        >
          <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
            {selected || `Select ${label}`}
          </span>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </div>
        {open && (
          <div className="absolute z-10 bg-white w-full border mt-1 rounded shadow-lg">
            <input
              type="text"
              placeholder={`Search ${label}`}
              className="w-full px-3 py-2 text-sm border-b outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="max-h-48 overflow-y-auto">
              {filtered.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-blue-50 text-sm cursor-pointer transition"
                  onClick={() => {
                    setSelected(item);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  {item}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-400 text-sm">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ImportCarForm = () => {
  const makes = [
    'Audi', 'Austin', 'BAIC', 'BAW', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'BYD', 'Cadillac', 'Chery', 'Chevrolet', 'Chrysler', 'Citroen', 'Classic Cars',
    'Daewoo', 'Daimler', 'Datsun', 'Deepal', 'DFSK', 'Dodge', 'Dongfeng', 'FAW', 'Ferrari', 'Fiat', 'Ford', 'GAC',
    'Geely', 'Genesis', 'GMC', 'Golden Dragon', 'Golf', 'GUGO', 'Haval', 'Hillman', 'Hino', 'Honri', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'JAC', 'Jaguar', 'Jaxeri',
    'Jeep', 'Jetour', 'Jinbei', 'JMC', 'JW Forland', 'Kaiser Jeep', 'KIA', 'Lada', 'Lamborghini', 'Land Rover', 'Lexus', 'Lifan', 'Lincoln', 'Maserati', 'Master', 'Mazda',
    'McLaren', 'Mercedes Benz', 'MG', 'MINI', 'Mitsubishi', 'Morris', 'Moto Guzzi', 'Mushtaq', 'Nissan', 'Oldsmobile', 'Opel', 'ORA', 'Peugeot', 'Plymouth', 'Polaris', 'Pontiac',
    'Porsche', 'Power', 'Prince', 'Proton', 'RAM', 'Range Rover', 'Renault', 'Rinco', 'Rolls Royce', 'Roma', 'Rover', 'Royal Enfield', 'Saab', 'Scion', 'Seres', 'Skoda', 'Smart', 'Sogo',
    'Sokon', 'SsangYong', 'Subaru', 'Tank', 'Tesla', 'Triumph', 'United', 'Vauxhall', 'Volkswagen', 'Volvo', 'Willys', 'Xiaomi', 'ZOTYE'
  ];
  const models = ['Model', 'A3', 'A4', 'A5', 'A6', 'A7', 'A1', 'A7', 'e-torn', 'e-torn GT', 'Other', 'Q2', 'Q3', 'Q4 e-torn', 'Q5', 'Q7', 'Q8', 'Q8 e-torn', 'R8', 'S5', 'TT','Other'];
  const years = Array.from({ length: 25 }, (_, i) => `${2000 + i}`);
  const cities = ["All Cities", "Abbottabad", "Abdul Hakeem", "Bahawalpur", "Chakwal", "Chenab Nagar", "Dera Gazi Khan", "Dera ismail Khan", "Faisalabad", "Gujranwala", "Gujrat", "Hyderabad", "Islamabad", "Jehlum", "Karachi", "Lahore", "Madina", "Mardan", "Mirpur Khas", "Multan", "Peshawar", "Rahim Yar Khan", "Rawalpindi", "Sahiwal", "Sargodha", "Sialkot", "Sakhar"];

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [mobile, setMobile] = useState('');
  const [updates, setUpdates] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      make,
      model,
      year,
      name,
      city,
      mobile,
      updates,
     
    });
    alert("Form submitted Successfully! ");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-xl space-y-5"
    >
      <h2 className="text-2xl text-sm font-bold text-left text-[#233d7b] mb-6">
        Import Favourite Car
      </h2>
      <div className="border-b-1 border-gray-200 mb-6"></div>

      <div className="grid md:grid-cols-2 gap-6">
        <Dropdown label="Make" options={makes} selected={make} setSelected={setMake} />
        <Dropdown label="Model" options={models} selected={model} setSelected={setModel} />
        <Dropdown label="Year" options={years} selected={year} setSelected={setYear} />

        <div className="mb-5 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter valid name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <Dropdown label="City" options={cities} selected={city} setSelected={setCity} />

        <div className="mb-5 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number*
          </label>
          <input
            type="tel"
            className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="03xxxxxxxxx"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          className="mt-1"
          checked={updates}
          onChange={() => setUpdates(!updates)}
        />
        <label className="text-sm text-gray-700">
          Send me updates and relevant news.
        </label>
      </div>

      <div className="flex items-start gap-2">
        <p className="text-sm text-gray-500">
          I authorize CHAUDHRY Cars Auction to share my contact information with its partners to
          get in touch with me through email, SMS or phone.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="bg-[#233d7b] text-white px-8 py-2 text-sm font-medium hover:bg-blue-900 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ImportCarForm;
