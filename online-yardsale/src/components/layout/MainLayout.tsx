import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
    return(
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1 py-6 sm:py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;