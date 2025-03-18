function GuestbookDetail({ entry, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-gray-700 leading-none">
              {entry.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 h-[32px] flex items-center">
              ✕
            </button>
          </div>
          <div className="prose mb-6">
            <p className="text-gray-700 whitespace-pre-wrap text-lg">
              {entry.message}
            </p>
          </div>
          <div className="flex justify-end border-gray-200">
            <span className="text-gray-500">{entry.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestbookDetail;
