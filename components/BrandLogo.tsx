import React, { useState } from 'react';

type BrandLogoProps = {
  className?: string;
  wordmarkClassName?: string;
  subtitleClassName?: string;
  iconClassName?: string;
  compact?: boolean;
};

const BRAND_LOGO_URL = '/abravacon-logo.svg';

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  wordmarkClassName = '',
  subtitleClassName = '',
  iconClassName = '',
  compact = false,
}) => {
  const [logoLoaded, setLogoLoaded] = useState(true);

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[rgba(201,156,74,0.35)] bg-[linear-gradient(145deg,#102843_0%,#0b1f35_58%,#081728_100%)] shadow-[0_18px_45px_rgba(3,10,20,0.45)] ${iconClassName}`.trim()}>
        {logoLoaded ? (
          <img
            src={BRAND_LOGO_URL}
            alt="Abravacon"
            className="h-full w-full object-contain"
            onError={() => setLogoLoaded(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(214,174,94,0.2),transparent_42%)]" />
        )}
      </div>

      <div className="min-w-0">
        <div
          className={`font-['Cormorant_Garamond',serif] text-4xl leading-none tracking-[-0.05em] text-[var(--brand-gold-soft)] ${wordmarkClassName}`.trim()}
        >
          Abravacon
        </div>
        {!compact && (
          <div
            className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-[rgba(240,231,211,0.72)] ${subtitleClassName}`.trim()}
          >
            Consultoria Patrimonial
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
