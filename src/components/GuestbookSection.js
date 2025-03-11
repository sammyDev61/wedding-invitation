import { useState } from 'react';
import SectionTitle from './SectionTitle';

function GuestbookSection() {
  const [guestbook, setGuestbook] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    const newEntry = {
      id: Date.now(),
      title,
      message
    };

    setGuestbook([newEntry, ...guestbook]);
    
    // 초기화
    setTitle('');
    setMessage('');
  };

  return (
    <section>
      <SectionTitle text="Guestbook" />
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', width: '100%' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', height: '80px', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          등록
        </button>
      </form>

      <div style={{ width: '100%' }}>
        {guestbook.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px'
            }}
          >
            <h4 style={{ margin: 0 }}>{entry.title}</h4>
            <p style={{ margin: '4px 0 0 0' }}>{entry.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GuestbookSection;
