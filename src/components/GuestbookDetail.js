function GuestbookDetail({ entry, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="prose mb-6">
            <p className="text-gray-700 whitespace-pre-wrap text-lg">
              {entry.message}
            </p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-500">{entry.date}</span>
            <h3 className="text-xl font-medium">{entry.name}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestbookDetail;
