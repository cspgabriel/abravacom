import React, { useState } from 'react';

type BrandLogoProps = {
  className?: string;
  wordmarkClassName?: string;
  subtitleClassName?: string;
  iconClassName?: string;
  compact?: boolean;
};

// PNG used as the official Abravacon logo
const BRAND_LOGO_URL = 'https://i.ibb.co/4wCtPpnC/image-1773870221155.png';

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconClassName = '',
}) => {
  const [logoLoaded, setLogoLoaded] = useState(true);

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div
        className={`relative flex h-14 w-[180px] items-center justify-center overflow-hidden rounded-2xl border border-[rgba(201,156,74,0.35)] bg-[linear-gradient(145deg,#102843_0%,#0b1f35_58%,#081728_100%)] shadow-[0_18px_45px_rgba(3,10,20,0.45)] ${iconClassName}`.trim()}
      >
        {logoLoaded ? (
          <img
            src={BRAND_LOGO_URL}
            alt="Abravacon"
            className="h-full w-auto max-w-full"
            onError={() => setLogoLoaded(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(214,174,94,0.2),transparent_42%)]" />
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
