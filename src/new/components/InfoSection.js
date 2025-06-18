import styles from "./styles/InfoSection.module.css";

function InfoSection() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>We are getting married!</h2>
        <div className={styles.infoMessage}>
          여름빛이 가득한 7월, 저희 결혼합니다.<br/>
          고마운 분들을 모시고 예를 갖추는 것이 도리이나<br/>
          두 사람의 뜻에 따라 소박한 결혼식을 올리게 되었습니다.<br/>
          너그러이 헤아려 주시고 마음으로 축하해 주신다면,<br/>
          행복하게 잘 살아가는 모습으로 보답하겠습니다.
        </div>
        <div className={styles.infoText}>
          <b>김창섭 · 윤은자</b> 의 아들 <b>김재원</b>
          <br/>
          <b>故신휘철 · 박선화</b> 의 딸 <b>신새미</b>
        </div>
        <div className={styles.infoText}>
          <b>2025년 7월 5일</b>
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
