import bannerImage from "../../src/assets/c5.jpg";

const FinderBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[120px] md:h-[400px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Vehicle Finder
        </h1>
      </div>
    </section>
  );
};

export default FinderBanner;
