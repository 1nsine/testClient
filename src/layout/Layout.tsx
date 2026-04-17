import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import { Footer } from "../Components/Footer/Footer";
import { Feedback } from "../Components/Feedback/Feedback";

const Layout = () => {
  return (
    <>
      <Feedback />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
