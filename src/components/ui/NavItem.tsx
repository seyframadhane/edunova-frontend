import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    isBottom?: boolean;
    isCollapsed?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, isBottom, isCollapsed }) => (
    <div className={`
    flex items-center cursor-pointer transition-all duration-200 
    ${isCollapsed ? 'justify-center px-4 py-4' : 'space-x-4 px-8 py-4'}
    ${active ? 'bg-white/10 text-white ' + (isCollapsed ? '' : 'border-l-4 border-indigo-500') : 'text-gray-400 hover:text-white hover:bg-white/5'}
    ${isBottom ? 'mt-auto' : ''}
  `} title={isCollapsed ? label : undefined}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        {!isCollapsed && <span className="font-medium tracking-wide whitespace-nowrap overflow-hidden">{label}</span>}
    </div>
);