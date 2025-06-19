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
  
  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTouchMove, setIsTouchMove] = useState(false);
  const [isMultiTouch, setIsMultiTouch] = useState(false);
  const [isPinchZoom, setIsPinchZoom] = useState(false);
  
  // 애니메이션 관련 상태
  const [isSliding, setIsSliding] = useState(false);
  const modalImageRef = useRef(null);

  // 카운터 표시 관련 상태
  const [showCounter, setShowCounter] = useState(true);
  const counterTimerRef = useRef(null);

  // 이미지 개수 설정 (필요시 변경 가능)
  const TOTAL_IMAGES = 15;
  
  // 카운터 자동 숨김 시간 (밀리초)
  const COUNTER_HIDE_DELAY = 1500;
  
  // 동적으로 이미지 배열 생성
  const images = Array.from({ length: TOTAL_IMAGES }, (_, index) => {
    const imageNumber = (index + 1).toString().padStart(3, '0');
    return {
      src: `/new_gallery/${imageNumber}.jpg`,
      alt: `갤러리 이미지 ${index + 1}`,
    };
  });

  // 모바일 감지 함수
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  // 스와이프 감지 최소 거리
  const minSwipeDistance = 50;

  // 카운터 표시 및 타이머 관리
  const showCounterWithTimer = () => {
    setShowCounter(true);
    
    // 기존 타이머가 있으면 제거
    if (counterTimerRef.current) {
      clearTimeout(counterTimerRef.current);
    }
    
    // 새 타이머 설정
    counterTimerRef.current = setTimeout(() => {
      setShowCounter(false);
    }, COUNTER_HIDE_DELAY);
  };

  // 슬라이드 애니메이션을 포함한 이미지 변경 함수
  const slideToImage = (newIndex, direction) => {
    if (isSliding) return;
    
    setIsSliding(true);
    
    // 이미지 변경 시 카운터 표시
    showCounterWithTimer();
    
    // 애니메이션 실행
    if (modalImageRef.current) {
      const slideInDistance = direction === 'left' ? '100%' : '-100%';
      
      // 애니메이션 시작 전 will-change 속성 설정
      modalImageRef.current.style.willChange = 'transform, opacity';
      
      // 이미지를 완전히 숨김 (즉시)
      gsap.set(modalImageRef.current, {
        opacity: 0,
        scale: 0.9
      });
      
      // 짧은 지연 후 이미지 인덱스 변경
      setTimeout(() => {
        setCurrentImageIndex(newIndex);
        
        // 한 프레임 더 기다린 후 애니메이션 시작
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (modalImageRef.current) {
              // 새 이미지를 반대편에 배치
              gsap.set(modalImageRef.current, {
                x: slideInDistance,
                opacity: 0,
                scale: 0.9
              });
              
              // 새 이미지를 슬라이드 인
              gsap.to(modalImageRef.current, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                  setIsSliding(false);
                  // 애니메이션 완료 후 will-change 속성 제거
                  if (modalImageRef.current) {
                    modalImageRef.current.style.willChange = 'auto';
                  }
                }
              });
            }
          });
        });
      }, 50); // 50ms 지연으로 확실한 상태 변경 보장
    } else {
      // 모달이 열려있지 않은 경우 애니메이션 없이 바로 변경
      setCurrentImageIndex(newIndex);
      setIsSliding(false);
    }
  };

  const handlePrevImage = () => {
    if (isSliding) return;
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    
    if (isModalOpen) {
      slideToImage(newIndex, 'right');
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  const handleNextImage = () => {
    if (isSliding) return;
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    
    if (isModalOpen) {
      slideToImage(newIndex, 'left');
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSliding(false);
    setIsTouchMove(false);
    setIsMultiTouch(false);
    setIsPinchZoom(false);
    setShowCounter(true);
    
    // 타이머 정리
    if (counterTimerRef.current) {
      clearTimeout(counterTimerRef.current);
      counterTimerRef.current = null;
    }
  };

  // 모달 배경 클릭 핸들러 (터치 이벤트와 구분)
  const handleModalBackgroundClick = (e) => {
    // 터치 이동이나 핀치 줌이 있었다면 클릭으로 처리하지 않음
    if (isTouchMove || isPinchZoom) {
      setIsTouchMove(false);
      setIsPinchZoom(false);
      return;
    }
    
    // 이벤트 대상이 모달 배경인 경우에만 닫기
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 터치 시작 핸들러
  const onTouchStart = (e) => {
    setIsTouchMove(false);
    
    // 멀티터치 감지 (핀치 줌)
    if (e.touches && e.touches.length > 1) {
      setIsMultiTouch(true);
      setIsPinchZoom(true);
      return;
    }
    
    setIsMultiTouch(false);
    
    if (!isModalOpen || !isMobileDevice() || isSliding || isPinchZoom) return;
    setTouchEnd(null); // 이전 터치 이벤트 리셋
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 터치 이동 핸들러
  const onTouchMove = (e) => {
    setIsTouchMove(true);
    
    // 멀티터치 중이면 스와이프 처리하지 않음
    if (e.touches && e.touches.length > 1) {
      setIsMultiTouch(true);
      setIsPinchZoom(true);
      return;
    }
    
    // 핀치 줌 상태에서는 스와이프 처리하지 않음
    if (!isModalOpen || !isMobileDevice() || isSliding || isPinchZoom || isMultiTouch) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 터치 종료 핸들러
  const onTouchEnd = (e) => {
    // 터치가 완전히 끝났는지 확인 (모든 손가락이 떨어졌는지)
    if (e.touches && e.touches.length > 0) {
      return; // 아직 터치가 남아있음
    }
    
    // 멀티터치였다면 핀치 줌 상태 해제
    if (isMultiTouch || isPinchZoom) {
      setIsMultiTouch(false);
      // 핀치 줌 상태는 조금 더 유지 (연속 핀치 방지)
      setTimeout(() => {
        setIsPinchZoom(false);
      }, 100);
      return;
    }
    
    if (!isModalOpen || !isMobileDevice() || isSliding || isPinchZoom) return;
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handleKeyDown = (e) => {
    if (isSliding) return;
    
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

  // 모달이 열릴 때 카운터 표시 및 타이머 시작
  useEffect(() => {
    if (isModalOpen) {
      showCounterWithTimer();
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (counterTimerRef.current) {
        clearTimeout(counterTimerRef.current);
      }
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
            disabled={isSliding}
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
            disabled={isSliding}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      {/* 확대 보기 모달 */}
      {isModalOpen && createPortal(
        <div 
          className={styles.modal} 
          onClick={handleModalBackgroundClick}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className={styles.modalContent}
          >
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
              disabled={isSliding}
            >
              <IoIosArrowBack />
            </button>
            
            <img
              ref={modalImageRef}
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={`${styles.modalImage} ${isSliding ? styles.sliding : ''}`}
              draggable="false"
              onLoad={handleImageLoad}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                pointerEvents: 'auto',
                touchAction: 'pinch-zoom'
              }}
            />
            
            <button 
              className={styles.modalNavButton} 
              onClick={handleNextImage}
              style={{ right: '20px' }}
              aria-label="다음 이미지"
              disabled={isSliding}
            >
              <IoIosArrowForward />
            </button>

            <div className={`${styles.modalImageCounter} ${showCounter ? styles.counterVisible : styles.counterHidden}`}>
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
