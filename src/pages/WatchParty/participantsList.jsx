const ParticipantList = ({ participants }) => {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg w-60">
      <h2 className="text-lg font-semibold mb-2">👥 Participants</h2>
      <ul className="text-sm space-y-1">
        {participants.map((p, i) => (
          <li key={p.id}>{p.name || `Guest ${i + 1}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantList;
