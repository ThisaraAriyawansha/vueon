import React, { useState, useEffect } from "react";
import ImageFile from "../../assets/images/Gemini_Generated_Image_6oy5jw6oy5jw6oy5.png";

const Banner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center w-full text-center text-white bg-center bg-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
      style={{
        backgroundImage: `url(${ImageFile})`, // Corrected syntax
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "center" : "center center", // Simplified for consistency
        backgroundAttachment: isMobile ? "scroll" : "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >

    </div>
  );
};

export default Banner;