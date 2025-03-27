
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Données simulées pour les revenus mensuels
const getRevenueData = () => {
  const months = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
    "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
  ];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    // Génère des données pour les 12 derniers mois
    let revenue = 0;
    
    // Si c'est un mois passé dans l'année courante ou un mois de l'année précédente
    if (index <= currentMonth) {
      // Génère des revenus entre 10000 et 40000
      revenue = Math.floor(Math.random() * 30000) + 10000;
    }
    
    return {
      name: month,
      revenue: revenue
    };
  });
};

const RevenueChart: React.FC = () => {
  const data = getRevenueData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} €`, "Revenus"]}
          labelFormatter={(name) => `Mois: ${name}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          name="Revenus (€)"
          stroke="#82ca9d" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
