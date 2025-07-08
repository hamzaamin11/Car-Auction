import AboutBanner from "../components/AboutBanner";
import AboutDetails from "../components/AboutDetails";
import AboutLocation from "../components/AboutLocation";
import AboutNews from "../components/AboutNews";
import CopartHistorySection from "../components/CopartHistorySection";
import MembershipPromiseSection from "../components/MembershipPromiseSection";


const About = () => {
    return (
        <>
        <AboutBanner />
        <AboutDetails />
        <CopartHistorySection />
        <MembershipPromiseSection />
        <AboutLocation />
        <AboutNews />
        </>
    );
};

export default About;