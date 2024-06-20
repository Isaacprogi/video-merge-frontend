import axios from 'axios';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import TopImage from '../../assets/top.jpg';



const VideoMerge: React.FC = () => {
  const [videoA, setVideoA] = useState<File | null>(null);
  const [videoB, setVideoB] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedResolution, setSelectedResolution] = useState<string>('640x480');
  const [error, setError] = useState('');

  const resolutions = [
    { id: 1, name: 'Standard', resolution: '640x480' },
    { id: 2, name: 'SD', resolution: '720x480' },
    { id: 3, name: 'Full HD', resolution: '1920x1080' },
    { id: 4, name: 'HD', resolution: '1280x720' },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setVideo: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files) {
      setError('');
      setVideo(event.target.files[0]);
    }
  };

  const handleResolutionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResolution(event.target.value);
  };

  const handleSubmit = async () => {
    if (!videoA || !videoB) {
      setError('Please select both videos');
      return;
    }

    if (!selectedResolution) {
      setError('Please select a resolution');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('videoA', videoA);
    formData.append('videoB', videoB);
    formData.append('resolution', selectedResolution);

    try {
      const response = await axios.post('http://localhost:4000/api/videos/merge', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged-video.mp4');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Video merging failed', error);
      setError('Video merging failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100 relative">
      <img className="fixed w-full top-0 object-cover object-top h-full" src={TopImage} alt="" />

      <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-md border z-40 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">Video Merge</h1>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Video A</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, setVideoA)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg overflow-hidden cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Video B</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, setVideoB)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg overflow-hidden cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Resolution</label>
          <select
            value={selectedResolution}
            onChange={handleResolutionChange}
            className="block w-full h-10 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {resolutions.map((resolution) => (
              <option key={resolution.id} value={resolution.resolution}>
                {resolution.name} ({resolution.resolution})
              </option>
            ))}
          </select>
        </div>
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Processing...' : 'Merge Videos'}
          {loading && <ClipLoader className="text-white" loading={loading} size={15} />}
        </button>

        <div className="w-full text-center mt-4">{loading && 'Please wait while we process your video'}</div>
      </div>
    </div>
  );
};

export default VideoMerge;
