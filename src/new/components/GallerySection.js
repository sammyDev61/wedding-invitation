import styles from "./styles/GallerySection.module.css";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";

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
      e.preventDefault();
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextImage();
    } else if (e.key === 'Escape' && isModalOpen) {
      e.preventDefault();
      handleCloseModal();
    }
    // 개발자 도구 단축키 방지
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  };

  // 우클릭 방지
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // 드래그 방지
  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  // 선택 방지 (CSS로 처리하므로 함수는 유지하되 사용하지 않음)
  const handleSelectStart = (e) => {
    e.preventDefault();
    return false;
  };

  // 이미지 로드 후 보호 속성 추가
  const handleImageLoad = (e) => {
    e.target.setAttribute('draggable', 'false');
    e.target.style.userSelect = 'none';
    e.target.style.WebkitUserSelect = 'none';
    e.target.style.MozUserSelect = 'none';
    e.target.style.msUserSelect = 'none';
    e.target.style.pointerEvents = 'none';
  };

  // 개발자 도구 감지 (Safari 호환성 개선)
  useEffect(() => {
    // Safari 감지
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
      // Safari에서는 개발자 도구 감지 비활성화 (너무 민감함)
      return;
    }

    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 200; // 임계값 증가로 오감지 줄임

    const checkDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial; font-size: 24px; color: #333;">개발자 도구가 감지되었습니다.</div>';
        }
      } else {
        devtools.open = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000); // 체크 주기 늘림

    // 콘솔 로그 방지
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};

    return () => {
      clearInterval(interval);
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // 이미지 보호를 위한 전역 이벤트 리스너
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    };

    const handleGlobalContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleGlobalSelectStart = (e) => {
      // 이미지나 갤러리 컨테이너 내부에서만 선택 방지
      if (e.target.tagName === 'IMG' || e.target.closest('.container')) {
        e.preventDefault();
        return false;
      }
    };

    const handleGlobalDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('selectstart', handleGlobalSelectStart);
    document.addEventListener('dragstart', handleGlobalDragStart);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('selectstart', handleGlobalSelectStart);
      document.removeEventListener('dragstart', handleGlobalDragStart);
    };
  }, []);

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

  // 실제 뷰포트 높이 계산 (모바일 주소창 문제 해결)
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
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
    <div 
      className={styles.container} 
      onKeyDown={handleKeyDown} 
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      tabIndex={0}
    >
      <div className={styles.content}>
        <h2 ref={titleRef} className={styles.title}>Gallery</h2>
        
        <div ref={carouselRef} className={styles.carouselContainer}>
          <button 
            className={styles.navButton} 
            onClick={handlePrevImage}
            aria-label="이전 이미지"
          >
            <IoIosArrowBack />
          </button>
          
          <div className={styles.polaroidFrame} onClick={handleImageClick}>
            <div className={styles.polaroidInner}>
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className={styles.carouselImage}
                loading="lazy"
                decoding="async"
                draggable="false"
                onLoad={handleImageLoad}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'none'
                }}
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
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      {/* 확대 보기 모달 */}
      {isModalOpen && createPortal(
        <div 
          className={styles.modal} 
          onClick={handleCloseModal}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseModal}
              aria-label="닫기"
            >
              <IoMdClose />
            </button>
            
            <button 
              className={styles.modalNavButton} 
              onClick={handlePrevImage}
              style={{ left: '20px' }}
              aria-label="이전 이미지"
            >
              <IoIosArrowBack />
            </button>
            
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={styles.modalImage}
              draggable="false"
              onLoad={handleImageLoad}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
                             style={{
                 userSelect: 'none',
                 WebkitUserSelect: 'none',
                 MozUserSelect: 'none',
                 msUserSelect: 'none',
                 pointerEvents: 'none'
               }}
            />
            
            <button 
              className={styles.modalNavButton} 
              onClick={handleNextImage}
              style={{ right: '20px' }}
              aria-label="다음 이미지"
            >
              <IoIosArrowForward />
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
