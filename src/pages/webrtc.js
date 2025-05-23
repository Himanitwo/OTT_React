export const createPeerConnection = (socket, remoteSocketId) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        to: remoteSocketId,
        candidate: event.candidate,
      });
    }
  };

  return pc;
};
