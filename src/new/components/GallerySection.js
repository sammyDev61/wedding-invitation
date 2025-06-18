import styles from "./styles/GallerySection.module.css";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function GallerySection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleRef = useRef(null);
  const carouselRef = useRef(null);

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

  // GSAP 스크롤 애니메이션
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger 설정 (모바일 최적화)
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // 초기 상태: 보이지 않게 설정
    gsap.set([titleRef.current, carouselRef.current], {
      opacity: 0,
      y: 30,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 70%",
        end: "center center",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: false,
      },
    });

    // 순차적 애니메이션
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    }).to(carouselRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, []);

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
        <h2 ref={titleRef} className={styles.title}>Gallery</h2>
        
        <div ref={carouselRef} className={styles.carouselContainer}>
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
