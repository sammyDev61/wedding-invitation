import { useState, useEffect, useRef } from "react";

function GuestbookForm({ onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) return;

    onSubmit({ name, message });
    setName("");
    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium leading-none">방명록</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 h-[32px] flex items-center">
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                ref={nameInputRef}
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 bg-white"
              />
            </div>
            <div className="mb-6">
              <textarea
                placeholder="메시지를 남겨주세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-300 bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-gray-700">
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GuestbookForm;
