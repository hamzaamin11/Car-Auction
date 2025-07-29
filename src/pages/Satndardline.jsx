import { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import CarColors from "../components/CarColors";
import CarOverview from "../components/CarOverview";
import FAQAcordian from "../components/FAQAcordian";
import PriceBlock from "../components/PriceBlock";
import SpecificationSection from "../components/SpecificationSection";
import TabsComponents from "../components/TabsComponents";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../components/Contant/URL";

const AudiStandardLine = () => {
  const { id } = useParams();

  const vehicleId = id;

  const [selectedPrice, setSelectedPrice] = useState();

  console.log(" =>", selectedPrice);

  const handleGetPrice = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getVehiclesById/${id}`);
      setSelectedPrice(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, []);

  return (
    <>
      <TabsComponents selectedPrice={selectedPrice} />
      <CarOverview selectedPrice={selectedPrice} vehicleId={vehicleId} />
      <PriceBlock selectedPrice={selectedPrice} />
      <CarColors selectedPrice={selectedPrice} />
      <SpecificationSection selectedPrice={selectedPrice} />
    </>
  );
};

export default AudiStandardLine;
