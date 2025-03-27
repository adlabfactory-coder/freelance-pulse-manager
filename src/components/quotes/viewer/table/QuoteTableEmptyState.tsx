
import React from "react";

const QuoteTableEmptyState: React.FC = () => {
  return (
    <div className="rounded-md border p-8 text-center">
      <p className="text-muted-foreground">Aucun devis trouvé</p>
    </div>
  );
};

export default QuoteTableEmptyState;
