import React, { useState } from "react";

interface VendorTruncateProps {
  description: string;
  truncateLength?: number; // optional, default 200
}

const VendorTruncateDetails: React.FC<VendorTruncateProps> = ({
  description,
  truncateLength = 200,
}) => {
  const [showFull, setShowFull] = useState(false);

  const toggleShow = () => setShowFull(!showFull);

  // If description is short, no need to truncate
  if (description.length <= truncateLength) {
    return (
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    );
  }

  return (
    <p className="text-muted-foreground leading-relaxed">
      {showFull ? description : `${description.slice(0, truncateLength)}... `}
      <span
        onClick={toggleShow}
        className="text-gray-300 cursor-pointer hover:underline pl-1"
      >
        {showFull ? "Show less" : "Show more"}
      </span>
    </p>
  );
};

export default VendorTruncateDetails;
