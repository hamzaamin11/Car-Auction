import React, { useEffect, useState } from "react";
import TopBreadcrumb from "../components/TopBreadcrumb";
import JoinAuctionTable from "../components/JoinAuctionTable";
import RegisterDialog from "../components/RegisterDialog";
import axios from "axios";
import { BASE_URL } from "../components/Contant/URL";
import UpcomingAuctions from "../admin/pages/UpcomingAuctions";

const JoinAuctions = () => {
  const [tableSize, setTableSize] = useState("small");
  const [showDialog, setShowDialog] = useState(false);
  const [isAddAuction, setIsAddAuction] = useState(false);
  const [allLive, setAllLive] = useState([]);

  const [upComing, setUpComing] = useState([]);

  const handleAddAuctionClick = () => {
    setIsAddAuction(true);
    setShowDialog(true);
  };

  const handleSizeChange = (size) => {
    setTableSize(size);
  };

  const handleGetLive = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/liveAuctions`);
      setAllLive(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUpcoming = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/upcomingAuctions`);
      setUpComing(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetLive();
    handleGetUpcoming();
  }, []);

  console.log("sadgi live", allLive);
  console.log("sadgi coming", upComing);

  return (
    <>
      <TopBreadcrumb
        onAddAuctionClick={handleAddAuctionClick}
        onSizeChange={handleSizeChange}
      />
      <JoinAuctionTable
        size={tableSize}
        allLive={allLive}
        upComing={upComing}
      />
      <RegisterDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        isAddAuction={isAddAuction}
      />

      
    </>
  );
};

export default JoinAuctions;
