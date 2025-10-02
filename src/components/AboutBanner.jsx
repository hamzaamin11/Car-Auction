import thirdImage from "../../src/assets/copart3.jpg";

const AboutBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat lg:h-[400px]  h-[150px] flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${thirdImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10   px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          About WheelBidz
        </h1>
      </div>
    </section>
  );
};

export default AboutBanner;
