import styles from "./styles/GallerySection.module.css";
import { useState } from "react";

function GallerySection() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const images = [
    {
      src: "/gallery/1.jpg",
      alt: "갤러리 이미지 1",
    },
    {
      src: "/gallery/2.jpg",
      alt: "갤러리 이미지 2",
    },
    {
      src: "/gallery/3.jpg",
      alt: "갤러리 이미지 3",
    },
    {
      src: "/gallery/4.jpg",
      alt: "갤러리 이미지 4",
    },
    {
      src: "/gallery/5.jpg",
      alt: "갤러리 이미지 5",
    },
    {
      src: "/gallery/6.jpg",
      alt: "갤러리 이미지 6",
    },
    {
      src: "/gallery/7.jpg",
      alt: "갤러리 이미지 7",
    },
    {
      src: "/gallery/8.jpg",
      alt: "갤러리 이미지 8",
    },
    {
      src: "/gallery/9.jpg",
      alt: "갤러리 이미지 9",
    },
    {
      src: "/gallery/10.jpg",
      alt: "갤러리 이미지 10",
    },
    {
      src: "/gallery/11.jpg",
      alt: "갤러리 이미지 11",
    },
    {
      src: "/gallery/12.jpg",
      alt: "갤러리 이미지 12",
    },
    {
      src: "/gallery/13.jpg",
      alt: "갤러리 이미지 13",
    },
    {
      src: "/gallery/14.jpg",
      alt: "갤러리 이미지 14",
    },
    {
      src: "/gallery/15.jpg",
      alt: "갤러리 이미지 15",
    },
    {
      src: "/gallery/16.jpg",
      alt: "갤러리 이미지 16",
    },
    {
      src: "/gallery/17.jpg",
      alt: "갤러리 이미지 17",
    },
    {
      src: "/gallery/18.jpg",
      alt: "갤러리 이미지 18",
    },
    {
      src: "/gallery/19.jpg",
      alt: "갤러리 이미지 19",
    },
    {
      src: "/gallery/20.jpg",
      alt: "갤러리 이미지 20",
    },
  ];

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleClosePopup = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleKeyDown = (e) => {
    if (selectedImageIndex === null) return;
    
    if (e.key === 'ArrowLeft') {
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    } else if (e.key === 'Escape') {
      handleClosePopup();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>갤러리</h2>
        <div className={styles.galleryContainer}>
          <div className={styles.gallery}>
            {images.map((image, index) => (
              <div 
                key={index} 
                className={styles.imageWrapper}
                onClick={() => handleImageClick(index)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div 
          className={styles.popup} 
          onClick={handleClosePopup}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleClosePopup}>
              ✕
            </button>
            <button className={styles.navButton} onClick={handlePrevImage} style={{ left: 0 }}>
              ❮
            </button>
            <img
              src={images[selectedImageIndex].src}
              alt={images[selectedImageIndex].alt}
              className={styles.popupImage}
            />
            <button className={styles.navButton} onClick={handleNextImage} style={{ right: 0 }}>
              ❯
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GallerySection;
