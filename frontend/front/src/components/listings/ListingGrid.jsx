import ListingCard from "./ListingCard.jsx";

export default function ListingGrid({ listings, showTax }) {
  if (!listings.length) {
    return <p className="text-center text-muted py-5">No listings found.</p>;
  }
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mt-3">
      {listings.map((l) => (
        <ListingCard key={l._id} listing={l} showTax={showTax} />
      ))}
    </div>
  );
}
