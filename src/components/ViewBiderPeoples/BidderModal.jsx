export const BidderModal = ({ allBidCustomer, handleClose }) => {
  console.log(handleClose, "handleViewBidClose");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Bid Customer List
          </h2>

          <span onClick={handleClose} className="hover:cursor-pointer">
            X
          </span>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#191970] text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Bid Amount</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">Zain</td>
              <td className="py-2 px-4">5,000,000</td>
              <td className="py-2 px-4 flex justify-center gap-2">
                <button className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
