import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchListings } from "../api/listingApi.js";
import ListingGrid from "../components/listings/ListingGrid.jsx";
import CategoryFilterBar from "../components/listings/CategoryFilterBar.jsx";
import Loader from "../components/common/Loader.jsx";
import { useFlashMessage } from "../hooks/useFlashMessage.js";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTax, setShowTax] = useState(false); // GST toggle as local state
  const { addFlash } = useFlashMessage();

  const category = searchParams.get("category") || "";
  const query = searchParams.get("query") || "";

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (query) params.query = query;
    fetchListings(params)
      .then((res) => setListings(res.data))
      .catch((err) => addFlash(err.response?.data?.message || "Failed to load listings", "error"))
      .finally(() => setLoading(false));
  }, [category, query, addFlash]);

  const handleSelectCategory = (cat) => {
    const next = {};
    if (cat) next.category = cat;
    if (query) next.query = query;
    setSearchParams(next);
  };

  return (
    <div className="container">
      <CategoryFilterBar
        active={category}
        onSelect={handleSelectCategory}
        showTax={showTax}
        onToggleTax={() => setShowTax((s) => !s)}
      />
      {query && <p className="mt-2">Results for &ldquo;{query}&rdquo;</p>}
      {loading ? <Loader /> : <ListingGrid listings={listings} showTax={showTax} />}
    </div>
  );
}
