import { useState, useEffect } from "react";

import SectionTitle from "./SectionTitle";
import ImageViewer from "./ImageViewer";

import styles from "./GallerySection.module.css";

function GallerySection() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 클린업 -> 초기 상태로 돌려놓기
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImageIndex]);

  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg",
    "/gallery/7.jpg",
    "/gallery/8.jpg",
    "/gallery/9.jpg",
  ];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      <SectionTitle text="Gallery" />
      <div className={styles.galleryGrid}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`gallery-${index}`}
            className={styles.galleryImage}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>

      {selectedImageIndex !== null && (
        <ImageViewer
          selectedImageIndex={selectedImageIndex}
          images={images}
          onClose={() => setSelectedImageIndex(null)}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
        />
      )}
    </div>
  );
}

export default GallerySection;
