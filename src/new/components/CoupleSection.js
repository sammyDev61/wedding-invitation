import styles from "./styles/CoupleSection.module.css";

function CoupleSection() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>신랑 & 신부</h2>
        <div className={styles.coupleInfo}>
          <div className={styles.person}>
            <div className={styles.imageWrapper}>
              <img src="/images/groom.jpg" alt="신랑" />
            </div>
            <div className={styles.personInfo}>
              <h3>김재원</h3>
              <p>1993.08.03</p>
              <p>서울 강동구</p>
              <p>IT 개발자 💻</p>
            </div>
          </div>
          <div className={styles.heart}>❤️</div>
          <div className={styles.person}>
            <div className={styles.imageWrapper}>
              <img src="/images/bride.jpg" alt="신부" />
            </div>
            <div className={styles.personInfo}>
              <h3>이새미</h3>
              <p>1995.08.03</p>
              <p>경기도 용인</p>
              <p>디자이너 🎨</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoupleSection;
