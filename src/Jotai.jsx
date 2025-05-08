import { useEffect } from 'react';

const JotformAgent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    script.onload = () => {
        window.AgentInitializer.init({ agentRenderURL: "https://agent.jotform.com/0196aece758a749fa2738b2c064c255c9c2e", rootId: "JotformAgent-0196aece758a749fa2738b2c064c255c9c2e", formID: "0196aece758a749fa2738b2c064c255c9c2e", queryParams: ["skipWelcome=1","maximizable=1"], domain: "https://www.jotform.com", isDraggable: false, background: "linear-gradient(180deg, #D3CBF4 0%, #D3CBF4 100%)", buttonBackgroundColor: "#8797FF", buttonIconColor: "#01091B", variant: false, customizations: {"greeting":"Yes","greetingMessage":"Hi! How can I assist you?","openByDefault":"No","pulse":"Yes","position":"right","autoOpenChatIn":"0"}, isVoice: false, })
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // It's injected via script, no visible DOM needed
};

export default JotformAgent;
