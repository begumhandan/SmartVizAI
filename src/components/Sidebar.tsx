import { MessageSquarePlus, History, Settings, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    onNewChat: () => void;
    className?: string;
}

export function Sidebar({ onNewChat, className }: SidebarProps) {
    const menuItems = [
        { icon: MessageSquarePlus, label: 'New Chat', onClick: onNewChat, active: true },
        { icon: History, label: 'History', onClick: () => { }, active: false },
        { icon: Settings, label: 'Settings', onClick: () => { }, active: false },
    ];

    return (
        <aside className={cn("hidden md:flex flex-col w-64 h-screen border-r border-white/5 bg-slate-900/50 backdrop-blur-xl p-4", className)}>
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
                    <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    SmartVizAI
                </span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                            item.active
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        )}
                    >
                        <item.icon className={cn("w-4 h-4 transition-colors", item.active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="pt-4 border-t border-white/5">
                <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">My Projects</div>
                    <div className="text-xs text-slate-600 italic">No saved projects</div>
                </div>
            </div>
        </aside>
    );
}
