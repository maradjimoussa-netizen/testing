import React from 'react';
import { Search, Bell, Settings, Award, Layers } from 'lucide-react';

interface TopNavBarProps {
  userPoints: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  userPoints,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  unreadNotifications,
}) => {
  return (
    <nav
      id="top-navbar"
      className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-40 shadow-xs"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight group-hover:text-primary-container transition-colors">
            DataCore
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-primary-container/10 text-primary-container">
            Beatmaps
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search beatmaps, mappers..."
            className="pl-9 pr-8 py-1.5 bg-surface-container rounded-full border border-transparent focus:border-outline-variant text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container w-64 lg:w-72 text-on-surface transition-all placeholder:text-on-surface-variant/70"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Points Badge */}
        <div
          id="user-points-badge"
          className="flex items-center gap-1.5 bg-primary-container/10 border border-primary-container/20 px-3 py-1 rounded-full text-xs font-semibold text-primary"
          title="Earn +50 points for every vote you cast!"
        >
          <Award className="w-3.5 h-3.5 text-primary-container" />
          <span className="font-bold font-geist">{userPoints.toLocaleString()}</span>
          <span className="text-on-surface-variant text-[11px]">PTS</span>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          onClick={onOpenNotifications}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse" />
          )}
        </button>

        {/* Settings */}
        <button
          id="settings-btn"
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors hidden sm:block"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
          <img
            id="user-profile-avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD2xdrhWknpV9hkImpCimVV7kdbkR3f9lHTTwYydcCeVsdkI6rolwJsLCsT3_KadhGE0wGyTC06udm20ku797lru-V0_6Lg1AvVXEP3C1FqDZ-bRqRfD16BNmIvgNb_QkErapnkwiP8g5J8d65eeKJDSkE8JuD0bOo6iaLUnypaAQWkqqeIftJFBWaJwn1JMxFIO5G5BlN0NMu8eGLMkT-B_NvIY45MBBNjovV2Fwnd56OnQx6jB9p"
            alt="User profile avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/20"
          />
          <div className="hidden xl:block text-left text-xs">
            <p className="font-semibold text-on-surface leading-tight">Admin User</p>
            <p className="text-on-surface-variant text-[11px]">Rank #42</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
