const ParticipantList = ({ participants, currentUserId }) => {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg w-64">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">👥 Participants</h2>
        <span className="text-xs bg-neutral-700 px-2 py-1 rounded-full">
          {participants.length} online
        </span>
      </div>

      {participants.length > 0 ? (
        <ul className="space-y-2">
          {participants.map((p) => (
            <li 
              key={p.id} 
              className={`flex items-center gap-2 ${
                p.email === currentUserId ? "text-blue-400 font-medium" : ""
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                p.email === currentUserId ? "bg-blue-500" : "bg-green-500"
              }`}></div>
              <span className="truncate">{p.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-400">No participants yet</p>
      )}
    </div>
  );
};

export default ParticipantList;