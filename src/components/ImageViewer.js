import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function ImageViewer({
  selectedImageIndex,
  images,
  onClose,
  onPrevImage,
  onNextImage,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]"
      onClick={onClose}>
      <button
        onClick={onPrevImage}
        className="btn btn-circle btn-ghost absolute left-5 bg-white/20 hover:bg-white/40 text-white border-0">
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <div
        className="flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}>
        <img
          src={images[selectedImageIndex]}
          alt={`이미지 ${selectedImageIndex + 1}`}
          className="w-full max-w-4xl h-auto object-contain py-4"
        />
        <div className="text-white text-base font-bold">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      <button
        onClick={onNextImage}
        className="btn btn-circle btn-ghost absolute right-5 bg-white/20 hover:bg-white/40 text-white border-0">
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

export default ImageViewer;
