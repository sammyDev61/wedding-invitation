import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MainSection from "../components/MainSection";
import InfoSection from "../components/InfoSection";
import GallerySection from "../components/GallerySection";
import SectionDivider from "../components/SectionDivider";
import styles from "./styles/Home.module.css";

function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      const title = section.querySelector("h2");
      const content = section.querySelectorAll(
        'div[class*="info"], div[class*="timeline"], div[class*="messages"], div[class*="form"]'
      );
      const items = section.querySelectorAll(
        'div[class*="Item"], div[class*="Card"]'
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
          toggleActions: "play none none none",
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
      <SectionDivider />
      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <InfoSection />
      </div>
      <SectionDivider />
      <div ref={(el) => (sectionsRef.current[2] = el)}>
        <GallerySection />
      </div>
    </div>
  );
}

export default Home;
