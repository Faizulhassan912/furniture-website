function Logo({ className = "h-10 w-auto text-primary", text = "S. Kids Furniture", logoUrl = null }) {
  // If a logo image URL is provided (from Cloudinary/database), render it
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={text} 
        className={className} 
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Premium Typography Logo — "S." monogram with brand text
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 50" className={className} fill="none">
      {/* "S" letter — bold, modern serif style */}
      <text 
        x="0" y="40" 
        fontFamily="'Outfit', sans-serif" 
        fontSize="46" 
        fontWeight="800" 
        fill="currentColor" 
        letterSpacing="-1"
      >
        S
      </text>
      
      {/* The signature dot "." — accent colored circle */}
      <circle cx="32" cy="37" r="5" fill="currentColor" opacity="0.85" />
      
      {/* "Kids" — medium weight */}
      <text 
        x="48" y="30" 
        fontFamily="'Outfit', sans-serif" 
        fontSize="22" 
        fontWeight="600" 
        fill="currentColor" 
        opacity="0.9"
      >
        Kids
      </text>
      
      {/* "Furniture" — lighter weight for hierarchy */}
      <text 
        x="48" y="46" 
        fontFamily="'Inter', sans-serif" 
        fontSize="13" 
        fontWeight="400" 
        fill="currentColor" 
        opacity="0.55"
        letterSpacing="3.5"
      >
        FURNITURE
      </text>
    </svg>
  );
}

export default Logo;
