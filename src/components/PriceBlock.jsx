import { Link } from "react-router-dom";

const PriceBlock = ({ selectedPrice }) => {
  return (
    <section id="price-block" className="bg-white py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-1xl sm:text-2xl font-semibold text-gray-700 mb-4">
          {selectedPrice && selectedPrice?.model}{" "}
          {selectedPrice && selectedPrice?.make}{" "}
          {selectedPrice && selectedPrice?.engine} Price in Pakistan
        </h2>

        <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
          The price of {selectedPrice && selectedPrice?.model}{" "}
          {selectedPrice && selectedPrice?.make}{" "}
          {selectedPrice && selectedPrice?.engine} in Pakistan is{" "}
          <strong>PKR {selectedPrice && selectedPrice?.buyNowPrice} </strong>.
          This price is ex-factory and does not include freight, taxes, and
          other documentation charges.
        </p>

        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-[#233D7B] text-white text-sm">
              <tr>
                <th className="py-3 px-4">Variant</th>
                <th className="py-3 px-4">Ex-Factory Price</th>
                <th className="py-3 px-4">On Road Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-100 transition">
                <td className="py-4 px-4 text-gray-800 font-medium">
                  {selectedPrice && selectedPrice?.model}{" "}
                  {selectedPrice && selectedPrice?.make}{" "}
                  {selectedPrice && selectedPrice?.engine}
                </td>
                <td className="py-4 px-4 text-green-700 font-semibold">
                  PKR {selectedPrice && selectedPrice?.buyNowPrice}
                </td>
                <td className="py-4 px-4">
                  <Link
                    to="/roadprice"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Get {selectedPrice && selectedPrice?.model}{" "}
                    {selectedPrice && selectedPrice?.make}{" "}
                    {selectedPrice && selectedPrice?.engine} On Road Price
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PriceBlock;
