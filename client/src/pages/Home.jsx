import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Newsletter from "../components/Newsletter";

const Home = () => {


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
