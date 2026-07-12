import {
  Bike,
  BookOpen,
  Gamepad2,
  House,
  Laptop,
  Shirt,
  Sofa,
  Wrench,
} from "lucide-react";

const categories = [
  {
    name: "Furniture",
    description: "Tables, chairs, sofas, storage, and décor.",
    icon: Sofa,
  },
  {
    name: "Electronics",
    description: "Computers, televisions, phones, and accessories.",
    icon: Laptop,
  },
  {
    name: "Clothing",
    description: "Clothes, shoes, bags, and accessories.",
    icon: Shirt,
  },
  {
    name: "Home & Garden",
    description: "Appliances, tools, garden equipment, and household goods.",
    icon: House,
  },
  {
    name: "Games",
    description: "Video games, board games, consoles, and collectibles.",
    icon: Gamepad2,
  },
  {
    name: "Books",
    description: "Books, textbooks, magazines, and learning materials.",
    icon: BookOpen,
  },
  {
    name: "Sporting Goods",
    description: "Bikes, fitness equipment, and outdoor gear.",
    icon: Bike,
  },
  {
    name: "Tools",
    description: "Hand tools, power tools, and workshop equipment.",
    icon: Wrench,
  },
];

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-semibold text-emerald-700">Browse the marketplace</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Shop by category
        </h1>

        <p className="mt-3 text-slate-600">
          Explore local items based on what you are looking for.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              type="button"
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon size={24} aria-hidden="true" />
              </span>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {category.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Categories;