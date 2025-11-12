import { useState, useEffect } from 'react';
import { useDeviceDetect } from './useDeviceDetect.bootflow.mobile';

export type LayoutMode = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveLayoutConfig {
  mobile: {
    columns: number;
    gap: string;
    padding: string;
  };
  tablet: {
    columns: number;
    gap: string;
    padding: string;
  };
  desktop: {
    columns: number;
    gap: string;
    padding: string;
  };
}

const defaultConfig: ResponsiveLayoutConfig = {
  mobile: { columns: 1, gap: '1rem', padding: '1rem' },
  tablet: { columns: 2, gap: '1.5rem', padding: '1.5rem' },
  desktop: { columns: 3, gap: '2rem', padding: '2rem' },
};

export const useResponsiveLayout = (config: ResponsiveLayoutConfig = defaultConfig) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');
  const [currentConfig, setCurrentConfig] = useState(config.mobile);

  useEffect(() => {
    if (isMobile) {
      setLayoutMode('mobile');
      setCurrentConfig(config.mobile);
    } else if (isTablet) {
      setLayoutMode('tablet');
      setCurrentConfig(config.tablet);
    } else {
      setLayoutMode('desktop');
      setCurrentConfig(config.desktop);
    }
  }, [isMobile, isTablet, isDesktop, config]);

  return {
    layoutMode,
    config: currentConfig,
    isMobile,
    isTablet,
    isDesktop,
  };
};

