import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const SingleProductImageModal = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  productName,
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "0":
          e.preventDefault();
          handleResetZoom();
          break;
      }
    },
    [isOpen, onClose]
  );

  // Add event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (scale === 1) {
      handleZoomIn();
    } else {
      handleResetZoom();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;

    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;

    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000039] backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          title="Reset Zoom (0)"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div
          className="relative max-w-full max-h-full overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
              scale > 1 ? "cursor-grab" : "cursor-zoom-in"
            } ${isDragging ? "cursor-grabbing" : ""}`}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}
            onClick={handleImageClick}
          />
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                currentIndex === index
                  ? "border-white ring-2 ring-white ring-opacity-50"
                  : "border-gray-500 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Level Indicator */}
      {scale > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};

export default SingleProductImageModal;
