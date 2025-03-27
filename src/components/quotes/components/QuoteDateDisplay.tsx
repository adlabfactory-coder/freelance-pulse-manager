
import React from "react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface QuoteDateDisplayProps {
  date: Date | string;
  type: "validUntil" | "updatedAt";
}

const QuoteDateDisplay: React.FC<QuoteDateDisplayProps> = ({ date, type }) => {
  const dateObj = new Date(date);
  const now = new Date();

  if (type === "validUntil") {
    return dateObj > now ? (
      <span>
        {formatDistance(dateObj, now, {
          addSuffix: true,
          locale: fr
        })}
      </span>
    ) : (
      <span className="text-destructive">Expiré</span>
    );
  }

  return (
    <span>
      {formatDistance(dateObj, now, {
        addSuffix: true,
        locale: fr
      })}
    </span>
  );
};

export default QuoteDateDisplay;
