import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  addFavorite,
  isListingFavorite,
  removeFavorite,
} from "../../services/favoriteService";

interface FavoriteButtonProps {
  listingId: string;
  onFavoriteChange?: (listingId: string, isFavorite: boolean) => void;
}

function FavoriteButton({ listingId, onFavoriteChange }: FavoriteButtonProps) {
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkFavoriteStatus() {
      if (!user) {
        setIsFavorite(false);
        return;
      }

      try {
        const favoriteStatus = await isListingFavorite(user.uid, listingId);

        setIsFavorite(favoriteStatus);
      } catch (favoriteError) {
        console.error("Unable to check favorite status:", favoriteError);
      }
    }

    void checkFavoriteStatus();
  }, [user, listingId]);

  async function handleFavoriteClick() {
    if (!user) {
      setError("You must be logged in to save favorites.");
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isFavorite) {
        await removeFavorite(user.uid, listingId);

        setIsFavorite(false);
        onFavoriteChange?.(listingId, false);
      } else {
        await addFavorite(user.uid, listingId);

        setIsFavorite(true);
        onFavoriteChange?.(listingId, true);
      }
    } catch (favoriteError) {
      console.error("Unable to update favorite:", favoriteError);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={isLoading}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Heart
          className={
            isFavorite
              ? "h-5 w-5 fill-red-500 text-red-500"
              : "h-5 w-5 text-slate-600"
          }
        />
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FavoriteButton;
