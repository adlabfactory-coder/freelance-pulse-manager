
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Commission } from "@/types/commissions";

interface CommissionsBarChartProps {
  commissions: Commission[];
}

const CommissionsBarChart: React.FC<CommissionsBarChartProps> = ({ commissions }) => {
  // Regrouper les commissions par freelancer
  const freelancerData = commissions.reduce((result: Record<string, number>, commission) => {
    const name = commission.freelancerName || 'Inconnu';
    if (!result[name]) {
      result[name] = 0;
    }
    result[name] += commission.amount;
    return result;
  }, {});

  // Convertir en tableau pour recharts
  const data = Object.entries(freelancerData).map(([name, amount]) => ({
    name,
    amount: Number(amount.toFixed(2))
  })).sort((a, b) => b.amount - a.amount);

  // Si aucune donnée
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Aucune donnée de commission disponible</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end"
          height={70}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} €`, "Montant"]}
          labelFormatter={(name) => `Commercial: ${name}`}
        />
        <Legend />
        <Bar dataKey="amount" name="Montant (€)" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommissionsBarChart;
