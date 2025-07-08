import React, { useEffect, useRef } from 'react';

const AnimatedCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] 
                 -translate-x-1/2 -translate-y-1/2 transform 
                 border-2 border-[#808080] rounded-full  
                 transition-all duration-75 ease-linear"
    />
  );
};

export default AnimatedCursor;
