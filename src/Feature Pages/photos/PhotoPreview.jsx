import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useImageContext } from "../../context/ImageContext";
import { useEffect } from "react";

const ImagePreview = () => {
  const { imagePreview, setImagePreview, images } = useImageContext();

  const currentIndex = images.findIndex((img) => img._id === imagePreview?._id);

  useEffect(() => {
    if (!imagePreview) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setImagePreview(null);
      if (e.key === "ArrowLeft" && currentIndex > 0) showPrev();
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [imagePreview, currentIndex]);

  if (!imagePreview) return null;

  const showPrev = () => {
    if (currentIndex > 0) {
      setImagePreview(images[currentIndex - 1]);
    }
  };

  const showNext = () => {
    if (currentIndex < images.length - 1) {
      setImagePreview(images[currentIndex + 1]);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setImagePreview(null);
    }
  };

  return (
    <div className="preview-overlay" onClick={handleOverlayClick}>
      <div className="preview-container">
        <div className="preview-header">
          <span
            className="close-btn"
            onClick={() => setImagePreview(null)}
            aria-label="Close preview"
          >
            <X size={24} />
          </span>
        </div>

        <div className="preview-body">
          {currentIndex > 0 && (
            <button
              className="nav-arrow left"
              onClick={showPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <div className="image-wrapper">
            <img
              src={imagePreview.mediumUrl || imagePreview.imageUrl}
              alt={imagePreview.name}
              className="preview-image"
            />
          </div>

          {currentIndex < images.length - 1 && (
            <button
              className="nav-arrow right"
              onClick={showNext}
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>

        <div className="preview-footer">
          <h3 className="image-name">{imagePreview.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;