import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DeliveryAndTransportation = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="content-section bg-white text-gray-800" data-aos="fade-up">
    

   
      <div className="w-full flex flex-col md:flex-row items-center gap-0  bg-[#f7fafc]">
        
     
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
        <div className="text-left mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Delivery and Transportation</h1>
      </div>
          <p className="mb-4">CHAUDHRY Cars Auction offers Mainland delivery for a multitude of vehicles. Check if a lot has delivery available on the Lot Details page or Unpaid Invoices following the sale.</p>
          <p className="mb-4">Enjoy 3 days of complimentary storage while you arrange pick-up. Schedule your collection using our Transportation App. Flatbed trucks are recommended for safe transportation. All heavy and medium-duty lots are self-load only.</p>
          <p className="mb-4">Have your own preferred transporter? Send your lot information to your transporter after winning a vehicle so they can schedule collection via our Transportation App.</p>
        </div>

       
        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
          <img
            src="/images/deliverycars.jpg"
            alt="Delivery"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </div>
  );
};

export default DeliveryAndTransportation;
