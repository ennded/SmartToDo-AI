import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import NotificationBadge from "./NotificationBadge";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NotificationBadge />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
