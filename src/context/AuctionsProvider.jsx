import React from "react";
import AuctionsContext from "./AuctionsContext";
import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../components/Contant/URL";
import { useSelector } from "react-redux";

function AuctionsProvider({ children }) {
  const { currentUser } = useSelector((state) => state.auth);
  const id = currentUser?.id;
  console.log("jani nay ro ro k =>", currentUser);
  const [getLiveAuctions, setGetLiveAuctions] = useState([]);
  const [auctionById, setAuctionById] = useState(null);
  const [comingAuc, setComingAuc] = useState([]);
  const [aucHistory, setAucHistory] = useState([]);

  const AllLiveAuctions = async () => {
    const res = await fetch(`${BASE_URL}/liveAuctions`, {
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
    const res = await fetch(`${BASE_URL}/seller/upcomingAuctions/${id}`, {
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
    const res = await fetch(`${BASE_URL}/seller/auctionHistory`, {
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
    const res = await fetch(`${BASE_URL}/liveAuctionsById/${id}`, {
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
