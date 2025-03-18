import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./styles/MainSection.module.css";

function MainSection() {
  const topContentRef = useRef(null);
  const bottomContentRef = useRef(null);

  useEffect(() => {
    gsap.set(
      [topContentRef.current.children, bottomContentRef.current.children],
      {
        opacity: 0,
        y: 50,
      }
    );

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(topContentRef.current.children, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.4,
    }).to(
      bottomContentRef.current.children,
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.4,
      },
      "-=1"
    );
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.background}></div>
      <div ref={topContentRef} className={styles.topContent}>
        <h1 className="text-2xl font-bold mb-4">2025.07.05</h1>
        <h1 className="font-title text-5xl">Our Wedding Day</h1>
      </div>

      <div ref={bottomContentRef} className={styles.bottomContent}>
        <h2>Jaewon</h2>
        <h2>Saemi</h2>
      </div>
    </section>
  );
}

export default MainSection;
