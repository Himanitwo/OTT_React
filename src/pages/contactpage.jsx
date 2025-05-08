import { motion } from 'framer-motion';
import { Upload, Film, Mail, User, Globe, Phone, Clock, Play } from 'lucide-react';
import { useState, useRef } from 'react';

function Contactpage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    movieTitle: '',
    genre: '',
    duration: '',
    synopsis: '',
    trailerLink: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission with video file
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    if (videoFile) {
      submissionData.append('video', videoFile);
    }
    
    console.log('Submission data:', Object.fromEntries(submissionData));
    alert('Thank you for your submission! Our team will review your content.');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Submit Your Content</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Want your movie or series featured on our platform? Fill out this form and our content team will review your submission.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Company Details */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User size={24} /> Company Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name*</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium mb-1">Contact Person*</label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Movie Details */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Film size={24} /> Content Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="movieTitle" className="block text-sm font-medium mb-1">Title*</label>
                    <input
                      type="text"
                      id="movieTitle"
                      name="movieTitle"
                      value={formData.movieTitle}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium mb-1">Genre*</label>
                      <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration*</label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="e.g. 120 min"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="synopsis" className="block text-sm font-medium mb-1">Synopsis*</label>
                    <textarea
                      id="synopsis"
                      name="synopsis"
                      value={formData.synopsis}
                      onChange={handleChange}
                      rows="4"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="trailerLink" className="block text-sm font-medium mb-1">Trailer Link (YouTube/Vimeo)</label>
                    <input
                      type="url"
                      id="trailerLink"
                      name="trailerLink"
                      value={formData.trailerLink}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="https://"
                    />
                  </div>

                  {/* Video Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Sample Video*</label>
                    <div 
                      className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                        required
                      />
                      <Upload size={40} className="mx-auto mb-3 text-green-500" />
                      <p className="font-medium">
                        {videoFile ? videoFile.name : 'Click to upload video file'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        MP4, MOV or AVI. Max 500MB.
                      </p>
                      
                      {uploadProgress > 0 && (
                        <div className="mt-3 w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-lg transition w-full text-lg"
              >
                Submit for Review
              </motion.button>

              <p className="text-gray-400 text-sm text-center">
                By submitting, you agree to our content submission guidelines. Our team will contact you within 7-10 business days.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Contactpage;