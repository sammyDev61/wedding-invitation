import styles from "./styles/GallerySection.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
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
  
  // 이미지 확대 상태 관리
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  
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
      src: `${process.env.PUBLIC_URL}/new_gallery/${imageNumber}.jpg`,
      alt: `갤러리 이미지 ${index + 1}`,
    };
  });

  // 이미지 프리로딩 상태
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  
  // 이미지 프리로딩 함수
  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(src)) {
        resolve();
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(src));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [preloadedImages]);

  // 초기 이미지 프리로딩 (우선순위 기반)
  useEffect(() => {
    let isMounted = true;
    let backgroundTimeout;
    
    const preloadInitialImages = async () => {
      try {
        if (!isMounted) return;
        
        // 현재 이미지부터 우선 로드
        await preloadImage(images[currentImageIndex].src);
        
        if (!isMounted) return;
        
        // 주변 이미지들 순차적으로 로드
        for (let i = 1; i <= 3; i++) {
          const prevIndex = (currentImageIndex - i + images.length) % images.length;
          const nextIndex = (currentImageIndex + i) % images.length;
          
          // 비동기적으로 백그라운드에서 로드 (await 하지 않음)
          preloadImage(images[prevIndex].src).catch(() => {});
          preloadImage(images[nextIndex].src).catch(() => {});
        }
        
        // 나머지 이미지들은 백그라운드에서 천천히 로드
        backgroundTimeout = setTimeout(async () => {
          for (let i = 0; i < images.length; i++) {
            if (!isMounted) break;
            if (!preloadedImages.has(images[i].src)) {
              await preloadImage(images[i].src);
              // 각 이미지 사이에 작은 지연으로 메인 스레드 블로킹 방지
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Preload initial images error:', error);
      }
    };

    preloadInitialImages();
    
    return () => {
      isMounted = false;
      if (backgroundTimeout) {
        clearTimeout(backgroundTimeout);
      }
    };
  }, [preloadImage, images, currentImageIndex, preloadedImages]);

  // 현재 이미지 변경 시 주변 이미지 즉시 프리로딩
  useEffect(() => {
    const preloadAdjacentImages = async () => {
      const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      const nextIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      
      // 즉시 필요한 이미지들 우선 로드
      await Promise.all([
        preloadImage(images[prevIndex].src),
        preloadImage(images[nextIndex].src)
      ]);
    };

    preloadAdjacentImages();
  }, [currentImageIndex, images, preloadImage]);

  // 모바일 감지 함수
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }, []);

  // 카카오 웹뷰 감지 함수
  const isKakaoWebView = useCallback(() => {
    return /KAKAOTALK/i.test(navigator.userAgent);
  }, []);

  // 네이버 웹뷰 감지 함수 (추가로 포함)
  const isNaverWebView = useCallback(() => {
    return /NAVER/i.test(navigator.userAgent);
  }, []);

  // 웹뷰 환경 감지
  const isWebView = useCallback(() => {
    return isKakaoWebView() || isNaverWebView();
  }, [isKakaoWebView, isNaverWebView]);

  // 디버깅용 - 환경 정보 출력 (개발 시에만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        const debugInfo = {
          userAgent: navigator.userAgent || 'unknown',
          isKakaoWebView: isKakaoWebView(),
          isNaverWebView: isNaverWebView(),
          isWebView: isWebView(),
          isMobile: isMobileDevice(),
          totalImages: images.length,
          preloadedCount: preloadedImages.size,
          publicUrl: process.env.PUBLIC_URL || 'empty',
          sampleImageSrc: images[0]?.src || 'no images'
        };
        console.log('Gallery Environment:', debugInfo);
      } catch (error) {
        console.error('Debug info error:', error);
      }
    }
  }, [preloadedImages.size, images, isKakaoWebView, isNaverWebView, isWebView, isMobileDevice]);

  // 스와이프 감지 최소 거리
  const minSwipeDistance = 50;

  // 두 터치 포인트 간의 거리 계산
  const getTouchDistance = (touches) => {
    try {
      if (!touches || touches.length < 2) return 0;
      if (!touches[0] || !touches[1]) return 0;
      
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    } catch (error) {
      console.error('Get touch distance error:', error);
      return 0;
    }
  };

  // 이미지 확대 상태 감지 (transform scale 기반)
  const checkImageZoomState = () => {
    try {
      if (modalImageRef.current && window.getComputedStyle) {
        const computedStyle = window.getComputedStyle(modalImageRef.current);
        if (computedStyle && computedStyle.transform) {
          const matrix = new DOMMatrix(computedStyle.transform);
          const scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
          setIsImageZoomed(scale > 1.1); // 10% 이상 확대되면 줌 상태로 간주
        }
      }
    } catch (error) {
      console.error('Check image zoom state error:', error);
    }
  };

  // 카운터 표시 및 타이머 관리
  const showCounterWithTimer = () => {
    try {
      setShowCounter(true);
      
      // 기존 타이머가 있으면 제거
      if (counterTimerRef.current) {
        clearTimeout(counterTimerRef.current);
        counterTimerRef.current = null;
      }
      
      // 새 타이머 설정
      counterTimerRef.current = setTimeout(() => {
        try {
          setShowCounter(false);
        } catch (error) {
          console.error('Counter timer error:', error);
        }
      }, COUNTER_HIDE_DELAY);
    } catch (error) {
      console.error('Show counter with timer error:', error);
    }
  };

  // 슬라이드 애니메이션을 포함한 이미지 변경 함수
  const slideToImage = (newIndex, direction) => {
    try {
      if (isSliding) return;
      
      setIsSliding(true);
      
      // 이미지 변경 시 카운터 표시
      showCounterWithTimer();
      
      // 애니메이션 실행
      if (modalImageRef.current && gsap) {
        // 웹뷰 환경에서는 부드러운 페이드 애니메이션 사용
        if (isWebView()) {
          // 애니메이션 시작 전 will-change 속성 설정
          modalImageRef.current.style.willChange = 'opacity, transform';
          
          // 페이드 아웃 + 살짝 축소
          gsap.to(modalImageRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
            ease: "power2.inOut",
            onComplete: () => {
              try {
                setCurrentImageIndex(newIndex);
                
                // 짧은 지연 후 페이드 인
                setTimeout(() => {
                  try {
                    if (modalImageRef.current && gsap) {
                      // 시작 상태 설정
                      gsap.set(modalImageRef.current, {
                        opacity: 0,
                        scale: 1.05
                      });
                      
                      // 페이드 인 + 살짝 확대에서 정상 크기로
                      gsap.to(modalImageRef.current, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.25,
                        ease: "power2.out",
                        onComplete: () => {
                          try {
                            setIsSliding(false);
                            if (modalImageRef.current) {
                              modalImageRef.current.style.willChange = 'auto';
                            }
                          } catch (error) {
                            console.error('Fade in complete error:', error);
                            setIsSliding(false);
                          }
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Fade in timeout error:', error);
                    setIsSliding(false);
                  }
                }, 30);
              } catch (error) {
                console.error('Fade out complete error:', error);
                setIsSliding(false);
              }
            }
          });
        } else {
          // 일반 브라우저에서는 기존 슬라이드 애니메이션 사용
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
            try {
              setCurrentImageIndex(newIndex);
              
              // 한 프레임 더 기다린 후 애니메이션 시작
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  try {
                    if (modalImageRef.current && gsap) {
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
                          try {
                            setIsSliding(false);
                            // 애니메이션 완료 후 will-change 속성 제거
                            if (modalImageRef.current) {
                              modalImageRef.current.style.willChange = 'auto';
                            }
                          } catch (error) {
                            console.error('Slide in complete error:', error);
                            setIsSliding(false);
                          }
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Slide animation frame error:', error);
                    setIsSliding(false);
                  }
                });
              });
            } catch (error) {
              console.error('Slide timeout error:', error);
              setIsSliding(false);
            }
          }, 50);
        }
      } else {
        // 모달이 열려있지 않은 경우 애니메이션 없이 바로 변경
        setCurrentImageIndex(newIndex);
        setIsSliding(false);
      }
    } catch (error) {
      console.error('Slide to image error:', error);
      setIsSliding(false);
    }
  };

  const handlePrevImage = () => {
    if (isSliding) return;
    
    // 이미지가 확대된 상태에서는 이미지 이동 방지
    if (isImageZoomed) {
      return;
    }
    
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    
    if (isModalOpen) {
      slideToImage(newIndex, 'right');
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  const handleNextImage = () => {
    if (isSliding) return;
    
    // 이미지가 확대된 상태에서는 이미지 이동 방지
    if (isImageZoomed) {
      return;
    }
    
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
    
    // 확대 상태 리셋
    setIsImageZoomed(false);
    setInitialPinchDistance(null);
    
    // 타이머 정리
    if (counterTimerRef.current) {
      clearTimeout(counterTimerRef.current);
      counterTimerRef.current = null;
    }
  };

  // 모달 배경 클릭 핸들러 (모달 닫기 기능 비활성화)
  const handleModalBackgroundClick = (e) => {
    try {
      if (!e) return;
      
      // 모달 배경 클릭으로 모달 닫기 기능 제거
      // 터치 상태만 리셋
      if (isTouchMove || isPinchZoom) {
        setIsTouchMove(false);
        setIsPinchZoom(false);
      }
      
      // 모든 이벤트 전파 차단으로 바깥 영역 터치 방지
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    } catch (error) {
      console.error('Modal background click error:', error);
    }
  };

  // 터치 시작 핸들러
  const onTouchStart = (e) => {
    try {
      // 이벤트 객체 검증
      if (!e || !e.touches) return;
      
      // 이미지 영역에서의 터치는 핀치 줌을 위해 브라우저에 맡김
      if (e.target && e.target.closest && e.target.closest('.modal-image-zoom-allowed')) {
        // 멀티터치만 감지하고 나머지는 브라우저가 처리
        if (e.touches && e.touches.length > 1) {
          setIsMultiTouch(true);
          setIsPinchZoom(true);
          
          const distance = getTouchDistance(e.touches);
          setInitialPinchDistance(distance);
        } else {
          setIsMultiTouch(false);
        }
        return;
      }
      
      // 모달이 열린 상태에서는 바깥 영역 터치 차단
      if (isModalOpen && e.stopPropagation) {
        e.stopPropagation();
      }
      
      // 먼저 확대 상태를 체크
      checkImageZoomState();
      
      setIsTouchMove(false);
      
      // 멀티터치 감지 (핀치 줌)
      if (e.touches && e.touches.length > 1) {
        setIsMultiTouch(true);
        setIsPinchZoom(true);
        
        // 핀치 시작 거리 저장
        const distance = getTouchDistance(e.touches);
        setInitialPinchDistance(distance);
        
        return;
      }
      
      setIsMultiTouch(false);
      
      // 이미지가 확대된 상태에서는 모든 단일 터치 무시
      if (isImageZoomed) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
        return;
      }
      
      if (!isModalOpen || !isMobileDevice() || isSliding || isPinchZoom) return;
      setTouchEnd(null); // 이전 터치 이벤트 리셋
      
      if (e.targetTouches && e.targetTouches[0]) {
        setTouchStart(e.targetTouches[0].clientX);
      }
      
      // 웹뷰에서는 추가 안전장치
      if (isWebView() && e.preventDefault) {
        e.preventDefault();
      }
    } catch (error) {
      console.error('Touch start error:', error);
    }
  };

  // 터치 이동 핸들러
  const onTouchMove = (e) => {
    try {
      // 이벤트 객체 검증
      if (!e || !e.touches) return;
      
      // 이미지 영역에서의 터치는 핀치 줌을 위해 브라우저에 맡김
      if (e.target && e.target.closest && e.target.closest('.modal-image-zoom-allowed')) {
        // 멀티터치 거리만 업데이트하고 나머지는 브라우저가 처리
        if (e.touches && e.touches.length > 1) {
          setIsMultiTouch(true);
          setIsPinchZoom(true);
          
          const currentDistance = getTouchDistance(e.touches);
          
          if (initialPinchDistance && currentDistance > initialPinchDistance * 1.2) {
            setIsImageZoomed(true);
          }
        }
        return;
      }
      
      // 모달이 열린 상태에서는 바깥 영역 터치 차단
      if (isModalOpen && e.stopPropagation) {
        e.stopPropagation();
      }
      
      setIsTouchMove(true);
      
      // 멀티터치 중이면 스와이프 처리하지 않음
      if (e.touches && e.touches.length > 1) {
        setIsMultiTouch(true);
        setIsPinchZoom(true);
        
        // 핀치 거리 업데이트 및 확대 상태 감지
        const currentDistance = getTouchDistance(e.touches);
        
        // 핀치 줌이 일정 비율 이상이면 확대 상태로 설정
        if (initialPinchDistance && currentDistance > initialPinchDistance * 1.2) {
          setIsImageZoomed(true);
        }
        
        return;
      }
      
      // 이미지가 확대된 상태에서는 모든 단일 터치 무시
      if (isImageZoomed) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
        return;
      }
      
      // 핀치 줌 상태에서는 스와이프 처리하지 않음
      if (!isModalOpen || !isMobileDevice() || isSliding || isPinchZoom || isMultiTouch) return;
      
      if (e.targetTouches && e.targetTouches[0]) {
        setTouchEnd(e.targetTouches[0].clientX);
      }
    } catch (error) {
      console.error('Touch move error:', error);
    }
  };

  // 터치 종료 핸들러
  const onTouchEnd = (e) => {
    try {
      // 이벤트 객체 검증
      if (!e) return;
      
      // 이미지 영역에서의 터치는 핀치 줌을 위해 브라우저에 맡김
      if (e.target && e.target.closest && e.target.closest('.modal-image-zoom-allowed')) {
        // 터치가 완전히 끝났는지 확인
        if (e.touches && e.touches.length === 0) {
          // 멀티터치였다면 핀치 줌 상태 해제
          if (isMultiTouch || isPinchZoom) {
            setIsMultiTouch(false);
            
            setTimeout(() => {
              checkImageZoomState();
              setIsPinchZoom(false);
              setInitialPinchDistance(null);
            }, 100);
          }
        }
        return;
      }
      
      // 모달이 열린 상태에서는 바깥 영역 터치 차단
      if (isModalOpen && e.stopPropagation) {
        e.stopPropagation();
      }
      
      // 터치가 완전히 끝났는지 확인 (모든 손가락이 떨어졌는지)
      if (e.touches && e.touches.length > 0) {
        return; // 아직 터치가 남아있음
      }
      
      // 멀티터치였다면 핀치 줌 상태 해제
      if (isMultiTouch || isPinchZoom) {
        setIsMultiTouch(false);
        
        // 확대 상태를 다시 체크
        setTimeout(() => {
          checkImageZoomState();
          setIsPinchZoom(false);
          
          // 핀치 거리 리셋
          setInitialPinchDistance(null);
        }, 100);
        return;
      }
      
      // 이미지가 확대된 상태에서는 모든 스와이프 무시
      if (isImageZoomed) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
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
    } catch (error) {
      console.error('Touch end error:', error);
    }
  };

  const handleKeyDown = (e) => {
    try {
      if (!e || isSliding) return;
      
      // 이미지가 확대된 상태에서는 화살표 키 무시
      if (isImageZoomed && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        if (e.preventDefault) e.preventDefault();
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        if (e.preventDefault) e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        if (e.preventDefault) e.preventDefault();
        handleNextImage();
      } else if (e.key === 'Escape' && isModalOpen) {
        // ESC 키로 모달 닫기 기능 제거
        if (e.preventDefault) e.preventDefault();
        return;
      }
      
      // 개발 환경에서는 개발자 도구 단축키 차단 비활성화
      if (process.env.NODE_ENV === 'development') {
        return;
      }
      
      // 개발자 도구 단축키 방지
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.key === 'S')) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
    } catch (error) {
      console.error('Key down error:', error);
    }
  };

  // 우클릭 방지
  const handleContextMenu = (e) => {
    try {
      if (e && e.preventDefault) {
        e.preventDefault();
        return false;
      }
    } catch (error) {
      console.error('Context menu error:', error);
    }
  };

  // 드래그 방지
  const handleDragStart = (e) => {
    try {
      if (e && e.preventDefault) {
        e.preventDefault();
        return false;
      }
    } catch (error) {
      console.error('Drag start error:', error);
    }
  };

  // 이미지 로드 후 보호 속성 추가
  const handleImageLoad = (e) => {
    try {
      if (e && e.target) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Image loaded successfully:', e.target.src);
        }
        e.target.setAttribute('draggable', 'false');
        e.target.style.userSelect = 'none';
        e.target.style.WebkitUserSelect = 'none';
        e.target.style.MozUserSelect = 'none';
        e.target.style.msUserSelect = 'none';
        e.target.style.pointerEvents = 'none';
      }
    } catch (error) {
      console.error('Image load error:', error);
    }
  };

  // 이미지 로드 실패 핸들러
  const handleImageError = (e) => {
    try {
      if (e && e.target) {
        console.error('Failed to load image:', e.target.src);
        if (process.env.NODE_ENV === 'development') {
          console.log('Image error details:', {
            src: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight,
            complete: e.target.complete
          });
        }
      }
    } catch (error) {
      console.error('Image error handler error:', error);
    }
  };

  // 개발자 도구 감지 (Safari 호환성 개선)
  useEffect(() => {
    // 개발 환경에서는 개발자 도구 감지 비활성화
    if (process.env.NODE_ENV === 'development') {
      return;
    }

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
      try {
        // 개발 환경에서는 개발자 도구 단축키 차단 비활성화
        if (process.env.NODE_ENV === 'development') {
          return;
        }
        
        if (!e || !e.key) return;
        
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U') ||
            (e.ctrlKey && e.key === 'S')) {
          if (e.preventDefault) e.preventDefault();
          return false;
        }
      } catch (error) {
        console.error('Global key down error:', error);
      }
    };

    const handleGlobalContextMenu = (e) => {
      try {
        // 개발 환경에서는 우클릭 차단 비활성화 (이미지는 여전히 보호)
        if (process.env.NODE_ENV === 'development') {
          // 이미지에 대해서만 우클릭 방지
          if (e && e.target && e.target.tagName === 'IMG') {
            if (e.preventDefault) e.preventDefault();
            return false;
          }
          return;
        }
        
        if (e && e.preventDefault) {
          e.preventDefault();
          return false;
        }
      } catch (error) {
        console.error('Global context menu error:', error);
      }
    };

    const handleGlobalSelectStart = (e) => {
      try {
        // 이미지나 갤러리 컨테이너 내부에서만 선택 방지
        if (e && e.target && (e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('.container')))) {
          if (e.preventDefault) e.preventDefault();
          return false;
        }
      } catch (error) {
        console.error('Global select start error:', error);
      }
    };

    const handleGlobalDragStart = (e) => {
      try {
        if (e && e.target && e.target.tagName === 'IMG') {
          if (e.preventDefault) e.preventDefault();
          return false;
        }
      } catch (error) {
        console.error('Global drag start error:', error);
      }
    };

    if (document && document.addEventListener) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.addEventListener('contextmenu', handleGlobalContextMenu);
      document.addEventListener('selectstart', handleGlobalSelectStart);
      document.addEventListener('dragstart', handleGlobalDragStart);
    }

    return () => {
      if (document && document.removeEventListener) {
        document.removeEventListener('keydown', handleGlobalKeyDown);
        document.removeEventListener('contextmenu', handleGlobalContextMenu);
        document.removeEventListener('selectstart', handleGlobalSelectStart);
        document.removeEventListener('dragstart', handleGlobalDragStart);
      }
    };
  }, []);

  // GSAP 스크롤 애니메이션
  useEffect(() => {
    let tl;
    
    try {
      if (!gsap || !ScrollTrigger) return;
      
      gsap.registerPlugin(ScrollTrigger);

      // ScrollTrigger 설정 (모바일 최적화)
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      });

      // refs 존재 여부 확인
      if (!titleRef.current || !carouselRef.current) return;

      // 초기 상태: 보이지 않게 설정
      gsap.set([titleRef.current, carouselRef.current], {
        opacity: 0,
        y: 10,
      });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 100%",
          end: "center center",
          toggleActions: "play none none none",
          invalidateOnRefresh: false,
        },
      });

      // 순차적 애니메이션
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      }).to(carouselRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
      });
    } catch (error) {
      console.error('GSAP animation error:', error);
    }

    return () => {
      try {
        if (tl) {
          tl.kill();
        }
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
      } catch (error) {
        console.error('GSAP cleanup error:', error);
      }
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
    const preventBodyScroll = (e) => {
      // 모달 이미지에서는 터치 허용 (핀치 줌을 위해)
      if (e.target.closest('.modal-image-zoom-allowed')) {
        return;
      }
      // 모달 내부 요소가 아닌 경우에만 터치 차단
      if (!e.target.closest('.gallery-modal')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isModalOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      
      // body 스크롤 완전 차단하면서 위치 유지
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';
      
      // 터치 이벤트 차단 (passive: false로 preventDefault 허용)
      document.addEventListener('touchmove', preventBodyScroll, { passive: false });
      document.addEventListener('touchstart', preventBodyScroll, { passive: false });
      
    } else {
      // 저장된 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      
      // 스크롤 위치 복원
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // 이벤트 리스너 제거
      document.removeEventListener('touchmove', preventBodyScroll);
      document.removeEventListener('touchstart', preventBodyScroll);
    }

    return () => {
      // 정리 시에도 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      document.removeEventListener('touchmove', preventBodyScroll);
      document.removeEventListener('touchstart', preventBodyScroll);
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

  // 모달이 열려있을 때 정기적으로 확대 상태 체크
  useEffect(() => {
    if (!isModalOpen) return;

    const checkZoomInterval = setInterval(() => {
      try {
        checkImageZoomState();
      } catch (error) {
        console.error('Check zoom interval error:', error);
      }
    }, 500); // 0.5초마다 체크

    return () => {
      clearInterval(checkZoomInterval);
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
                onError={handleImageError}
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
          className={`${styles.modal} gallery-modal`}
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
              disabled={isSliding || isImageZoomed}
            >
              <IoIosArrowBack />
            </button>
            
            <img
              ref={modalImageRef}
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={`${styles.modalImage} ${isSliding ? styles.sliding : ''} modal-image-zoom-allowed`}
              draggable="false"
              onLoad={handleImageLoad}
              onError={handleImageError}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
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
              disabled={isSliding || isImageZoomed}
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
