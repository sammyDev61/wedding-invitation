import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./styles/MainSection.module.css";

function MainSection() {
  const contentRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // 높이 설정 useEffect (초기 한 번만)
  useEffect(() => {
    // 초기 로드 시에만 높이 설정하고 이후 변경하지 않음
    setContainerHeight(window.innerHeight);
  }, []);

  // GSAP 애니메이션 useEffect (한 번만 실행)
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger 설정 (모바일 최적화)
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const elements = contentRef.current.children;

    // 초기 상태: 보이지 않게 설정
    gsap.set(elements, {
      opacity: 0,
      y: 30,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: false,
      },
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      className={styles.container} 
      style={{ 
        height: containerHeight ? `${containerHeight}px` : '100vh',
        minHeight: containerHeight ? `${containerHeight}px` : '100vh'
      }}
    >
      <div className={styles.background}></div>
      <div ref={contentRef} className={styles.content}>
        <h1 className={styles.date}>2025.07.05</h1>
        <h2 className={styles.title}>Our Wedding Day</h2>
        <div className={styles.subImage}></div>
        <div className={styles.names}>
          <h3>Jaewon</h3>
          <h3>Saemi</h3>
        </div>
      </div>
    </section>
  );
}

export default MainSection;
