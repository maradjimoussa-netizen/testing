import React from 'react';
import { Bell, CheckCircle2, Award, Zap, X } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      icon: Award,
      color: 'text-amber-500 bg-amber-500/10',
      title: 'Participation Bonus Claimed',
      desc: 'You earned +50 points for your community vote on Neon Drift Velocity.',
      time: '12m ago',
    },
    {
      id: 'n2',
      icon: Zap,
      color: 'text-primary-container bg-primary-container/10',
      title: 'Match Deck Updated',
      desc: 'New head-to-head tournament cards loaded into your match inventory.',
      time: '1h ago',
    },
    {
      id: 'n3',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10',
      title: 'Weekly Cycle 14 Active',
      desc: 'Community tally closes Sunday 23:59 UTC.',
      time: '4h ago',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-end p-4 md:p-6">
      <div className="mt-14 mr-2 bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="p-3.5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-xs text-on-surface">Community Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-outline-variant/60 max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="p-3.5 hover:bg-surface-container transition-colors flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-on-surface leading-tight">{n.title}</h4>
                    <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-normal">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2 border-t border-outline-variant bg-surface-container-low text-center">
          <button
            onClick={onClear}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
