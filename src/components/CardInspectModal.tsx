import React from 'react';
import { BeatmapBounty } from '../types';
import {
  X,
  Star,
  Clock,
  Activity,
  Heart,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface CardInspectModalProps {
  bounty: BeatmapBounty | null;
  onClose: () => void;
  onVote: (id: string) => void;
  onFavorite: (id: string) => void;
}

export const CardInspectModal: React.FC<CardInspectModalProps> = ({
  bounty,
  onClose,
  onVote,
  onFavorite,
}) => {
  if (!bounty) return null;

  const isHighDifficulty = bounty.difficultyRating >= 4.2;
  const headerBgClass = isHighDifficulty
    ? 'bg-rose-500 text-white'
    : 'bg-amber-400 text-slate-950';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Star Rating Top Banner */}
        <div
          className={`w-full py-2 px-4 flex items-center justify-between font-bold text-sm tracking-wider select-none ${headerBgClass}`}
        >
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-current stroke-current" />
            <Star className="w-4 h-4 fill-current stroke-current" />
            <Star className="w-4 h-4 fill-current stroke-current" />
            <Star className="w-4 h-4 fill-current stroke-current" />
            {bounty.difficultyRating >= 4.5 && (
              <Star className="w-4 h-4 fill-current stroke-current" />
            )}
            <span className="ml-1 text-xs uppercase tracking-widest">
              {bounty.difficultyCategory} Difficulty
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-black text-base font-geist">
              {bounty.difficultyRating.toFixed(2)} ★
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cover Artwork Banner */}
        <div className="relative h-44 w-full bg-slate-950 overflow-hidden flex-shrink-0">
          <img
            src={bounty.bannerUrl}
            alt={bounty.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-slate-950/80 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700 text-slate-200">
              {bounty.genre}
            </span>
            <span className="bg-slate-950/80 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700 text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {bounty.bpm} BPM
            </span>
          </div>

          <button
            onClick={() => onFavorite(bounty.id)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border ${
              bounty.userFavorited
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${bounty.userFavorited ? 'fill-rose-500' : ''}`}
            />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-black text-white">{bounty.title}</h2>
              <p className="text-sm text-slate-300 font-medium">{bounty.artist}</p>
            </div>
            <span className="bg-slate-800/90 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
              {bounty.difficultyName}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <p className="text-xs text-slate-400">
              Mapped by{' '}
              <span className="text-slate-100 font-bold">{bounty.mapper}</span>
            </p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {bounty.description}
            </p>
          </div>

          {/* Full Rhythm Parameter Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Beatmap Technical Parameters</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Drain Time</span>
                <span className="text-slate-100 font-bold font-geist text-sm">
                  {bounty.length}
                </span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Tempo</span>
                <span className="text-slate-100 font-bold font-geist text-sm">
                  {bounty.bpm} BPM
                </span>
              </div>
            </div>

            {/* Spec Meters */}
            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Circle Size (CS)</span>
                  <span className="text-slate-200 font-bold font-geist">
                    {bounty.circleSize.toFixed(1)} / 7.0
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(bounty.circleSize / 7) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Approach Rate (AR)</span>
                  <span className="text-slate-200 font-bold font-geist">
                    {bounty.approachRate.toFixed(1)} / 10.0
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(bounty.approachRate / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Overall Difficulty (OD)</span>
                  <span className="text-slate-200 font-bold font-geist">
                    {bounty.accuracy.toFixed(1)} / 10.0
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(bounty.accuracy / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">HP Drain Rate (HP)</span>
                  <span className="text-slate-200 font-bold font-geist">
                    {bounty.hpDrain.toFixed(1)} / 10.0
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(bounty.hpDrain / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="text-xs text-slate-400">
            Current tally:{' '}
            <span className="text-white font-bold font-geist">
              {bounty.votes.toLocaleString()}
            </span>{' '}
            votes
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onVote(bounty.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                bounty.userVoted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              {bounty.userVoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Voted (+50 pts)</span>
                </>
              ) : (
                <span>Cast Vote (+50 pts)</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
