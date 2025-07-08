import React from "react";
import AuctionsContext from "./AuctionsContext";
import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";

function AuctionsProvider({ children }) {
  const [getLiveAuctions, setGetLiveAuctions] = useState([]);
  const [auctionById, setAuctionById] = useState(null);
  const [comingAuc, setComingAuc] = useState([]);
  const [aucHistory, setAucHistory] = useState([]);

  const AllLiveAuctions = async () => {
    const res = await fetch("http://localhost:3001/liveAuctions", {
      method: "GET",
      headers: {
        "Content-Type": "applications/json",
      },
    });
    const data = await res.json();
    setGetLiveAuctions(data);
    console.log("fetched auctions:", data);
  };

  console.log(getLiveAuctions);

  const UpComingAuctions = async () => {
    const res = await fetch("http://localhost:3001/seller/upcomingAuctions", {
      method: "GET",
      headers: {
        "Content-Type": "applications/json",
      },
    });
    const data = await res.json();
    setComingAuc(data);
    console.log("fetched upcoming auctions:", data);
  };

  const getBidHistory = async () => {
    const res = await fetch("http://localhost:3001/seller/auctionHistory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setAucHistory(data);
    console.log("Bid History:", data);
  };

  const AuctionById = async (id) => {
    const res = await fetch(`http://localhost:3001/liveAuctionsById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setAuctionById(data);
  };

  useEffect(() => {
    AllLiveAuctions();
    UpComingAuctions();
    getBidHistory();
  }, []);

  return (
    <AuctionsContext.Provider
      value={{
        getLiveAuctions,
        AllLiveAuctions,
        auctionById,
        AuctionById,
        comingAuc,
        UpComingAuctions,
        getBidHistory,
        aucHistory,
      }}
    >
      {children}
    </AuctionsContext.Provider>
  );
}

export default AuctionsProvider;

AuctionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
