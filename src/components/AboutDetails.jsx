import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutDetails = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-white py-10 px-4 sm:py-14 sm:px-8 md:py-16 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-left" data-aos="fade-up">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
          Welcome to WheelBidz Pakistan – the future of vehicle bidding in
          Pakistan!
        </h2>

        {/* First Paragraph */}
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-6">
          Our Vision To become Pakistan’s most trusted and transparent vehicle
          bidding platform, setting new standards in quality, reliability, and
          customer satisfaction while making vehicle trading accessible, fair,
          and convenient for everyone. Our Mission At WheelBidz Pakistan, our
          mission is to: Deliver a transparent and fair bidding system that
          ensures the true value of every vehicle. Provide certified and
          quality-verified vehicles that meet the highest standards of
          reliability. Build long-term trust and satisfaction by putting our
          customers at the center of everything we do. Use innovation and
          technology to create a seamless, secure, and user-friendly experience
          for buyers and sellers alike. Contribute to the modernization of
          Pakistan’s automobile industry through ethical practices and unmatched
          service excellence.
        </p>

        {/* Second Paragraph */}
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
          We are a dynamic and innovative startup dedicated to transforming the
          way people buy and sell vehicles. At WheelBidz, our mission is simple:
          to provide a transparent, reliable, and customer-focused platform
          where every vehicle deal is built on trust and quality. What sets us
          apart is our commitment to excellence. Each vehicle listed on
          WheelBidz goes through a thorough certification process, ensuring that
          you receive only the best options that meet the right quality
          standards for their price. Our professional team carefully verifies
          and approves vehicles so that our customers can bid with confidence
          and peace of mind. With state-of-the-art services and a strong focus
          on customer satisfaction, WheelBidz brings fairness, trust, and
          convenience to vehicle trading. Whether you’re looking for your next
          car or planning to sell one, WheelBidz offers a transparent bidding
          system that guarantees the true value of your vehicle. At WheelBidz
          Pakistan, we are not just a bidding platform—we are your trusted
          partner in driving quality, trust, and value across Pakistan.
        </p>
      </div>
    </section>
  );
};

export default AboutDetails;
