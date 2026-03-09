export default function AdBanner({ position = 'sidebar' }) {
  return (
    <div className="ad-banner" id={`ad-${position}`}>
      <div className="ad-banner-label">Publicidade</div>
      <div className="ad-banner-text">Espaço Publicitário</div>
      {/* 
        Google AdSense code goes here:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXX"
          data-ad-slot="XXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true" />
      */}
    </div>
  );
}
