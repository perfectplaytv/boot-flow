import { Phone } from 'lucide-react';
import { useEffect } from 'react';

export function WhatsAppButton() {
  useEffect(() => {
    // Script da API Brasil
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@apibrasil/chat-widget/dist/chat-widget.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      window.APIBrasilChatWidget.init({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dhdGV3YXkuYXBpYnJhc2lsLmlvL2FwaS92Mi9hdXRoL3JlZ2lzdGVyIiwiaWF0IjoxNzQ5MDg2MTQzLCJleHAiOjE3ODA2MjIxNDMsIm5iZiI6MTc0OTA4NjE0MywianRpIjoiclVXZjdDNkxKUmZPV25ldCIsInN1YiI6IjE1NTU2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.0Uj5y56Yr2Cnauz4QDnXoGACZx13aON6pEDIjGV1Jp4',
        profileId: '270c2c74-2324-4668-b217-843ee6b100da',
        autoOpen: false,
        buttonPosition: 'right',
        buttonText: 'Precisa de ajuda?',
        welcomeMessage: 'Olá! Como posso te ajudar?',
        theme: {
          primaryColor: '#25D366',
          secondaryColor: '#128C7E',
          buttonTextColor: '#FFFFFF'
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
