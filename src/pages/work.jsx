import DeliveryAndTransportation from "../components/DeliveryAndTransportation";
import FAQSection from "../components/FAQSection";
import IntroSection from "../components/IntroSections";
import LisenceSection from "../components/LisenceSection";
import PaymentMethods from "../components/PaymentMethods";
import RegistrationSteps from "../components/RegistrationSteps";
import WorkBanner from "../components/WorkBanner";


const HowItWorks = () => {
    return (
        <>
        <WorkBanner />
        <IntroSection />
        <RegistrationSteps />
        
        <DeliveryAndTransportation />
        <LisenceSection />
        <PaymentMethods />
        <FAQSection />
        </>
    );
};


export default HowItWorks;