import {
  CircleUserRound,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

type SearchSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

const navigationLinks = [
  { label: "Home", path: "/" },
  { label: "Categories", path: "/categories" },
  { label: "Favorites", path: "/favorites" },
  { label: "Dashboard", path: "/dashboard" },
];

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthLoading, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutError, setLogoutError] = useState("");

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "Account";

  const firstName = displayName.split(" ")[0];

  const getDesktopNavStyles = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "rounded-lg px-2 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-emerald-700",
    ].join(" ");

  const getMobileNavStyles = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "rounded-lg px-3 py-2.5 font-medium transition-colors",
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-700 hover:bg-slate-100",
    ].join(" ");

  const handleSearch: SearchSubmitHandler = (event) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(trimmedSearch)}`,
    );

    setIsMenuOpen(false);
  };

  function closeMobileMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    setLogoutError("");

    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError(
        "You could not be logged out. Please try again.",
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold text-emerald-700"
          onClick={closeMobileMenu}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <ShoppingBag
              size={22}
              aria-hidden="true"
            />
          </span>

          <span>YardSale</span>
        </Link>

        <form
          className="hidden min-w-0 flex-1 md:block"
          onSubmit={handleSearch}
        >
          <label
            htmlFor="desktop-search"
            className="sr-only"
          >
            Search listings
          </label>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
              aria-hidden="true"
            />

            <input
              id="desktop-search"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search furniture, electronics, clothing..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 xl:flex">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={getDesktopNavStyles}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          <Link
            to="/favorites"
            aria-label="View favorites"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
          >
            <Heart size={21} aria-hidden="true" />
          </Link>

          {!isAuthLoading && !user && (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <UserPlus
                  size={18}
                  aria-hidden="true"
                />
                Sign up
              </Link>
            </>
          )}

          {!isAuthLoading && user && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                title={user.email ?? undefined}
              >
                <CircleUserRound
                  size={22}
                  className="text-emerald-700"
                  aria-hidden="true"
                />

                <span className="max-w-28 truncate font-semibold">
                  Hi, {firstName}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={18} aria-hidden="true" />
                Log out
              </button>
            </>
          )}

          {isAuthLoading && (
            <div
              className="h-10 w-32 animate-pulse rounded-xl bg-slate-200"
              aria-label="Loading account"
            />
          )}

          <Link
            to="/create"
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Sell an item
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
        >
          {isMenuOpen ? (
            <X size={25} aria-hidden="true" />
          ) : (
            <Menu size={25} aria-hidden="true" />
          )}
        </button>
      </div>

      {logoutError && (
        <div
          role="alert"
          className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700"
        >
          {logoutError}
        </div>
      )}

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          {user && (
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3"
            >
              <CircleUserRound
                size={28}
                className="text-emerald-700"
                aria-hidden="true"
              />

              <span className="min-w-0">
                <span className="block font-semibold text-slate-900">
                  {displayName}
                </span>

                <span className="block truncate text-sm text-slate-600">
                  {user.email}
                </span>
              </span>
            </Link>
          )}

          <form
            className="mb-4"
            onSubmit={handleSearch}
          >
            <label
              htmlFor="mobile-search"
              className="sr-only"
            >
              Search listings
            </label>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
                aria-hidden="true"
              />

              <input
                id="mobile-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search listings..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={getMobileNavStyles}
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-3 border-t border-slate-200" />

            {!isAuthLoading && !user && (
              <>
                <NavLink
                  to="/login"
                  className={getMobileNavStyles}
                  onClick={closeMobileMenu}
                >
                  Log in
                </NavLink>

                <NavLink
                  to="/signup"
                  className={getMobileNavStyles}
                  onClick={closeMobileMenu}
                >
                  Sign up
                </NavLink>
              </>
            )}

            {!isAuthLoading && user && (
              <>
                <NavLink
                  to="/profile"
                  className={getMobileNavStyles}
                  onClick={closeMobileMenu}
                >
                  My profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left font-medium text-red-700 transition hover:bg-red-50"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Log out
                </button>
              </>
            )}

            <NavLink
              to="/create"
              className="mt-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-emerald-700"
              onClick={closeMobileMenu}
            >
              Sell an item
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;