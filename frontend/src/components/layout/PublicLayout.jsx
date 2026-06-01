import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CatalogProvider } from "../../context/CatalogContext";

export default function PublicLayout() {
  return (
    <CatalogProvider>
      <div className="min-h-screen bg-cream-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CatalogProvider>
  );
}
