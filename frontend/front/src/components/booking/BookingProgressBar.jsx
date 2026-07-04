const STEPS = ["Dates", "Review", "Confirm"];

export default function BookingProgressBar({ step }) {
  return (
    <div className="d-flex justify-content-between mb-4">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "todo";
        return (
          <div key={label} className="text-center flex-fill">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
              style={{
                width: 38,
                height: 38,
                color: "white",
                background: state === "todo" ? "#c7c7c7" : "#fe424d",
              }}
            >
              {state === "done" ? <i className="fa-solid fa-check"></i> : n}
            </div>
            <small className={state === "active" ? "fw-bold" : "text-muted"}>{label}</small>
          </div>
        );
      })}
    </div>
  );
}
