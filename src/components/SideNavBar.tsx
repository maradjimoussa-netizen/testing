import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  FileText,
  Users,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Plus,
} from 'lucide-react';

interface SideNavBarProps {
  onOpenNewReport: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({ onOpenNewReport }) => {
  return (
    <aside
      id="side-navbar"
      className="bg-surface border-r border-outline-variant fixed left-0 top-0 h-full flex flex-col p-md z-30 w-[280px] hidden md:flex pt-20 select-none"
    >
      {/* Enterprise Admin Branding */}
      <div className="mb-6 px-md">
        <div className="flex items-center gap-2 mb-1">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy99rjz88rDcRdKp_wVLGlQITIkDVMG7nkhFXqqmnAsu98J8v5RM6cps0Wym-QuTLuQvzD9-w04hApxxUsFUBz0pm_5hN0p2m0ILky3pEKmCkvrH_M_S_abkY2wNC5ZtnH1783A_r6We2PkmwmNH0_flSDCl1l6JmMvqQNNJwBAkD-dHjb7-HfPGnvdMVK5F0nDLvE9gXIe-bpronXrVoIY91Ilq0AlcBfpFINIIaQKBey6H63edNt"
            alt="Organization Logo"
            className="w-6 h-6 rounded object-cover shadow-2xs"
          />
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Enterprise Admin
          </h2>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant px-1">
          Data Operations
        </p>

        {/* New Report Button */}
        <button
          id="btn-new-report"
          onClick={onOpenNewReport}
          className="mt-4 w-full bg-primary-container text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Report / Map</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-1">
        <button
          className="w-full flex items-center gap-3 px-md py-2.5 rounded-lg transition-all font-label-md text-label-md text-left bg-secondary-container text-on-secondary-container font-semibold shadow-2xs"
        >
          <FileText className="w-5 h-5 text-primary" />
          <span>Active Bounties</span>
        </button>

        <a
          href="#dashboard"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant px-md py-2.5 hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md text-label-md rounded-lg"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </a>

        <a
          href="#analytics"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant px-md py-2.5 hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md text-label-md rounded-lg"
        >
          <LineChart className="w-5 h-5" />
          <span>Analytics</span>
        </a>

        <a
          href="#team"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant px-md py-2.5 hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md text-label-md rounded-lg"
        >
          <Users className="w-5 h-5" />
          <span>Team Mappers</span>
        </a>

        <a
          href="#security"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant px-md py-2.5 hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md text-label-md rounded-lg"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Security & Fair Play</span>
        </a>
      </nav>

      {/* Footer / Utility Links */}
      <div className="mt-auto pt-4 border-t border-outline-variant space-y-1 px-1">
        <a
          href="#help"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant px-md py-2 hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md text-label-md rounded-lg"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help & Guidelines</span>
        </a>
        <a
          href="#logout"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 text-on-surface-variant hover:text-error px-md py-2 hover:bg-error-container/20 transition-all font-label-md text-label-md rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};
