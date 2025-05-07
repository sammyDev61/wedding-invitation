import styles from "./styles/InfoSection.module.css";

function InfoSection() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Wedding Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h3>날짜</h3>
            <p>2025년 5월 18일</p>
            <p>일요일 오후 2시</p>
          </div>
          <div className={styles.infoItem}>
            <h3>장소</h3>
            <p>그랜드 웨딩홀</p>
            <p>서울시 강남구 테헤란로 123</p>
          </div>
          <div className={styles.infoItem}>
            <h3>연락처</h3>
            <p>신랑: 010-1234-5678</p>
            <p>신부: 010-8765-4321</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
