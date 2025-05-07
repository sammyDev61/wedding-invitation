import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MainSection from "../components/MainSection";
import InfoSection from "../components/InfoSection";
import CoupleSection from "../components/CoupleSection";
import GallerySection from "../components/GallerySection";
import TimelineSection from "../components/TimelineSection";
import GuestbookSection from "../components/GuestbookSection";
import styles from "./styles/Home.module.css";

function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      // 각 섹션의 모든 내부 요소 선택
      const title = section.querySelector("h2");
      const content = section.querySelectorAll(
        'div[class*="info"], div[class*="gallery"], div[class*="timeline"], div[class*="messages"], div[class*="form"]'
      );
      const items = section.querySelectorAll(
        'div[class*="Item"], div[class*="Card"], div[class*="imageWrapper"]'
      );

      // 초기 상태 설정
      gsap.set([title, ...content, ...items], {
        opacity: 0,
        y: 30,
      });

      // 애니메이션 타임라인 생성
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      // 순차적 애니메이션 적용
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      if (content.length) {
        tl.to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      if (items.length) {
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    });

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.container}>
      <MainSection />
      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <InfoSection />
      </div>
      <div ref={(el) => (sectionsRef.current[1] = el)}>
        <CoupleSection />
      </div>
      <div ref={(el) => (sectionsRef.current[2] = el)}>
        <GallerySection />
      </div>
      <div ref={(el) => (sectionsRef.current[3] = el)}>
        <TimelineSection />
      </div>
      <div ref={(el) => (sectionsRef.current[4] = el)}>
        <GuestbookSection />
      </div>
    </div>
  );
}

export default Home;
