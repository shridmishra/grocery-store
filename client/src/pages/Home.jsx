import React, { useEffect, useState } from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Newsletter from "../components/Newsletter";
import Spinner from "../components/Spinner"; // assuming your Spinner is here

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Spinner />; 
  }

  return (
    <div className="mt-10">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <Newsletter />
    </div>
  );
};

export default Home;
