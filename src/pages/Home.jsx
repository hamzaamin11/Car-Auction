import { useDispatch, useSelector } from "react-redux";
import AboutSection from "../components/AboutSection";
import AuctionTabs from "../components/AuctionTabs";
import CarBanner from "../components/CarBanner";
import CarCardSlider from "../components/CarCardSlider";
import FollowUsSection from "../components/FollowUsSection";
import HomeRegister from "../components/HomeRegister";
import InventorySection from "../components/InventorySection";
import TabsSection from "../components/TabsSection";
import { RotateLoader } from "../components/Loader/RotateLoader";
import { useEffect } from "react";
import {
  navigationStart,
  navigationSuccess,
} from "../components/Redux/NavigationSlice";

const Home = () => {
  return (
    <>
      <CarBanner />
      <TabsSection />
      <CarCardSlider />

      {/*
      <AuctionTabs />

      */}

      <AboutSection />
    </>
  );
};

export default Home;
