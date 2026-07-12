import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import CreateListing from "../pages/CreatListing";
import Dashboard from "../pages/Dashboard";
import EditListing from "../pages/EditListing";
import Favorites from "../pages/Favorites";
import Home from "../pages/Home";
import ListingDetails from "../pages/ListingDetails";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/edit/:id" element={<EditListing />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;