import styles from "./styles/GallerySection.module.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function GallerySection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이미지 개수 설정 (필요시 변경 가능)
  const TOTAL_IMAGES = 24;
  
  // 동적으로 이미지 배열 생성
  const images = Array.from({ length: TOTAL_IMAGES }, (_, index) => {
    const imageNumber = (index + 1).toString().padStart(3, '0');
    return {
      src: `/new_gallery/${imageNumber}.jpg`,
      alt: `갤러리 이미지 ${index + 1}`,
    };
  });

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    } else if (e.key === 'Escape' && isModalOpen) {
      handleCloseModal();
    }
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  // 모달이 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className={styles.container} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className={styles.content}>
        <h2 className={styles.title}>Gallery</h2>
        
        <div className={styles.carouselContainer}>
          <button 
            className={styles.navButton} 
            onClick={handlePrevImage}
            aria-label="이전 이미지"
          >
            ❮
          </button>
          
          <div className={styles.polaroidFrame} onClick={handleImageClick}>
            <div className={styles.polaroidInner}>
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className={styles.carouselImage}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.polaroidCaption}>
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={handleNextImage}
            aria-label="다음 이미지"
          >
            ❯
          </button>
        </div>
      </div>

      {/* 확대 보기 모달 */}
      {isModalOpen && createPortal(
        <div 
          className={styles.modal} 
          onClick={handleCloseModal}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseModal}
              aria-label="닫기"
            >
              ✕
            </button>
            
            <button 
              className={styles.modalNavButton} 
              onClick={handlePrevImage}
              style={{ left: '20px' }}
              aria-label="이전 이미지"
            >
              ❮
            </button>
            
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={styles.modalImage}
            />
            
            <button 
              className={styles.modalNavButton} 
              onClick={handleNextImage}
              style={{ right: '20px' }}
              aria-label="다음 이미지"
            >
              ❯
            </button>

            <div className={styles.modalImageCounter}>
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default GallerySection;
