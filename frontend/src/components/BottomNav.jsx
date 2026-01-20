import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: '探索', icon: 'style', path: '/' },
        { label: '论坛', icon: 'forum', path: '/forum' },
        { label: '添加', icon: 'add', path: '/add', isCenter: true },
        { label: '消息', icon: 'chat_bubble', path: '/messages' },
        { label: '我的', icon: 'person', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around px-4 pb-4 z-50">
            {navItems.map((item) => {
                if (item.isCenter) {
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="relative -top-8 size-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white border-4 border-background-light dark:border-background-dark transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined text-3xl font-bold">{item.icon}</span>
                        </button>
                    );
                }

                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive ? "text-primary" : "text-warm-beige"
                        )}
                    >
                        <span className={clsx("material-symbols-outlined", isActive && "fill-primary")}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
