import { useEffect, useMemo, useRef, useState } from "react";

import {
  ImagePlus,
  Upload,
  Pencil,
  Trash2,
  Star,
  X,
  Loader2,
  Images,
  RefreshCw,
  CheckCircle2,
  Camera,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const categories = [
  "Pre-Wedding",
  "Traditional Wedding",
  "White Wedding",
  "Couple",
  "Bridesmaids",
  "Groom & Groomsmen",
  "Family",
  "Reception",
];

const emptyForm = {
  caption: "",
  category: "Pre-Wedding",
  featured: false,
  order: 0,
};

export default function Gallery() {
  const fileInputRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // ------------------------------------
  // IMAGE URL
  // ------------------------------------

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  // ------------------------------------
  // FETCH GALLERY
  // ------------------------------------

  const fetchGallery = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/gallery/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load gallery.");
      }

      setPhotos(data.data || []);
    } catch (err) {
      console.error("Gallery fetch error:", err);
      setError(err.message || "Unable to load gallery.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ------------------------------------
  // GALLERY STATS
  // ------------------------------------

  const featuredCount = useMemo(
    () => photos.filter((photo) => photo.featured).length,
    [photos],
  );

  const categoryCount = useMemo(() => {
    return new Set(photos.map((photo) => photo.category).filter(Boolean)).size;
  }, [photos]);

  const latestPhoto = useMemo(() => {
    if (!photos.length) return null;

    return [...photos].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    )[0];
  }, [photos]);

  // ------------------------------------
  // OPEN ADD MODAL
  // ------------------------------------

  const openAddModal = () => {
    setEditingPhoto(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreview("");
    setError("");
    setModalOpen(true);
  };

  // ------------------------------------
  // OPEN EDIT MODAL
  // ------------------------------------

  const openEditModal = (photo) => {
    setEditingPhoto(photo);

    setForm({
      caption: photo.caption || "",
      category: photo.category || "Pre-Wedding",
      featured: Boolean(photo.featured),
      order: photo.order || 0,
    });

    setSelectedFile(null);
    setPreview(photo.image || "");
    setError("");
    setModalOpen(true);
  };

  // ------------------------------------
  // CLOSE MODAL
  // ------------------------------------

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingPhoto(null);
    setSelectedFile(null);
    setPreview("");
    setForm(emptyForm);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ------------------------------------
  // FILE VALIDATION
  // ------------------------------------

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // ------------------------------------
  // FILE SELECTION
  // ------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  // ------------------------------------
  // DRAG & DROP
  // ------------------------------------

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    processFile(file);
  };

  // ------------------------------------
  // FORM CHANGE
  // ------------------------------------

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ------------------------------------
  // SAVE PHOTO
  // ------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingPhoto && !selectedFile) {
      setError("Please select an image.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      formData.append("caption", form.caption);
      formData.append("category", form.category);
      formData.append("featured", String(form.featured));
      formData.append("order", String(Number(form.order) || 0));

      const url = editingPhoto
        ? `${API_URL}/api/gallery/${editingPhoto._id}`
        : `${API_URL}/api/gallery`;

      const response = await fetch(url, {
        method: editingPhoto ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to save gallery photo.");
      }

      await fetchGallery();
      closeModal();
    } catch (err) {
      console.error("Gallery save error:", err);
      setError(err.message || "Unable to save gallery photo.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------
  // DELETE PHOTO
  // ------------------------------------

  const handleDelete = async (photo) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(photo._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/gallery/${photo._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete photo.");
      }

      setPhotos((current) => current.filter((item) => item._id !== photo._id));
    } catch (err) {
      console.error("Gallery delete error:", err);
      setError(err.message || "Unable to delete photo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-brown/10 bg-white">
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
              Miracle & Steve
            </p>

            <h1 className="mt-2 font-display text-3xl text-brown">
              Wedding Gallery
            </h1>

            <p className="mt-2 text-sm text-brown/45">
              Manage the beautiful memories displayed on your wedding website.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fetchGallery(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brown/10 bg-white px-5 py-3 text-xs uppercase tracking-[0.15em] text-brown transition hover:border-champagne disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-brown/90"
            >
              <ImagePlus size={16} />
              Add Photo
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {/* ERROR */}

        {error && !modalOpen && (
          <div className="border border-burgundy/10 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">
            {error}
          </div>
        )}

        {/* =========================================
            OVERVIEW CARDS
        ========================================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <GalleryStat
            icon={Images}
            label="Total Photos"
            value={photos.length}
            description="Memories in your gallery"
          />

          <GalleryStat
            icon={Star}
            label="Featured"
            value={featuredCount}
            description="Photos highlighted publicly"
          />

          <GalleryStat
            icon={Camera}
            label="Categories"
            value={categoryCount}
            description="Gallery sections in use"
          />

          <GalleryStat
            icon={CheckCircle2}
            label="Gallery Status"
            value={photos.length > 0 ? "Active" : "Empty"}
            description={
              photos.length > 0
                ? "Photos ready for your website"
                : "Add your first memory"
            }
          />
        </div>

        {/* =========================================
            INTRO / GALLERY OVERVIEW
        ========================================= */}

        <div className="border border-brown/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                Your Memories
              </p>

              <h2 className="mt-2 font-display text-2xl text-brown">
                Wedding Gallery
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-brown/40">
                Upload and organise your favourite moments from your pre-wedding
                journey, traditional wedding, white wedding, bridal party and
                reception.
              </p>
            </div>

            {latestPhoto && (
              <div className="flex items-center gap-3 border border-brown/10 bg-ivory px-4 py-3">
                <div className="h-12 w-12 overflow-hidden">
                  <img
                    src={getImageUrl(latestPhoto.image)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
                    Latest Memory
                  </p>

                  <p className="mt-1 max-w-40 truncate text-xs text-brown">
                    {latestPhoto.caption || "Untitled photo"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            GALLERY
        ========================================= */}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center border border-brown/10 bg-white">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw size={25} className="animate-spin text-champagne" />

              <p className="text-xs uppercase tracking-[0.18em] text-brown/35">
                Loading gallery...
              </p>
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex min-h-105 flex-col items-center justify-center border border-dashed border-brown/15 bg-white px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
              <Images size={28} className="text-champagne" />
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-champagne">
              Gallery
            </p>

            <h2 className="mt-2 font-display text-2xl text-brown">
              Your gallery is empty
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-brown/40">
              Start adding your favourite pre-wedding photos and wedding
              memories. They'll automatically appear on your public wedding
              website.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brown px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-brown/90"
            >
              <ImagePlus size={16} />
              Add your first photo
            </button>
          </div>
        ) : (
          <div>
            {/* Section heading */}

            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                Memories
              </p>

              <h2 className="mt-2 font-display text-2xl text-brown">
                All Gallery Photos
              </h2>
            </div>

            {/* Gallery Grid */}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="group border border-brown/10 bg-white"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-4/3 overflow-hidden bg-brown/5">
                    <img
                      src={getImageUrl(photo.image)}
                      alt={photo.caption || "Wedding gallery"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* Featured */}

                    {photo.featured && (
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-white/95 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-brown shadow-sm backdrop-blur">
                        <Star
                          size={12}
                          className="fill-champagne text-champagne"
                        />
                        Featured
                      </div>
                    )}

                    {/* Category */}

                    <div className="absolute bottom-4 left-4 bg-brown/80 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur">
                      {photo.category}
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-brown/30">
                          Caption
                        </p>

                        <h3 className="mt-1 truncate font-display text-lg text-brown">
                          {photo.caption || "Untitled photo"}
                        </h3>

                        <p className="mt-2 text-[10px] text-brown/30">
                          Display order: {photo.order || 0}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(photo)}
                          className="flex h-9 w-9 items-center justify-center border border-brown/10 text-brown/45 transition hover:border-champagne hover:text-champagne"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(photo)}
                          disabled={deletingId === photo._id}
                          className="flex h-9 w-9 items-center justify-center border border-brown/10 text-brown/35 transition hover:border-burgundy/20 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === photo._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          ADD / EDIT MODAL
      ========================================= */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto border border-brown/10 bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-brown/10 px-6 py-6 sm:px-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                  Gallery Manager
                </p>

                <h2 className="mt-2 font-display text-2xl text-brown">
                  {editingPhoto ? "Edit Photo" : "Add Photo"}
                </h2>

                <p className="mt-1 text-xs text-brown/40">
                  {editingPhoto
                    ? "Update this memory in your wedding gallery."
                    : "Add a new memory to your wedding gallery."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center border border-brown/10 text-brown/40 transition hover:border-champagne hover:text-champagne"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}

            <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-8">
              {error && (
                <div className="border border-burgundy/10 bg-burgundy/5 px-4 py-3 text-xs text-burgundy">
                  {error}
                </div>
              )}

              {/* IMAGE UPLOAD */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[9px] uppercase tracking-[0.18em] text-brown/45">
                    Photo
                  </label>

                  <span className="text-[9px] text-brown/25">Max 10MB</span>
                </div>

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer overflow-hidden border border-dashed border-brown/15 bg-ivory transition hover:border-champagne"
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={selectedFile ? preview : getImageUrl(preview)}
                        alt="Preview"
                        className="max-h-80 w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brown/80 to-transparent px-5 pb-5 pt-16">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white">
                          Click to replace image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/10">
                        <Upload size={22} className="text-champagne" />
                      </div>

                      <p className="mt-5 font-display text-xl text-brown">
                        Drop your image here
                      </p>

                      <p className="mt-2 text-xs text-brown/40">
                        Or click to browse from your computer
                      </p>

                      <p className="mt-3 text-[9px] uppercase tracking-[0.12em] text-brown/25">
                        JPG • JPEG • PNG • WEBP
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* CAPTION */}

              <div>
                <label
                  htmlFor="caption"
                  className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-brown/45"
                >
                  Caption
                </label>

                <input
                  id="caption"
                  name="caption"
                  type="text"
                  value={form.caption}
                  onChange={handleChange}
                  placeholder="e.g. Miracle & Steve"
                  className="w-full border border-brown/10 bg-white px-4 py-3 text-sm text-brown outline-none transition placeholder:text-brown/25 focus:border-champagne"
                />
              </div>

              {/* CATEGORY + ORDER */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-brown/45"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-brown/10 bg-white px-4 py-3 text-sm text-brown outline-none transition focus:border-champagne"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="order"
                    className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-brown/45"
                  >
                    Display Order
                  </label>

                  <input
                    id="order"
                    name="order"
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={handleChange}
                    className="w-full border border-brown/10 bg-white px-4 py-3 text-sm text-brown outline-none transition focus:border-champagne"
                  />
                </div>
              </div>

              {/* FEATURED */}

              <label className="flex cursor-pointer items-center justify-between border border-brown/10 bg-ivory p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/10">
                    <Star size={17} className="text-champagne" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-brown">
                      Featured photo
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-brown/35">
                      Highlight this photo on the public gallery.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#8B6F47]"
                />
              </label>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-brown/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="border border-brown/10 px-6 py-3 text-xs uppercase tracking-[0.15em] text-brown transition hover:border-champagne disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-brown px-7 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-brown/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}

                  {saving
                    ? "Saving..."
                    : editingPhoto
                      ? "Save Changes"
                      : "Add Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function GalleryStat({ icon: Icon, label, value, description }) {
  return (
    <div className="border border-brown/10 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/10">
          <Icon size={17} className="text-champagne" />
        </div>

        <CheckCircle2 size={15} className="text-brown/10" />
      </div>

      <p className="mt-6 text-[9px] uppercase tracking-[0.2em] text-brown/35">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl text-brown">{value}</p>

      <p className="mt-2 text-[10px] text-brown/30">{description}</p>
    </div>
  );
}
