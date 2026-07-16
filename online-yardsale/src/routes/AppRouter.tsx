import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const MainLayout = lazy(
  () => import("../components/layout/MainLayout"),
);
const Categories = lazy(() => import("../pages/Categories"));
const CreateListing = lazy(() => import("../pages/CreatListing"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const EditListing = lazy(() => import("../pages/EditListing"));
const Favorites = lazy(() => import("../pages/Favorites"));
const Home = lazy(() => import("../pages/Home"));
const ListingDetails = lazy(
  () => import("../pages/ListingDetails"),
);
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Profile = lazy(() => import("../pages/Profile"));
const SearchResults = lazy(
  () => import("../pages/SearchResults"),
);
const Signup = lazy(() => import("../pages/Signup"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

function AppRouter() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"
              aria-hidden="true"
            />

            <p className="mt-4 text-slate-600">Loading page...</p>
          </div>
        </section>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/listing/:id"
            element={<ListingDetails />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/create"
              element={<CreateListing />}
            />
            <Route
              path="/edit/:id"
              element={<EditListing />}
            />
            <Route
              path="/favorites"
              element={<Favorites />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;