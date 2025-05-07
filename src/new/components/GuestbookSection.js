import { useState, useEffect } from "react";
import styles from "./styles/GuestbookSection.module.css";

function GuestbookSection() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("guestbookMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            name: "김지원",
            message: "축하드립니다! 행복한 결혼생활 되세요 💕",
            date: "2024.03.15",
          },
          {
            id: 2,
            name: "이수진",
            message: "두 분의 앞날에 행복이 가득하길 바랍니다.",
            date: "2024.03.14",
          },
        ];
  });
  const [newMessage, setNewMessage] = useState({
    name: "",
    message: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("guestbookMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!newMessage.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!newMessage.message.trim()) {
      setError("메시지를 입력해주세요.");
      return;
    }

    if (newMessage.name.length > 20) {
      setError("이름은 20자 이내로 입력해주세요.");
      return;
    }

    if (newMessage.message.length > 200) {
      setError("메시지는 200자 이내로 입력해주세요.");
      return;
    }

    const message = {
      id: Date.now(),
      ...newMessage,
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(".", ""),
    };

    setMessages([message, ...messages]);
    setNewMessage({ name: "", message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>방명록</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={newMessage.name}
            onChange={handleChange}
            placeholder="이름을 입력해주세요"
            maxLength={20}
          />
          <textarea
            name="message"
            value={newMessage.message}
            onChange={handleChange}
            placeholder="축하 메시지를 남겨주세요"
            maxLength={200}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">메시지 남기기</button>
        </form>
        <div className={styles.messages}>
          {messages.map((message) => (
            <div key={message.id} className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <span className={styles.name}>{message.name}</span>
                <span className={styles.date}>{message.date}</span>
              </div>
              <p className={styles.message}>{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuestbookSection;
