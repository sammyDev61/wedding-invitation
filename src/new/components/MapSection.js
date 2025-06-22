import { Map, MapMarker } from "react-kakao-maps-sdk";
import { MdContentCopy } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./styles/MapSection.module.css";

function MapSection() {
  const position = { lat: 37.58183549788911, lng: 126.97141930480986 };
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const mapRef = useRef(null);
  const contentRef = useRef(null);

  const copyToClipboard = async (text) => {
    try {
      // 최신 브라우저용 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToastMessage('복사되었습니다!');
        return;
      }
      
      // 대체 방법: 임시 텍스트 영역 생성
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      return new Promise((resolve, reject) => {
        // execCommand 사용 (구형 브라우저 지원)
        document.execCommand('copy') ? resolve() : reject();
        textArea.remove();
      }).then(() => {
        showToastMessage('복사되었습니다!');
      }).catch(() => {
        // 모든 방법이 실패한 경우 사용자에게 수동 복사 안내
        prompt('아래 텍스트를 복사해주세요:', text);
      });
      
    } catch (error) {
      console.error('복사 실패:', error);
      // 최후의 수단: prompt로 텍스트 표시
      prompt('아래 텍스트를 복사해주세요:', text);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    // 2초 후 자동으로 숨김
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // GSAP 스크롤 애니메이션
  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // 초기 상태 설정
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50,
    });

    gsap.set(contentRef.current.children, {
      opacity: 0,
      y: 30,
    });

    // 애니메이션 타임라인
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(contentRef.current.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    }, "-=0.4");

    // 지도 CSS 클래스 애니메이션
    if (mapRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          if (mapRef.current) {
            mapRef.current.classList.add(styles.mapVisible);
          }
        },
        onLeave: () => {
          if (mapRef.current) {
            mapRef.current.classList.remove(styles.mapVisible);
          }
        },
        onEnterBack: () => {
          if (mapRef.current) {
            mapRef.current.classList.add(styles.mapVisible);
          }
        },
        onLeaveBack: () => {
          if (mapRef.current) {
            mapRef.current.classList.remove(styles.mapVisible);
          }
        },
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <h2 ref={titleRef} className={styles.title}>Map</h2>
      <div ref={mapRef} className={styles.mapWrapper}>
        <Map
          center={position}
          level={1}
          className={styles.map}
        >
          <MapMarker position={position} />
        </Map>
      </div>
      <div ref={contentRef}>
        <div className={styles.mapText}>
          <b>까델루뽀</b><br/>
          서울 종로구 자하문로16길 5-5
        </div>
        <div className={styles.mapButton}>
          <button onClick={() => window.open('https://map.naver.com/p/directions/-/14134394.4764838,4520517.7853017,%EA%B9%8C%EB%8D%B8%EB%A3%A8%EB%BD%80,13517637,PLACE_POI/-/transit?c=15.00,0,0,0,dh', '_blank')}>네이버 지도</button>
          <button onClick={() => window.open('https://map.kakao.com/?target=car&eX=493689&eY=1133965&eName=%EA%B9%8C%EB%8D%B8%EB%A3%A8%EB%BD%80&from=total&ids=%2CP8578395&rtIds=%2CP8578395', '_blank')}>카카오맵</button>
        </div>
        <div className={styles.mapText}>
          <b>주차 안내</b><br/>
          <div className={styles.parkingItem}>
            <span className={styles.parkingText}>
              신교공영주차장
              <button 
                className={styles.copyButton} 
                onClick={() => copyToClipboard('신교공영주차장')}
                title="주차장 복사"
              >
                <MdContentCopy />
              </button>
              <br/><span className={styles.subText}>서울 종로구 자하문로 89</span>
              <button 
                className={styles.copyButton} 
                onClick={() => copyToClipboard('서울 종로구 자하문로 89')}
                title="주소 복사"
              >
                <MdContentCopy />
              </button>
            </span>
          </div>
          <div className={styles.parkingItem}>
            <span className={styles.parkingText}>
              청와대사랑채주차장
              <button 
                className={styles.copyButton} 
                onClick={() => copyToClipboard('청와대사랑채주차장')}
                title="주차장 복사"
              >
                <MdContentCopy />
              </button>
              <br/><span className={styles.subText}>서울 종로구 효자동 196</span>
              <button 
                className={styles.copyButton} 
                onClick={() => copyToClipboard('서울 종로구 효자동 196')}
                title="주소 복사"
              >
                <MdContentCopy />
              </button>
            </span>
          </div>
          <br/>
          <b>지하철</b><br/>
          경복궁역 3번 출구에서 도보 10분<br/>
          <br/>
          <b>버스</b><br/>
          통인시장종로구보건소에서 하차 후 도보 2분<br/>
          <span className={styles.subText}>지선버스: 1020, 1711, 7016, 7018, 7022, 7212, 8111</span>
        </div>
      </div>
      {showToast && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default MapSection;
