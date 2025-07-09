
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const navigate = useNavigate();

  const rooms = [
    {
      id: 'marathi',
      title: 'Marathi',
      description: 'Join fans of Marathi movies and dramas',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Marathi_Cinema_logo.png/600px-Marathi_Cinema_logo.png'
    },
    {
      id: 'familytime',
      title: 'Family Time',
      description: 'Watch together, laugh together, family style',
      image: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'
    },
    {
      id: 'friends',
      title: 'Friends',
      description: 'Hangout virtually and stream with friends',
      image: 'https://cdn-icons-png.flaticon.com/512/747/747968.png'
    }
  ];

  const handleJoin = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-white">Choose a Room</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            onClick={() => handleJoin(room.id)}
            className="bg-[#2b2b2b] cursor-pointer rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={room.image}
              alt={room.title}
              className="w-20 h-20 object-contain mb-4 rounded-full"
            />
            <h3 className="text-xl font-semibold text-white mb-1">{room.title}</h3>
            <p className="text-sm text-gray-400 text-center">{room.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JoinRoom;
