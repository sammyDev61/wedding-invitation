import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./styles/MainSection.module.css";

function MainSection() {
  const contentRef = useRef(null);

  useEffect(() => {
    const elements = contentRef.current.children;

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
    <section className={styles.container}>
      <div className={styles.background}></div>
      <div ref={contentRef} className={styles.content}>
        <h1 className={styles.date}>2025.07.05</h1>
        <div className={styles.subImage}></div>
        <h2 className={styles.title}>Our Wedding Day</h2>
        <div className={styles.names}>
          <h3>Jaewon</h3>
          <h3>Saemi</h3>
        </div>
      </div>
    </section>
  );
}

export default MainSection;
