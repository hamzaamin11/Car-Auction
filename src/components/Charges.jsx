

const HoldingCharges = () => {
    return (
        <div className="max-w-6xl mx-auto p-6">
        <div className="overflow-x-auto">
 
  <table className="hidden md:table w-full min-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm">
    <thead className="bg-[#f3f6fc] text-[#233d7b] text-sm uppercase tracking-wide">
      <tr>
        <th className="text-left px-6 py-3 border-b font-semibold">Withholding Charges</th>
        <th className="text-left px-6 py-3 border-b font-semibold">Amount</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700">
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Withholding Tax (Filer)</td>
        <td className="px-6 py-4 border-b text-green-600 font-medium">PKR 70,500</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Withholding Tax (Non-Filer)</td>
        <td className="px-6 py-4 border-b text-red-600 font-medium">PKR 211,500</td>
      </tr>
    </tbody>
  </table>


  <div className="md:hidden space-y-4">
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Withholding Tax (Filer)</p>
      <p className="text-green-600 font-bold">PKR 70,500</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Withholding Tax (Non-Filer)</p>
      <p className="text-red-600 font-bold">PKR 211,500</p>
    </div>
  </div>
</div>

        </div>
    );
};

export default HoldingCharges;