import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import VehicleContext from "../../context/VehicleContext"
const AddVehiclePrices = () => {
//   const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    exFactoryPrice: '',
    withholdingTaxFiler: '',
    withholdingTaxNonFiler: '',
    payorderPriceFiler: '',
    payorderPriceNonFiler: '',
    tokenTax: '',
    incomeTaxFiler: '',
    registrationFee: '',
    registrationBook: '',
    scanningArchivingFee: '',
    stickerFee: '',
    numberPlateCharges: '',
    totalPriceFiler: '',
    totalPriceNonFiler: ''
  });

  const {getVehicles} = useContext(VehicleContext)

  // Fetch vehicles for dropdown
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/api/vehicles');
//         const data = await response.json();
//         setVehicles(data);
//       } catch (error) {
//         toast.error('Failed to load vehicles');
//         console.error('Error fetching vehicles:', error);
//       }
//     };
//     fetchVehicles();
//   }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate totals if relevant fields change
    if (name.includes('Price') || name.includes('Tax') || name.includes('Fee') || name.includes('Charges')) {
      calculateTotals();
    }
  };

  // Calculate total prices
  const calculateTotals = () => {
    const {
      exFactoryPrice,
      withholdingTaxFiler,
      payorderPriceFiler,
      tokenTax,
      incomeTaxFiler,
      registrationFee,
      registrationBook,
      scanningArchivingFee,
      stickerFee,
      numberPlateCharges
    } = formData;

    const numericFields = {
      exFactoryPrice: parseFloat(exFactoryPrice) || 0,
      withholdingTaxFiler: parseFloat(withholdingTaxFiler) || 0,
      payorderPriceFiler: parseFloat(payorderPriceFiler) || 0,
      tokenTax: parseFloat(tokenTax) || 0,
      incomeTaxFiler: parseFloat(incomeTaxFiler) || 0,
      registrationFee: parseFloat(registrationFee) || 0,
      registrationBook: parseFloat(registrationBook) || 0,
      scanningArchivingFee: parseFloat(scanningArchivingFee) || 0,
      stickerFee: parseFloat(stickerFee) || 0,
      numberPlateCharges: parseFloat(numberPlateCharges) || 0
    };

    const totalFiler = Object.values(numericFields).reduce((sum, val) => sum + val, 0);
    const totalNonFiler = totalFiler 
      + (parseFloat(formData.withholdingTaxNonFiler) || 0) 
      - numericFields.withholdingTaxFiler
      + (parseFloat(formData.payorderPriceNonFiler) || 0)
      - numericFields.payorderPriceFiler;

    setFormData(prev => ({
      ...prev,
      totalPriceFiler: totalFiler.toFixed(2),
      totalPriceNonFiler: totalNonFiler.toFixed(2)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/admin/addVehiclePrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing');
      }

      toast.success('Pricing saved successfully!');
      // Reset form after successful submission
      setFormData({
        vehicleId: '',
        exFactoryPrice: '',
        withholdingTaxFiler: '',
        withholdingTaxNonFiler: '',
        payorderPriceFiler: '',
        payorderPriceNonFiler: '',
        tokenTax: '',
        incomeTaxFiler: '',
        registrationFee: '',
        registrationBook: '',
        scanningArchivingFee: '',
        stickerFee: '',
        numberPlateCharges: '',
        totalPriceFiler: '',
        totalPriceNonFiler: ''
      });
    } catch (error) {
      toast.error(error.message);
      console.error('Error saving pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Add Vehicle Pricing</h2>
          <p className="text-indigo-100">Enter all required pricing details</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vehicle *
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a vehicle</option>
                {getVehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.vin}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Base Pricing</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ex-Factory Price *</label>
                <input
                  type="number"
                  name="exFactoryPrice"
                  value={formData.exFactoryPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withholding Tax (Filer)</label>
                <input
                  type="number"
                  name="withholdingTaxFiler"
                  value={formData.withholdingTaxFiler}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withholding Tax (Non-Filer)</label>
                <input
                  type="number"
                  name="withholdingTaxNonFiler"
                  value={formData.withholdingTaxNonFiler}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Order Price (Filer)</label>
                <input
                  type="number"
                  name="payorderPriceFiler"
                  value={formData.payorderPriceFiler}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Order Price (Non-Filer)</label>
                <input
                  type="number"
                  name="payorderPriceNonFiler"
                  value={formData.payorderPriceNonFiler}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Taxes & Fees Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Taxes & Fees</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Tax</label>
                <input
                  type="number"
                  name="tokenTax"
                  value={formData.tokenTax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income Tax (Filer)</label>
                <input
                  type="number"
                  name="incomeTaxFiler"
                  value={formData.incomeTaxFiler}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Book</label>
                <input
                  type="number"
                  name="registrationBook"
                  value={formData.registrationBook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scanning & Archiving Fee</label>
                <input
                  type="number"
                  name="scanningArchivingFee"
                  value={formData.scanningArchivingFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Additional Charges Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sticker Fee</label>
                <input
                  type="number"
                  name="stickerFee"
                  value={formData.stickerFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number Plate Charges</label>
                <input
                  type="number"
                  name="numberPlateCharges"
                  value={formData.numberPlateCharges}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">Calculated Totals</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total (Filer):</span>
                    <span className="font-semibold">PKR {formData.totalPriceFiler || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total (Non-Filer):</span>
                    <span className="font-semibold">PKR {formData.totalPriceNonFiler || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Pricing'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddVehiclePrices;