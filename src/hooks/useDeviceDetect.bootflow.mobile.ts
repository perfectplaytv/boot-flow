import { useState, useEffect } from 'react';
import { isMobile as checkMobile, isTablet, isDesktop } from 'react-device-detect';

export const useDeviceDetect = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
  });

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidDevice = /Android/.test(navigator.userAgent);
    const isStandaloneMode = 
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    setDeviceInfo({
      isMobile: checkMobile || window.innerWidth < 768,
      isTablet: isTablet || (window.innerWidth >= 768 && window.innerWidth < 1024),
      isDesktop: isDesktop || window.innerWidth >= 1024,
      isIOS: isIOSDevice,
      isAndroid: isAndroidDevice,
      isStandalone: isStandaloneMode,
    });

    const handleResize = () => {
      setDeviceInfo((prev) => ({
        ...prev,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

