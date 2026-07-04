import { useState } from "react";

const CATEGORIES = ["beach","mountain","city","farms","snow","lakes","camping","boats","rooms","trending"];

// Shared by Create + Edit via the `mode` prop.
export default function ListingForm({ mode = "create", initial = {}, onSubmit, submitting }) {
  const [values, setValues] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price ?? "",
    location: initial.location || "",
    country: initial.country || "",
    category: initial.category || "trending",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  // Client-side validation mirroring the Joi rules.
  const validate = () => {
    const errs = {};
    if (!values.title.trim()) errs.title = "Title is required";
    if (!values.description.trim()) errs.description = "Description is required";
    if (values.price === "" || Number(values.price) < 0) errs.price = "Price must be 0 or more";
    if (!values.location.trim()) errs.location = "Location is required";
    if (!values.country.trim()) errs.country = "Country is required";
    if (!CATEGORIES.includes(values.category)) errs.category = "Pick a valid category";
    if (mode === "create" && !file) errs.image = "Image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    if (file) formData.append("image", file);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="col-md-8 offset-md-2">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input name="title" className="form-control" value={values.title} onChange={handleChange} />
        {errors.title && <div className="text-danger small">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea name="description" className="form-control" rows="3" value={values.description} onChange={handleChange} />
        {errors.description && <div className="text-danger small">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Image {mode === "edit" && <span className="text-muted">(leave empty to keep current)</span>}</label>
        <input type="file" accept="image/*" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
        {errors.image && <div className="text-danger small">{errors.image}</div>}
      </div>

      <div className="row">
        <div className="mb-3 col-md-4">
          <label className="form-label">Price (per night)</label>
          <input type="number" name="price" min="0" className="form-control" value={values.price} onChange={handleChange} />
          {errors.price && <div className="text-danger small">{errors.price}</div>}
        </div>
        <div className="mb-3 col-md-4">
          <label className="form-label">Location</label>
          <input name="location" className="form-control" value={values.location} onChange={handleChange} />
          {errors.location && <div className="text-danger small">{errors.location}</div>}
        </div>
        <div className="mb-3 col-md-4">
          <label className="form-label">Country</label>
          <input name="country" className="form-control" value={values.country} onChange={handleChange} />
          {errors.country && <div className="text-danger small">{errors.country}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select name="category" className="form-select" value={values.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <div className="text-danger small">{errors.category}</div>}
      </div>

      <button className="btn add-btn text-white" disabled={submitting}>
        {submitting ? "Saving..." : mode === "create" ? "Add listing" : "Save changes"}
      </button>
    </form>
  );
}
