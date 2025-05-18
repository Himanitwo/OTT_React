export const createWebRTCPeer = async ({
  isCaller,
  localStream,
  onRemoteTrack,
  onIceCandidate, // function to send candidates to the other peer
  onReceiveOffer, // for callee: receive offer from signaling server
  onReceiveAnswer, // for caller: receive answer from signaling server
  onReceiveCandidate, // function to listen for ICE candidates from other peer
  onError = console.error,
}) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // Add local tracks
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // Remote stream handler
  pc.ontrack = (event) => {
    if (onRemoteTrack) onRemoteTrack(event.streams[0]);
  };

  // Send ICE candidates to signaling server
  pc.onicecandidate = (event) => {
    if (event.candidate && onIceCandidate) {
      onIceCandidate(event.candidate);
    }
  };

  try {
    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to remote peer via signaling server
      onReceiveAnswer(async (answer) => {
        if (answer && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      // Start listening for remote ICE candidates
      onReceiveCandidate((candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(onError);
      });

      return { pc, offer };
    } else {
      // Callee-side: wait for offer and return answer
      onReceiveOffer(async (offer) => {
        if (!offer) return;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Start listening for remote ICE candidates
        onReceiveCandidate((candidate) => {
          pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(onError);
        });

        return { answer };
      });

      return { pc };
    }
  } catch (err) {
    onError(err);
  }

  // Cleanup
  const cleanup = () => {
    localStream.getTracks().forEach((track) => track.stop());
    pc.close();
  };

  return { pc, cleanup };
};
