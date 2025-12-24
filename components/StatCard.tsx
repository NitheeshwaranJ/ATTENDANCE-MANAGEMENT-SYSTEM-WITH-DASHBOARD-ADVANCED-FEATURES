import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = "blue", subtext }) => {
  const styles = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", iconBg: "bg-blue-100" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", iconBg: "bg-emerald-100" },
    red: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", iconBg: "bg-rose-100" },
    yellow: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", iconBg: "bg-amber-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", iconBg: "bg-indigo-100" }
  };

  const currentStyle = styles[color] || styles.blue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
          {subtext && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500">
               {subtext}
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-xl ${currentStyle.bg} ${currentStyle.text} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;