import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${
      isActive
        ? "font-semibold text-emerald-700"
        : "text-slate-600 hover:text-emerald-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold text-emerald-700"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <ShoppingBag size={22} />
          </span>

          <span>YardSale</span>
        </Link>

        <form
          className="hidden flex-1 md:block"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              type="search"
              placeholder="Search listings..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" className={getNavLinkStyles}>
            Home
          </NavLink>

          <NavLink to="/favorites" className={getNavLinkStyles}>
            Favorites
          </NavLink>

          <NavLink to="/dashboard" className={getNavLinkStyles}>
            Dashboard
          </NavLink>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link
            to="/favorites"
            aria-label="View favorites"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
          >
            <Heart size={21} />
          </Link>

          <Link
            to="/login"
            className="rounded-xl px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Log in
          </Link>

          <Link
            to="/create"
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
          >
            Sell an item
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <form
            className="mb-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                type="search"
                placeholder="Search listings..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/favorites"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </NavLink>

            <NavLink
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/login"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </NavLink>

            <NavLink
              to="/create"
              className="mt-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-emerald-700"
              onClick={() => setIsMenuOpen(false)}
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