import { useParams } from 'react-router-dom';
import VideoCall from './VideoCall';

function VideoCallWrapper() {
  const { roomId } = useParams();
  return <VideoCall roomId={roomId} />;
}

export default VideoCallWrapper;
