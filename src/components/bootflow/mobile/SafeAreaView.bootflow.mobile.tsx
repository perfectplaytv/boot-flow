import { ReactNode } from 'react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect.bootflow.mobile';

export interface SafeAreaViewProps {
  children: ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export const SafeAreaView = ({
  children,
  className = '',
  top = true,
  bottom = true,
  left = true,
  right = true,
}: SafeAreaViewProps) => {
  const { isMobile } = useDeviceDetect();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  const safeAreaStyles: React.CSSProperties = {};
  if (top) safeAreaStyles.paddingTop = 'env(safe-area-inset-top)';
  if (bottom) safeAreaStyles.paddingBottom = 'env(safe-area-inset-bottom)';
  if (left) safeAreaStyles.paddingLeft = 'env(safe-area-inset-left)';
  if (right) safeAreaStyles.paddingRight = 'env(safe-area-inset-right)';

  return (
    <div className={className} style={safeAreaStyles}>
      {children}
    </div>
  );
};

