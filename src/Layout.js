import Header from "./Header";
import {Outlet} from "react-router-dom";
import LandingPage from "./pages/LandingPage";

export default function Layout() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}