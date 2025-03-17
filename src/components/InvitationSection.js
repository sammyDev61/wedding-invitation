import styles from "./InvitationSection.module.css";

function InvitationSection() {
  return (
    <div className={styles.content}>
      <p className={styles.message}>
        서로 마주보며 다져온 사랑을
        <br />
        이제 한 곳을 바라보며
        <br />
        함께 걸어가고자 합니다.
        <br />
        저희 두 사람이 사랑의 이름으로
        <br />
        지켜나갈 수 있도록
        <br />
        앞날을 축복해 주시면 감사하겠습니다.
      </p>
    </div>
  );
}

export default InvitationSection;
