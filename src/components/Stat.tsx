import React from 'react';

interface StatProps {
  value: string;
  label: string;
  color: string;
}

const Stat: React.FC<StatProps> = ({ value, label, color }) => {
  return (
    <div className="text-center">
      <div className={`text-3xl md:text-4xl font-bold ${color} mb-2`}>
        {value}
      </div>
      <div className="text-sm text-gray-400">
        {label}
      </div>
    </div>
  );
};

export default Stat;
