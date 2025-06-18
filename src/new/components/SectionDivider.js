import styles from "./styles/SectionDivider.module.css";
import { GoDotFill } from "react-icons/go";

function SectionDivider() {
  return (
    <div className={styles.divider}>
      <GoDotFill className={styles.dot} />
    </div>
  );
}

export default SectionDivider; 