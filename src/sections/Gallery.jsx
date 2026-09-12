import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Camera,
  Upload,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import SectionHeading from "../components/SectionHeading";

const API_URL = import.meta.env.VITE_API_URL;

const fallbackPhotos = [
  {
    number: "01",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    number: "02",
    size: "",
  },
  {
    number: "03",
    size: "",
  },
  {
    number: "04",
    size: "",
  },
  {
    number: "05",
    size: "md:col-span-2",
  },
  {
    number: "06",
    size: "",
  },
];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Guest submission
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);

        if (!response.ok) {
          throw new Error("Unable to load gallery");
        }

        const data = await response.json();
        setPhotos(data.data || []);
      } catch (error) {
        console.error("Public gallery error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  // =========================
  // LIGHTBOX
  // =========================

  const openLightbox = (index) => {
    if (photos.length === 0) return;

    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  };

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return null;

      return current === 0 ? photos.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return null;

      return current === photos.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  // =========================
  // GUEST SUBMISSION
  // =========================

  const openSubmissionModal = () => {
    setShowSubmissionModal(true);
    setSubmissionSuccess(false);
    setSubmissionError("");
  };

  const closeSubmissionModal = () => {
    if (submitting) return;

    setShowSubmissionModal(false);
    setGuestName("");
    setCaption("");
    setSelectedFile(null);
    setPreviewUrl("");
    setSubmissionError("");
    setSubmissionSuccess(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSubmissionError("");

    if (!file.type.startsWith("image/")) {
      setSubmissionError("Please choose a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSubmissionError("Your photo must be smaller than 10MB.");
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmission = async (event) => {
    event.preventDefault();

    setSubmissionError("");

    if (!guestName.trim()) {
      setSubmissionError("Please enter your name.");
      return;
    }

    if (!selectedFile) {
      setSubmissionError("Please choose a photo to share.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("guestName", guestName.trim());
      formData.append("caption", caption.trim());
      formData.append("image", selectedFile);

      const response = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your photo. Please try again.",
        );
      }

      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Guest photo submission error:", error);

      setSubmissionError(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Restore scrolling if component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayPhotos = photos.length > 0 ? photos : fallbackPhotos;

  return (
    <>
      <section id="gallery" className="bg-ivory py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="A glimpse into our journey"
            title="Our Gallery"
            description="A collection of moments, memories and beautiful chapters from our journey to forever."
          />

          {/* Gallery Grid */}
          <div className="mt-16 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:auto-rows-[230px] md:grid-cols-4">
            {displayPhotos.map((photo, index) => {
              const isUploaded = photos.length > 0;

              const number = String(index + 1).padStart(2, "0");

              const fallbackSize =
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : index === 4
                    ? "md:col-span-2"
                    : "";

              const size = isUploaded ? fallbackSize : photo.size;

              return (
                <button
                  key={photo._id || photo.number || number}
                  type="button"
                  onClick={() => isUploaded && openLightbox(index)}
                  className={`group relative overflow-hidden bg-cream text-left ${size} ${
                    isUploaded ? "cursor-zoom-in" : "cursor-default"
                  }`}
                  aria-label={
                    isUploaded
                      ? `View ${photo.caption || "wedding photo"}`
                      : undefined
                  }
                >
                  {isUploaded ? (
                    <>
                      <img
                        src={getImageUrl(photo.image)}
                        alt={
                          photo.caption || "Miracle and Steve wedding memory"
                        }
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-end bg-burgundy/0 p-5 transition duration-300 group-hover:bg-burgundy/70">
                        <div className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                            {photo.category || "Our Story"}
                          </p>

                          <p className="mt-1 font-display text-xl text-white">
                            {photo.caption || "Miracle & Steve"}
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/70">
                            <Maximize2 size={11} />
                            View Photo
                          </div>
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 bg-white/90 px-3 py-2 backdrop-blur-sm">
                        <span className="text-[9px] uppercase tracking-[0.18em] text-brown">
                          {number}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-linear-to-br from-champagne/10 via-blush/10 to-coral/10 transition duration-500 group-hover:scale-105" />

                      <div className="relative flex h-full flex-col items-center justify-center">
                        <span className="font-display text-6xl text-brown/10 transition duration-500 group-hover:text-burgundy/20">
                          {photo.number}
                        </span>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-brown/25">
                          Photo coming soon
                        </p>
                      </div>

                      <div className="absolute inset-0 flex items-end bg-burgundy/0 p-5 transition duration-300 group-hover:bg-burgundy/70">
                        <div className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                            Miracle & Steve
                          </p>

                          <p className="mt-1 font-display text-xl text-white">
                            Our Story
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gallery note */}
          <div className="mx-auto mt-14 max-w-2xl text-center">
            <p className="font-display text-2xl italic text-brown/55 sm:text-3xl">
              Every picture holds a memory. Every memory tells our story.
            </p>
          </div>

          {/* Share photos */}
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={openSubmissionModal}
              className="group inline-flex items-center gap-3 rounded-full border border-brown/15 px-8 py-4 text-xs uppercase tracking-[0.2em] text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
            >
              <Camera
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:rotate-6"
              />
              Share Your Photos
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          LIGHTBOX
      ========================= */}

      {selectedIndex !== null && photos[selectedIndex] && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-brown/95 px-4 py-6 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          {/* Previous */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Main content */}
          <div
            className="relative flex max-h-[92vh] max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-h-[76vh] overflow-hidden">
              <img
                src={getImageUrl(photos[selectedIndex].image)}
                alt={
                  photos[selectedIndex].caption ||
                  "Miracle and Steve wedding memory"
                }
                className="max-h-[76vh] max-w-[88vw] object-contain shadow-2xl sm:max-w-[82vw]"
              />
            </div>

            <div className="mt-5 w-full max-w-2xl text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-champagne">
                {photos[selectedIndex].category || "Our Story"}
              </p>

              <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">
                {photos[selectedIndex].caption || "Miracle & Steve"}
              </h3>

              <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/35">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(photos.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          GUEST PHOTO SUBMISSION
      ========================= */}

      {showSubmissionModal && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center overflow-y-auto bg-brown/70 px-4 py-8 backdrop-blur-md"
          onClick={closeSubmissionModal}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden bg-ivory shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-1 bg-champagne" />

            {/* Close */}
            {!submitting && (
              <button
                type="button"
                onClick={closeSubmissionModal}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-brown/10 bg-white/80 text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            )}

            {submissionSuccess ? (
              /* =========================
                 SUCCESS STATE
              ========================= */
              <div className="px-7 py-16 text-center sm:px-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-champagne/15">
                  <CheckCircle2
                    size={38}
                    strokeWidth={1.2}
                    className="text-burgundy"
                  />
                </div>

                <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-burgundy">
                  Photo received
                </p>

                <h2 className="mt-3 font-display text-4xl text-brown sm:text-5xl">
                  Thank You
                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-brown/55">
                  Thank you for sharing this beautiful moment with us. Your
                  photo has been received and will be added to our gallery after
                  we review it.
                </p>

                <div className="mx-auto mt-8 h-px w-16 bg-champagne" />

                <p className="mt-6 font-display text-xl italic text-brown/50">
                  With love, Miracle & Steve
                </p>

                <button
                  type="button"
                  onClick={closeSubmissionModal}
                  className="mt-9 border border-brown/15 px-7 py-3 text-[9px] uppercase tracking-[0.25em] text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              /* =========================
                 FORM
              ========================= */
              <form onSubmit={handleSubmission}>
                <div className="px-7 pb-8 pt-10 sm:px-12">
                  <div className="pr-10">
                    <p className="text-[9px] uppercase tracking-[0.35em] text-burgundy">
                      Be part of our story
                    </p>

                    <h2 className="mt-2 font-display text-3xl text-brown sm:text-4xl">
                      Share Your Photos
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-brown/50">
                      Did you capture a beautiful moment with us? We would love
                      to see it.
                    </p>
                  </div>

                  {/* Error */}
                  {submissionError && (
                    <div className="mt-6 border border-burgundy/15 bg-burgundy/5 px-4 py-3 text-xs leading-5 text-burgundy">
                      {submissionError}
                    </div>
                  )}

                  {/* Guest name */}
                  <div className="mt-8">
                    <label
                      htmlFor="guestName"
                      className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-brown/55"
                    >
                      Your Name
                    </label>

                    <input
                      id="guestName"
                      type="text"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="e.g. Adaeze"
                      maxLength={100}
                      disabled={submitting}
                      className="w-full border border-brown/10 bg-white/60 px-4 py-3.5 text-sm text-brown outline-none transition placeholder:text-brown/25 focus:border-champagne disabled:opacity-50"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mt-6">
                    <label
                      htmlFor="photoCaption"
                      className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-brown/55"
                    >
                      Caption
                      <span className="ml-2 normal-case tracking-normal text-brown/25">
                        Optional
                      </span>
                    </label>

                    <input
                      id="photoCaption"
                      type="text"
                      value={caption}
                      onChange={(event) => setCaption(event.target.value)}
                      placeholder="A little note about this moment..."
                      maxLength={150}
                      disabled={submitting}
                      className="w-full border border-brown/10 bg-white/60 px-4 py-3.5 text-sm text-brown outline-none transition placeholder:text-brown/25 focus:border-champagne disabled:opacity-50"
                    />
                  </div>

                  {/* Photo upload */}
                  <div className="mt-6">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-brown/55">
                      Your Photo
                    </p>

                    {selectedFile && previewUrl ? (
                      <div className="relative overflow-hidden border border-brown/10 bg-white">
                        <div className="relative aspect-4/3">
                          <img
                            src={previewUrl}
                            alt="Selected preview"
                            className="absolute inset-0 h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={removeSelectedFile}
                            disabled={submitting}
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brown/80 text-white transition hover:bg-burgundy disabled:opacity-50"
                            aria-label="Remove photo"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs text-brown">
                              {selectedFile.name}
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                          <CheckCircle2
                            size={17}
                            className="shrink-0 text-burgundy"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="guestPhoto"
                        className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-brown/15 bg-white/40 px-6 py-10 text-center transition hover:border-champagne hover:bg-white/70"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/10 transition group-hover:bg-champagne/20">
                          <Upload
                            size={21}
                            strokeWidth={1.3}
                            className="text-burgundy"
                          />
                        </div>

                        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-brown">
                          Choose a photo
                        </p>

                        <p className="mt-2 text-[10px] leading-5 text-brown/35">
                          JPG, PNG or WEBP · Maximum 10MB
                        </p>

                        <input
                          id="guestPhoto"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={submitting}
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 flex w-full items-center justify-center gap-3 bg-burgundy px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending Your Photo...
                      </>
                    ) : (
                      <>
                        <Camera size={16} strokeWidth={1.5} />
                        Send Photo
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[9px] leading-5 text-brown/30">
                    Photos are reviewed before appearing in the wedding gallery.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
