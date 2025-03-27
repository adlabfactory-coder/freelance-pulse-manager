
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Subscription } from "@/types/subscription";

interface SubscriptionsChartProps {
  subscriptions: Subscription[];
}

const SubscriptionsChart: React.FC<SubscriptionsChartProps> = ({ subscriptions }) => {
  // Compter les abonnements actifs par intervalle
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "active");
  
  // Regrouper par intervalle
  const intervalCounts = activeSubscriptions.reduce((acc: Record<string, number>, sub) => {
    const interval = sub.interval;
    if (!acc[interval]) {
      acc[interval] = 0;
    }
    acc[interval]++;
    return acc;
  }, {});
  
  // Convertir en format pour Recharts
  const data = Object.entries(intervalCounts).map(([name, value]) => {
    // Mapper les noms d'intervalle pour l'affichage
    const displayNames: Record<string, string> = {
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      biannual: "Semestriel",
      annual: "Annuel",
      yearly: "Annuel"
    };
    
    return {
      name: displayNames[name] || name,
      value
    };
  });
  
  // Couleurs pour le graphique
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Si aucun abonnement actif
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Aucun abonnement actif</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} abonnements`, "Nombre"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SubscriptionsChart;
