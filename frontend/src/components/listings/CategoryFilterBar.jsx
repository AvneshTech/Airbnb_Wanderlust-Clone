const CATEGORIES = [
  { key: "trending", label: "Trending", icon: "fa-fire" },
  { key: "rooms", label: "Rooms", icon: "fa-bed" },
  { key: "city", label: "Iconic cities", icon: "fa-city" },
  { key: "mountain", label: "Mountains", icon: "fa-mountain" },
  { key: "camping", label: "Camping", icon: "fa-campground" },
  { key: "farms", label: "Farms", icon: "fa-cow" },
  { key: "snow", label: "Arctic", icon: "fa-snowflake" },
  { key: "lakes", label: "Lakes", icon: "fa-water" },
  { key: "boats", label: "Boats", icon: "fa-ship" },
  { key: "beach", label: "Beach", icon: "fa-umbrella-beach" },
];

export default function CategoryFilterBar({ active, onSelect, showTax, onToggleTax }) {
  return (
    <div id="filters" className="d-flex align-items-center">
      {CATEGORIES.map((c) => (
        <div
          key={c.key}
          className="filter"
          style={{ opacity: active === c.key ? 1 : undefined }}
          onClick={() => onSelect(active === c.key ? "" : c.key)}
          role="button"
        >
          <div><i className={`fa-solid ${c.icon}`}></i></div>
          <p>{c.label}</p>
        </div>
      ))}

      <div className="tax-toggle form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="taxSwitch"
          checked={showTax}
          onChange={onToggleTax}
        />
        <label className="form-check-label ms-2" htmlFor="taxSwitch">
          Display total before taxes
        </label>
      </div>
    </div>
  );
}
