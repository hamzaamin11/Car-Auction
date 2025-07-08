import React, { useState } from "react";
import { Link } from "react-router-dom";

const AudiPricesSection = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);

  const handleLess = () => {
    setShowFullInfo(false);
    setShowParagraph(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-sm text-gray-600 mb-4 space-x-2">
        <Link to="/" className="hover:underline text-gray-600 font-semibold">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/saleslist"
          className="hover:underline text-gray-600 font-semibold"
        >
          Price List
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-semibold">
          Audi Prices in Pakistan
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-[#233d7b]">
        Audi Car Prices
      </h2>

      <button
        onClick={() => setShowParagraph(!showParagraph)}
        className="text-[#518ecb] text-sm underline mb-4"
      >
        Learn More About Audi
      </button>

      {showParagraph && (
        <div className="mb-4 text-gray-700">
          <h3 className="text-2xl font-semibold text-gray-700">
            Audi Car Prices in Pakistan:
          </h3>
          <p className="text-sm text-justify text-gray-500 mt-2">
            The prices of a Audi Car in Pakistan start from PKR 7,050,000.0 for
            a new Audi Q2 to PKR 81,000,000.0 for a new Audi e-tron GT. There
            are currently 3 new car models available at Audi dealerships across
            Pakistan. Audi Cars are also widely available in used conditions
            starting from PKR 550,000 for a used Audi A1 to PKR 60,000,000 for a
            used Audi A8. There are a total of 279 Audi Cars available for sale
            in Pakistan on CHAUDHRY Cars Auction.
            {!showFullInfo && (
              <button
                onClick={() => setShowFullInfo(true)}
                className="ml-2 text-[#518ecb] underline cursor-pointer"
              >
                Read More
              </button>
            )}
          </p>

          {showFullInfo && (
            <div className="mt-2">
              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                About Audi
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                Audi is a member of one of the largest automobile manufacturing
                groups in the world, the Volkswagen Group. It is amongst the
                three most prestigious German automobile brands that specialise
                in luxury cars. Audi vehicles are produced in 9 facilities all
                around the globe. In the year 2020 alone, Audi produced more
                than 1.6 million car units. Audi officially entered the
                Pakistani market in 2006 in partnership with Premier Systems. In
                2016, there were rumors of Audi planning to start domestic
                production of vehicles with $30 million investment. As of now,
                Audi offers its complete vehicle lineup in Pakistan as CBUs.
              </p>
              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                History of Audi
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                Audi, a latin word that translates to “listen”, was a child of
                four different brands synthesized together. Their logo, the four
                rings, represents these four brands. Owned by Jorgen Rasmussen,
                Audi became the first European company to combine a six cylinder
                engine with a front wheel drive. The company suffered at the
                hands of Soviets who took over the factories and manufacturing
                plants in World War II. After the war ended, Audi was reborn as
                a spare parts manufacturer in Bavaria. Fast forward to 1991,
                Volswagen group bought Audi after their rise to international
                fame. In Pakistan, Audi vehicles have been very popular due to
                the presence of a local partner. The opportunity to own a luxury
                German vehicle at a reasonable cost attracts many buyers.
              </p>
              <h2 className="text-lg text-[#233d7B] font-bold">
                Popular Audi Models in Pakistan
              </h2>
              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                Audi A3
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                The Audi A3 came as an alternative to the locally produced
                sedans, Civic and Corolla. A3 got its popularity because it came
                from an established German automaker. Consumers were willing to
                pay a slightly higher price for the A3 as compared to other
                common Japanese cars. Later, Audi A3 became unreasonably
                expensive and lost its sales due to government regulations. The
                car is still offered with multiple engine options, ranging from
                1.2 to 1.8 litres. A3’s powerful drive, safe and sturdy build
                quality, and modern technology make it superior to its
                competitors.
              </p>

              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                Audi A6
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                A6, the bigger brother to A3, is another popular luxury sedan in
                Pakistan. Unlike A3, Audi A6 has held its ground despite its
                price being significantly higher than any local competitors. Not
                only was it a D-segment luxury sedan with a comfortable ride,
                the futuristic design language of Audi played a key role in the
                model’s success. The car ships with a 3.0-litre TFSI engine
                along with a 3.0-litre diesel V6. Both these engines are
                assisted by Audi’s mild hybrid technology.
              </p>

              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                Audi e-torn
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                Audi e-tron is an all electric SUV lineup with Audi’s signature
                modern design language characterised by dynamic turn signals and
                sharp character lines. e-tron is Audi’s reply to the Tesla Model
                X. Audi e-tron was the first electric SUV in Pakistan. To the
                surprise of many, it turned out to be a popular one. It is
                offered with multiple powertrains that are guaranteed to excite
                the passengers with a burst of all electric acceleration. The
                latest e-tron sportback variant is also available in Pakistan.
              </p>

              <h4 className="text-1xl text-md font-bold mt-2 text-[#233d7b]">
                Availability of Audi Cars in Pakistan
              </h4>
              <p className="text-sm text-justify text-gray-500 mb-2 mt-2">
                The cars are available through a network of Audi dealerships in
                multiple cities across the country.
              </p>

              <div className="overflow-x-auto">
                <h4 className="text-2xl text-md font-bold mt-2 mb-4 text-[#233d7b]">
                  Audi Car Prices in Pakistan
                </h4>
                <table className="min-w-full border border-gray-300 text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border">Models</th>
                      <th className="p-3 border">Ex-Factory Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border font-semibold text-[#233d7b]">
                        Audi Q2
                      </td>
                      <td className="p-3 border text-center">
                        PKR 70.5 - 72.5 lacs
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-semibold text-[#233d7b]">
                        Audi Q8 e-torn
                      </td>
                      <td className="p-3 border text-center">
                        PKR 3.85 - 4.75 crore
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-semibold text-[#233d7b]">
                        Audi e-torn GT
                      </td>
                      <td className="p-3 border text-center">
                        PKR 5.8 - 8.1 crore
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleLess}
                className="text-[#518ecb] underline cursor-pointer"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudiPricesSection;
