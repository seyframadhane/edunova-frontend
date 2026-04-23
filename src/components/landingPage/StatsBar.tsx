import React from 'react';
import { BookOpen, MonitorPlay, Award, Users } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  text: string;
}

const StatsBar = (): React.JSX.Element => {
  const stats: Stat[] = [
    { icon: <Users size={20} />, text: "Learn from Experts" },
    { icon: <BookOpen size={20} />, text: "Curated Courses" },
    { icon: <Award size={20} />, text: "Job Oriented Programs" },
    { icon: <MonitorPlay size={20} />, text: "Smart Learning" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 py-6 border-b border-black/5">
      <div className="container flex flex-col items-start pl-8 gap-8 sm:flex-row sm:items-center sm:justify-around sm:pl-0 sm:gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-800 font-semibold">
            <div className="text-primary bg-white p-1.5 rounded-lg flex items-center justify-center">{stat.icon}</div>
            <span className="">{stat.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
