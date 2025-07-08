import { useState } from "react";
import CalendarSection from "../components/CalendarSection";

const AuctionsCalendar = () => {
  const [showTime, setShowTime] = useState(false); 

  return (
    <>
      <CalendarSection showTime={showTime} setShowTime={setShowTime} />
      
    </>
  );
};

export default AuctionsCalendar;
