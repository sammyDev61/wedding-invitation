import styles from "./styles/InfoSection.module.css";

function InfoSection() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>We are getting married!</h2>
        <div className={styles.infoMessage}>
          여름빛이 가득한 7월,<br/>
          작고 소박한 예식으로 함께 걸어갈 첫걸음을 시작하려 합니다.<br/>
          따뜻한 축복으로 소중한 순간을 함께해 주시면 감사하겠습니다.
        </div>
        <div className={styles.infoText}>
          <b>김창섭 · 윤은자</b> 의 아들 <b>김재원</b>
          <br/>
          <b>故신휘철 · 박선화</b> 의 딸 <b>신새미</b>
        </div>
        <div className={styles.infoText}>
          <b>2025년 7월 5일 토요일 오전 10시 30분</b>
          <div>종로 까델루뽀</div>
          {(() => {
            const weddingDate = new Date('2025-07-05');
            const today = new Date();
            const diffTime = weddingDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let dDayText;
            if (diffDays > 0) {
              dDayText = `D-${diffDays}`;
            } else if (diffDays === 0) {
              dDayText = 'D-Day';
            } else {
              dDayText = `D+${Math.abs(diffDays)}`;
            }
            
            return <div>{dDayText}</div>;
          })()}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
