

const KpkGovtCharges = () => {
    return (
        <div className="max-w-6xl mx-auto p-6">
        <div className="overflow-x-auto">
 
  <table className="hidden md:table w-full min-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm">
    <thead className="bg-[#f3f6fc] text-[#233d7b] text-sm uppercase tracking-wide">
      <tr>
        <th className="text-left px-6 py-3 border-b font-semibold">KPK Govt Charges</th>
        <th className="text-left px-6 py-3 border-b font-semibold">Amount</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700">
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Token Tax</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 125</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Income Tax Filer</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR2,438 (Non-Filer:PKR2,438)</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Registration Fee</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR71,205</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Registration Book</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 308</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Scanning And Archiving</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 198</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Sticker</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 182</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Number Plate Charges</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 782</td>
      </tr>
      
    </tbody>
  </table>


  <div className="md:hidden space-y-4">
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Token Tax</p>
      <p className="text-green-600 font-bold">PKR 125</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Income tax Filler</p>
      <p className="text-red-600 font-bold">PKR 2,438 (Non-Filer: PKR 2,438)</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Registration Fee</p>
      <p className="text-green-600 font-bold">PKR 71, 205</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Registration Book</p>
      <p className="text-green-600 font-bold">PKR 308</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Scanning And Archiving</p>
      <p className="text-green-600 font-bold">PKR 198</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Sticker</p>
      <p className="text-green-600 font-bold">PKR 182</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Number Plate Charges</p>
      <p className="text-green-600 font-bold">PKR 782</p>
    </div>
  </div>
</div>

        </div>
    );
};

export default KpkGovtCharges;