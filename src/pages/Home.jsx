import AboutSection from "../components/AboutSection";
import AuctionTabs from "../components/AuctionTabs";
import CarBanner from "../components/CarBanner";
import CarCardSlider from "../components/CarCardSlider";
import FollowUsSection from "../components/FollowUsSection";
import HomeRegister from "../components/HomeRegister";
import InventorySection from "../components/InventorySection";
import TabsSection from "../components/TabsSection";


const Home = () => {
    return (
        <>
        <CarBanner />
        <CarCardSlider />
        <InventorySection />
        <TabsSection />
        <AuctionTabs />
        <AboutSection />
        <FollowUsSection />
        <HomeRegister />
        </>
    );
};

export default Home;