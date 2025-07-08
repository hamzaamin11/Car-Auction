import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const specs = [
  ["Overall Length", "4191 mm"],
  ["Kerb Weight", "1325 KG"],
  ["Overall Width", "1794 mm"],
  ["Boot Space", "405 L"],
  ["Overall Height", "1508 mm"],
  ["Seating Capacity", "5 persons"],
  ["Wheel Base", "2601 mm"],
  ["No. of Doors", "4 doors"],
  ["Ground Clearance", "145 mm"],
];

const engineSpecs = [
  ["Engine Type", "Petrol"],
  ["Turbo Charger", "-"],
  ["Displacement", "999 cc"],
  ["No. of Cylinders", "3"],
  ["Drive Train", "FWD"],
  ["Cylinder Configuration", "In-Line"],
  ["Horse Power", "116 HP @ 5500 RPM"],
  ["Compression Ratio", "10.5:1"],
  ["Torque", "200 Nm @ 2000 RPM"],
  ["Valves per Cylinder", "4"],
  ["Fuel System", "EFI"],
  ["Valve Mechanism", "DOHC"],
  ["Max Speed", "190 KM/H"],
];

const features = [
  { name: "No. of Airbags", value: 6, type: "number" },
  { name: "Speed Sensing Auto Door Lock", value: true, type: "boolean" },
  { name: "No. of Seatbelts", value: 5, type: "number" },
  { name: "Anti-Theft Alarm System", value: true, type: "boolean" },
  { name: "Driver Seat Belt Warning", value: true, type: "boolean" },
  { name: "Down Hill Assist Control", value: false, type: "boolean" },
  { name: "Passenger Seat Belt Warning", value: "false", type: "boolean" },
  { name: "Hill Start Assist Control", value: true, type: "boolean" },
  { name: "Immobilizer", value: true, type: "boolean" },
  { name: "Traction Control", value: true, type: "boolean" },
  { name: "Door Opening Warning", value: "true", type: "boolean" },
  { name: "Vehicle Stability Control", value: true, type: "boolean" },
  { name: "Child Lock", value: true, type: "boolean" },
  { name: "Rear Fog Lamp", value: false, type: "boolean" },
  { name: "ISOFIX Child Seat Anchors", value: true, type: "boolean" },
  { name: "Autonomous Emergency Braking (AEB)", value: true, type: "boolean" },
  { name: "High Mount Stop Lamp", value: true, type: "boolean" },
  { name: "Blind Spot Detection (BSD)", value: false, type: "boolean" },
  { name: "Anti-Lock Braking System (ABS)", value: true, type: "boolean" },
  {
    name: "Lane Departure Warning System (LDWS)",
    value: false,
    type: "boolean",
  },
  {
    name: "Electronic Brake-Force Distribution (EBD)",
    value: true,
    type: "boolean",
  },
  { name: "Lane Keep Assist System (LKAS)", value: false, type: "boolean" },
  { name: "Brake Assist (BA)", value: true, type: "boolean" },
];
const exterior = [
  { name: "Brake Assist (BA)", value: true, type: "boolean" },
  { name: "Adjustable headlights", vale: true, type: "boolean" },
  { name: "Colored Outside Door Handles", value: "Body Colored", tye: "text" },
  { name: "Rear Spoiler", value: false, type: "boolean" },
  { name: "Side Mirrors with Indicators", value: false, type: "boolean" },
  { name: "Sun Roof", value: false, type: "boolean" },
  { name: "Moon Roof", value: false, type: "boolean" },
  { name: "Fog Lights", value: true, type: "boolean" },
  { name: "DRLs", value: true, type: "boolean" },
  { name: "Roof Rails", value: false, type: "boolean" },
  { name: "Side Steps", value: false, type: "boolean" },
  { name: "Dual Exhaust", value: false, type: "boolean" },
];
const instrument = [
  { name: "Tachometer", value: true, type: "boolean" },
  { name: "Multi Information", value: true, type: "boolean" },
  { name: "Information Cluster", value: "Analogue with MID", type: "text" },
];
const info = [
  { name: "CD Player", value: true, type: "boolean" },
  { name: "DVD Player", value: true, type: "boolean" },
  { name: "Number of Speakers", value: "-", type: "boolean" },
  { name: "USB and Auxillary Cable", value: true, type: "boolean" },
  { name: "Front Speakers", value: true, type: "boolean" },
  { name: "Bluetooth Connectivity", value: true, type: "boolean" },
  { name: "Rear Speakers", value: true, type: "boolean" },
  { name: "Display Size", value: "8.3 in Standard LCD", type: "boolean" },
  { name: "Rear Seat Entertainment", value: false, type: "boolean" },
  { name: "Voice Control", value: false, type: "boolean" },
  { name: "Android Auto", value: true, type: "boolean" },
  { name: "Apple Car Play", value: true, type: "boolean" },
];
const comforts = [
  { name: "Air Conditioner", value: true, type: "boolean" },
  { name: "Climate Control", value: true, type: "boolean" },
  { name: "Air Purifier", value: false, type: "boolean" },
  { name: "Rear AC Vents", value: true, type: "boolean" },
  { name: "3rd Row AC Vents", value: false, type: "boolean" },
  { name: "Heater", value: "true", type: "boolean" },
  { name: "Heated States", value: "true", type: "boolean" },
  { name: "Defogger", value: "true", type: "boolean" },
  { name: "CoolBox", value: "false", type: "boolen" },
  { name: "Navigation", value: "true", type: "boolean" },
  { name: "Optional Navigation", value: "true", type: "boolean" },
  { name: "Front Camera", value: "true", type: "boolean" },
  { name: "Power Steering", value: "true", type: "boolean" },
  { name: "360 Camera", value: "true", type: "boolean" },
  { name: "Front Parking Sensors", value: "true", type: "boolean" },
  { name: "Auto-Dimming Rear View Mirror", value: "false", type: "boolean" },
  { name: "Rear Central Control", value: "false", type: "boolean" },
  { name: "Rear Folding Seat", value: "true", type: "boolean" },
  { name: "Rear Headrest", value: "2", type: "number" },
  { name: "Rear Wiper", value: "true", type: "boolean" },
  {
    name: "Seat Material Type",
    value: "Leather with Powered Adjustment",
    type: "text",
  },
  { name: "Driver Seat Electric Adjustment", value: "true", type: "boolean" },
  { name: "Driver Seat Lumbar Support", value: "false", type: "boolean" },
  { name: "Driver Seat Memory Function", value: "false", type: "boolean" },
  {
    name: "Passenger Seat Electric Adjustment",
    value: "true",
    type: "boolean",
  },
  { name: "Steering Adjustment", value: "true", type: "boolean" },
  { name: "Steering Switches", value: "true", type: "boolean" },
  { name: "Headlight On Reminder", value: "true", type: "boolean" },
  { name: "Automatic Head Lamps", value: "true", type: "boolean" },
  { name: "rain Sensing Wipers", value: "true", type: "boolean" },
  { name: "Heads Up Dispaly (HUD)", value: "false", type: "boolean" },
  { name: "Cruise Control", value: "true", type: "boolean" },
  { name: "Driving Modes", value: "true", type: "boolean" },
  { name: "Paddle Shifter", value: "false", type: "boolean" },
  { name: "key Type", value: "Keyless Entry", type: "text" },
  { name: "Push Start", value: "true", type: "boolean" },
  { name: "Remote Engine Start", value: "false", type: "boolean" },
  { name: "Central Locking", value: "true", type: "boolean" },
  { name: "Power Door Locks", value: "true", type: "boolean" },
  { name: "Rear Camera", value: "true", type: "boolean" },
  { name: "Power Windows", value: "true", type: "boolean" },
  { name: "Power Mirrors", value: "true", type: "boolean" },
  { name: "Auto Retractable Side Mirrors", value: "true", type: "boolean" },
  { name: "Power Boot", value: "false", type: "boolean" },
  { name: "Cup Holders", value: "true", type: "boolean" },
  { name: "Arm Rest", value: "true", type: "boolean" },
  { name: "Handbrake", value: "Electric", type: "text" },
  { name: "Auto Brake Hold", value: "true", type: "boolean" },
  { name: "Auto Parking System", value: "false", type: "boolean" },
  { name: "Interior lighting", value: "true", type: "boolean" },
  { name: "Glove Box Lamp", value: "false", type: "boolean" },
  { name: "Crgo Light", value: "false", type: "boolean" },
  { name: "Front Power Outlet", value: "true", type: "boolean" },
  { name: "Rear Power Outlet", value: "false", type: "boolean" },
  {
    name: "Tyre Pressure Monitoring System (TPMS)",
    value: "true",
    type: "boolean",
  },
  { name: "Wireless Charger", value: "false", type: "boolean" },
  { name: "Boss Seat Switch", value: "false", type: "boolean" },
];

const SpecificationSection = ({ selectedPrice }) => {
  const [activeTab, setActiveTab] = useState("specs");
  const [comment, setComment] = useState("");

  const handleReport = () => {
    toast(
      <div className="bg-white rounded-xl shadow-lg p-4 text-gray-700 space-y-2">
        <h4 className="text-lg font-semibold">
          Report Incorrect Specification
        </h4>
        <textarea
          rows="4"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="text-right">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            onClick={() => {
              toast.dismiss();
              toast.success("Submitted successfully!");
              setComment("");
            }}
          >
            Submit
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        draggable: false,
        closeButton: true,
      }
    );
  };

  return (
    <section id="specs" className="px-4 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        {selectedPrice && selectedPrice?.model}{" "}
        {selectedPrice && selectedPrice?.make}{" "}
        {selectedPrice && selectedPrice?.engine} Specifications & Features
      </h2>

      <div className="flex justify-center mb-8 space-x-6 border-b border-gray-300">
        {["specs", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 text-lg font-medium transition ${
              activeTab === tab
                ? "text-[#233D7B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#233D7B] after:rounded-full"
                : "text-gray-500 hover:text-[#233D7B]"
            }`}
          >
            {tab === "specs" ? "Specifications" : "Features"}
          </button>
        ))}
      </div>

      {activeTab === "specs" ? (
        <>
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Engine Specifications
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Engine Type</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.engineType}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Turbo Charger</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.turboCharger}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Displacement(cc)</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.displacement}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Drive Train (cc)</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.driveTrain}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  Number of Cylinder
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.numberOfCylinders}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  Cylinder Configuartion
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.cylinderConfiguration}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Horse Power(HP)</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.horsePower}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">Compression Ratio</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.compressionRatio}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Perfermance & Transmission
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">{"Torque"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.torque}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  {"Valves Per Cylinder"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.valvesPerCylinder}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">{"Fuel System"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.valvesPerCylinder}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">{"Fuel System"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.fuelSystem}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  {"Valve Mechanism"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.valveMechanism}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  {"Max Speed (km/h)"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.maxSpeed}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">
                  {"Transmission Type"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.transmissionType}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-600">{"GearBox"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.gearbox}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4 mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">
              Chassis & Suspension
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Steering Type"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.steeringType}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Min Turning Radius(m)"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.minTurningRadius}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Power Assisted"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.powerAssisted}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Front Suspension"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.frontSuspension}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Rear Suspension"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.rearSuspension}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Front Brakes"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.frontBrakes}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Rear Brakes"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.rearBrakes}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4 mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">
              Wheels & Tires{" "}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Wheel Type"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.wheelType}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Tyre Size"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.tyreSize}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Wheel Size"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.wheelSize}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"Spare Tyre"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.spareTyre}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">{"PCD"}</span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.pcd}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Spare Tyre Size"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.spareTyreSize}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4 mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">
              Feul Economy
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Mileage City (km/l)"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.mileageCity}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Mileage Highway (km/l)"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.mileageHighway}
                </span>
              </div>

              <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <span className="text-sm text-gray-700">
                  {"Fuel tank capacity"}
                </span>
                <span className="text-[#233D7B] font-semibold text-sm">
                  {selectedPrice && selectedPrice?.fuelTankCapacity}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 text-lg py-10">
          Features of Audi Q2 1.0
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
              Safety Features
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b">#</th>
                    <th className="px-6 py-4 border-b">Feature</th>
                    <th className="px-6 py-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.type === "boolean" ? (
                          item.value ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <FaCheck className="mr-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                              <FaTimes className="mr-1" />
                            </span>
                          )
                        ) : item.type === "number" ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            {item.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
              Exterior Features
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b">#</th>
                    <th className="px-6 py-4 border-b">Feature</th>
                    <th className="px-6 py-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exterior.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.type === "boolean" ? (
                          item.value ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <FaCheck className="mr-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                              <FaTimes className="mr-1" />
                            </span>
                          )
                        ) : item.type === "number" ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            {item.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
              Instrumentation Features
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b">#</th>
                    <th className="px-6 py-4 border-b">Feature</th>
                    <th className="px-6 py-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {instrument.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.type === "boolean" ? (
                          item.value ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <FaCheck className="mr-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                              <FaTimes className="mr-1" />
                            </span>
                          )
                        ) : item.type === "number" ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            {item.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
              Infotainment Features
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b">#</th>
                    <th className="px-6 py-4 border-b">Feature</th>
                    <th className="px-6 py-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {info.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.type === "boolean" ? (
                          item.value ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <FaCheck className="mr-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                              <FaTimes className="mr-1" />
                            </span>
                          )
                        ) : item.type === "number" ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            {item.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
              Comfort and Convenience Features
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b">#</th>
                    <th className="px-6 py-4 border-b">Feature</th>
                    <th className="px-6 py-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comforts.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.type === "boolean" ? (
                          item.value ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <FaCheck className="mr-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                              <FaTimes className="mr-1" />
                            </span>
                          )
                        ) : item.type === "number" ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            {item.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      <ToastContainer />
    </section>
  );
};

export default SpecificationSection;
