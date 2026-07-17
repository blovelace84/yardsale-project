import ListingCard from "./ListingCard";
import type { Listing } from "../../types/listing";

interface ListingGridProps {
  listings: Listing[];
}

function ListingGrid({ listings }: ListingGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}

export default ListingGrid;