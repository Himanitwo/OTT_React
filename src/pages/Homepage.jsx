import React from "react";

const MarathiPlayHome = () => {
  return (
    <div className="bg-gray-900 text-white font-sans">

      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('https://via.placeholder.com/1200x500?text=Premachi+Sutra')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">प्रेमाची सूत्र</h1>
          <p className="max-w-xl text-gray-300 mb-6">
            A mystical love story that spans lifetimes, traditions, and unbreakable vows.
          </p>
          <button className="bg-lime-400 text-black font-bold px-6 py-2 rounded-full hover:bg-lime-300 transition">
            ▶️ Play Now
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <div className="flex justify-center -mt-8 px-4">
        <input
          type="text"
          placeholder="Search shows, movies..."
          className="w-full max-w-xl px-4 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
      </div>

      {/* New Releases */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {[
            { title: "रानबाजार", img: "Raanbazaar", duration: "2h 21m", rating: "★★★★☆" },
            { title: "कावळ्याचं चांद", img: "Kavlya+Chand", duration: "1h 59m", rating: "★★★☆☆" },
            { title: "धर्म योद्धा", img: "Dharm+Yodha", duration: "2h 45m", rating: "★★★★★" }
          ].map((movie, i) => (
            <div key={i} className="min-w-[200px] bg-gray-800 p-3 rounded-lg flex-shrink-0">
              <img
                src={`https://via.placeholder.com/200x280?text=${movie.img}`}
                alt={movie.title}
                className="rounded-lg mb-3 h-[280px] object-cover w-full"
              />
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.duration} | {movie.rating}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section className="px-6 py-10 bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6">Top Artists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Vaidehi Ranade", role: "Actress", initials: "VR" },
            { name: "Ajinkya Shinde", role: "Actor", initials: "AS" },
            { name: "Kavita Deshpande", role: "Director", initials: "KD" },
            { name: "Raghav Gole", role: "Writer", initials: "RG" }
          ].map((artist, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded-lg text-center">
              <img
                src={`https://via.placeholder.com/100x100?text=${artist.initials}`}
                alt={artist.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="text-lg font-semibold">{artist.name}</h3>
              <p className="text-sm text-gray-400">{artist.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News Feed */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
        <div className="space-y-4">
          {[
            {
              title: "“Dharm Yodha” creates historic opening!",
              body: "The epic mythological drama sees packed theaters and standing ovations across Maharashtra."
            },
            {
              title: "Vaidehi Ranade to star in a biopic on Lata Mangeshkar",
              body: "The actress says it’s the “most emotional and inspiring role” of her career."
            },
            {
              title: "Marathi Play app crosses 5M downloads",
              body: "With hit shows and exclusive premieres, the app is now leading regional OTT rankings."
            }
          ].map((news, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{news.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{news.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MarathiPlayHome;
