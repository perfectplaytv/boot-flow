import React, { useEffect, useRef, HTMLAttributes } from 'react';

type DynamicStyleProps = {
  styles?: Record<string, string | number | undefined>;
  as?: keyof JSX.IntrinsicElements;
} & HTMLAttributes<HTMLElement>;

export default function DynamicStyle({ styles, as: As = 'div', className, ...rest }: DynamicStyleProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !styles) return;
    Object.entries(styles).forEach(([k, v]) => {
      try {
        // if it's a CSS custom property (starts with --) use setProperty
        if (k.startsWith('--')) {
          el.style.setProperty(k, v === undefined ? '' : String(v));
        } else {
          // assign via camelCase property on style for normal properties
          (el.style as any)[k] = v === undefined ? '' : String(v);
        }
      } catch (e) {
        // ignore invalid style keys
      }
    });
  }, [styles]);

  return (
    // @ts-expect-error dynamic element
    <As ref={ref as any} className={className} {...rest} />
  );
}
