import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminDashboard from "./pages/AdminDashboard";
import RSVPs from "./pages/RSVPs";
import AdminLogin from "./pages/AdminLogin";
import AsoebiOrders from "./pages/AsoebiOrders";
import Gifts from "./pages/Gifts";

export default function AdminApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const path = window.location.pathname;
  const token = localStorage.getItem("adminToken");

  // Login page
  if (path.startsWith("/admin/login")) {
    if (token) {
      window.location.replace("/admin");
      return null;
    }

    return <AdminLogin />;
  }

  // Protect admin pages
  if (!token) {
    window.location.replace("/admin/login");
    return null;
  }

  const renderPage = () => {
    if (path.startsWith("/admin/rsvps")) {
      return <RSVPs />;
    }

    if (path.startsWith("/admin/asoebi")) {
      return <AsoebiOrders />;
    }
    if (path.startsWith("/admin/gifts")) {
      return <Gifts />;
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-ivory font-body text-brown">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main>{renderPage()}</main>
      </div>
    </div>
  );
}
