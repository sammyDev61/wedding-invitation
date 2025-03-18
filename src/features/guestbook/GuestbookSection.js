import { useState, useEffect } from "react";
import styles from "./styles/GuestbookSection.module.css";
import SectionTitle from "@components/common/SectionTitle";
import GuestbookForm from "./components/GuestbookForm";
import GuestbookDetail from "./components/GuestbookDetail";

function GuestbookSection() {
  const [guestbook, setGuestbook] = useState([
    {
      id: 1,
      name: "민지",
      message:
        "두 분의 앞날에 늘 행복과 사랑이 가득하시길 바랍니다. 결혼을 진심으로 축하드려요! 🎉",
      date: "2024.03.15",
    },
    {
      id: 2,
      name: "하니",
      message:
        "서로를 아끼고 사랑하며 평생 행복하게 사세요. 결혼 축하드립니다! ♥",
      date: "2024.03.14",
    },
    {
      id: 3,
      name: "다니엘",
      message:
        "새로운 시작을 축하드립니다. 앞으로도 지금처럼 서로 아끼고 사랑하며 살아가세요. 💝",
      date: "2024.03.14",
    },
    {
      id: 4,
      name: "혜인",
      message:
        "두 분의 결혼을 진심으로 축하드립니다. 앞으로도 지금처럼 서로 사랑하며 아름다운 가정 이루시길 바랍니다. 오늘처럼 환한 미소가 늘 함께하시길 바라며, 서로에 대한 사랑과 믿음으로 더욱 빛나는 앞날이 되시길 기원합니다. 💫",
      date: "2024.03.13",
    },
    {
      id: 5,
      name: "해린",
      message:
        "결혼 정말 축하드려요! 서로 배려하고 이해하며 행복한 가정 이루시길 바랍니다. 🌸",
      date: "2024.03.13",
    },
    {
      id: 6,
      name: "성민",
      message:
        "두 분의 결합을 진심으로 축하드립니다. 서로에 대한 사랑과 믿음으로 아름다운 가정 이루시길 바랍니다. 오늘의 이 설렘과 행복이 평생 지속되시길 바라며, 앞으로도 지금처럼 서로를 아끼고 존중하며 살아가시길 바랍니다. 늘 건강하시고 행복한 일만 가득하시길 기원합니다. ⭐️",
      date: "2024.03.12",
    },
    {
      id: 7,
      name: "지수",
      message:
        "소중한 결혼식에 초대해주셔서 감사합니다. 두 사람이 만나 하나가 되어가는 모습이 정말 아름답습니다. 서로에 대한 깊은 이해와 배려, 그리고 한없는 사랑으로 채워나가는 새로운 시작을 진심으로 축하드립니다. 앞으로도 지금처럼 서로를 향한 애정과 믿음으로 더욱 빛나는 가정을 이루시길 바랍니다. 늘 행복하세요! 💖",
      date: "2024.03.12",
    },
    {
      id: 8,
      name: "채원",
      message:
        "평생 함께하는 동안 서로에게 더 좋은 사람이 되어주시길 바랍니다. 힘들 때는 서로에게 기대어 위로가 되어주고, 기쁠 때는 함께 웃으며 행복을 나누는 그런 아름다운 부부가 되시길 진심으로 바랍니다. 오늘의 이 설렘과 감동이 평생 함께하시길 기원합니다. 결혼을 진심으로 축하드립니다! 🌟",
      date: "2024.03.11",
    },
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (isFormVisible || selectedEntry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFormVisible, selectedEntry]);

  const handleSubmit = ({ name, message }) => {
    const newEntry = {
      id: Date.now(),
      name,
      message,
      date: new Date().toLocaleDateString(),
    };

    setGuestbook([newEntry, ...guestbook]);
    setIsFormVisible(false);
  };

  return (
    <section className="w-full">
      <SectionTitle text="Guestbook" />

      {isFormVisible && (
        <GuestbookForm
          onSubmit={handleSubmit}
          onClose={() => setIsFormVisible(false)}
        />
      )}

      {selectedEntry && (
        <GuestbookDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {guestbook.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          첫 번째 방명록을 작성해주세요 💝
        </div>
      ) : (
        <div className={styles.guestbookContainer}>
          <div className={styles.guestbookGrid}>
            {guestbook.map((entry) => (
              <div
                key={entry.id}
                className={styles.guestbookEntry}
                onClick={() => setSelectedEntry(entry)}>
                <div className={styles.messageContent}>
                  <p className={styles.messageText}>{entry.message}</p>
                </div>
                <div className={styles.entryFooter}>
                  <span className={styles.date}>{entry.date}</span>
                  <span className={styles.authorName}>{entry.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setIsFormVisible(true)}
          className={styles.writeButton}>
          작성
        </button>
      </div>
    </section>
  );
}

export default GuestbookSection;
