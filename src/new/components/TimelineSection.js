import styles from "./styles/TimelineSection.module.css";

function TimelineSection() {
  const timeline = [
    {
      date: "2021.12.24",
      title: "첫 만남",
      description: "저희는 발리에서 처음 만났어요.",
    },
    {
      date: "2022.12.24",
      title: "1주년",
      description: "함께한 1년 서로를 알아가는 시간이었어요.",
    },
    {
      date: "2023.12.24",
      title: "2주년",
      description: "함께한 2년 우리는 결혼을 결심했어요.",
    },
    {
      date: "2025.05.18",
      title: "Wedding Day",
      description: "저희는 이날 결혼해요. 저희의 시작을 축하해주세요.",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>우리의 시간</h2>
        <div className={styles.timeline}>
          {timeline.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.date}>{item.date}</div>
              <div className={styles.dot}></div>
              <div className={styles.info}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineSection;
