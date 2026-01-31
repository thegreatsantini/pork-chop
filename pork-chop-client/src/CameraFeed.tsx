import  { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    const streamUrl = 'http://localhost:3001/stream/stream.m3u8';

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, []);

  return (
    <div>
      <h2>Printer Cam</h2>
      <video 
        ref={videoRef} 
        controls 
        style={{ width: '100%', maxWidth: '800px' }}
      />
    </div>
  );
}

export default CameraFeed;