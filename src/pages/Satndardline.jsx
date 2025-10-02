import { useEffect, useState } from "react";
import CarOverview from "../components/CarOverview";
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
      <CarOverview selectedPrice={selectedPrice} vehicleId={vehicleId} />
      <SpecificationSection selectedPrice={selectedPrice} />
    </>
  );
};

export default AudiStandardLine;
