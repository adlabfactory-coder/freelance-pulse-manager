
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Subscription } from "@/types/subscription";

interface RenewalRateChartProps {
  subscriptions: Subscription[];
}

const RenewalRateChart: React.FC<RenewalRateChartProps> = ({ subscriptions }) => {
  // Calculer des statistiques simulées de renouvellement
  const expiringSubscriptions = 35;  // Nombre d'abonnements arrivés à expiration
  const renewedSubscriptions = 28;   // Nombre d'abonnements renouvelés
  
  const renewalRate = (renewedSubscriptions / expiringSubscriptions) * 100;
  const nonRenewalRate = 100 - renewalRate;
  
  const data = [
    { name: "Renouvelés", value: renewalRate },
    { name: "Non renouvelés", value: nonRenewalRate }
  ];
  
  // Couleurs pour le graphique
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Taux"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RenewalRateChart;
