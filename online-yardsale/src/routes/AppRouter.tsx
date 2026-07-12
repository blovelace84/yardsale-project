import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

const CreateListing = lazy(() => import("../pages/CreatListing"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const EditListing = lazy(() => import("../pages/EditListing"));
const Favorites = lazy(() => import("../pages/Favorites"));
const Home = lazy(() => import("../pages/Home"));
const ListingDetails = lazy(() => import("../pages/ListingDetails"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Categories = lazy(() => import("../pages/Categories"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const Profile = lazy(() => import("../pages/Profile"));
const Signup = lazy(() => import("../pages/Signup"));

function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />
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
    </Suspense>
  );
}

export default AppRouter;