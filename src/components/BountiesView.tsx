import React, { useState, useEffect } from 'react';
import { BeatmapBounty } from '../types';
import { playSound, playBeatmapPreview, stopMusicPreview } from '../utils/audioSynth';
import { BeatmapCard } from './BeatmapCard';
import { CardInspectModal } from './CardInspectModal';
import {
  Search,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Coins,
  ArrowUpDown,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';

interface BountiesViewProps {
  bounties: BeatmapBounty[];
  onVote: (id: string) => void;
  onFavorite: (id: string) => void;
  onOpenComments: (bounty: BeatmapBounty) => void;
  userPoints: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BountiesView: React.FC<BountiesViewProps> = ({
  bounties,
  onVote,
  onFavorite,
  onOpenComments,
  userPoints,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Any Difficulty');
  const [sortBy, setSortBy] = useState<'votes' | 'rating' | 'bpm'>('votes');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [id: string]: number }>({});
  const [inspectingBounty, setInspectingBounty] = useState<BeatmapBounty | null>(null);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      stopMusicPreview();
    };
  }, []);

  const handleTogglePlay = (bounty: BeatmapBounty) => {
    if (activeAudioId === bounty.id) {
      stopMusicPreview();
      setActiveAudioId(null);
    } else {
      stopMusicPreview();
      setActiveAudioId(bounty.id);
      playSound('select');

      playBeatmapPreview(
        bounty.bpm,
        bounty.genre,
        (elapsedSec) => {
          const ratio = Math.min(1, elapsedSec / (bounty.previewSeconds || 60));
          setAudioProgress((prev) => ({
            ...prev,
            [bounty.id]: ratio,
          }));
        },
        () => {
          setActiveAudioId(null);
        }
      );
    }
  };

  const handleScrubWaveform = (bounty: BeatmapBounty, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    setAudioProgress((prev) => ({
      ...prev,
      [bounty.id]: newProgress,
    }));
    playSound('select');
  };

  // Filter and sort bounties
  const filteredBounties = bounties
    .filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.mapper.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === 'All Genres' ||
        b.genre.toLowerCase() === selectedGenre.toLowerCase();

      const matchesDifficulty =
        selectedDifficulty === 'Any Difficulty' ||
        (selectedDifficulty.includes('Normal') && b.difficultyRating < 4) ||
        (selectedDifficulty.includes('Hard') && b.difficultyRating >= 4 && b.difficultyRating < 4.8) ||
        (selectedDifficulty.includes('Insane') && b.difficultyRating >= 4.8);

      return matchesSearch && matchesGenre && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'rating') return b.difficultyRating - a.difficultyRating;
      if (sortBy === 'bpm') return b.bpm - a.bpm;
      return 0;
    });

  return (
    <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop max-w-[1440px] mx-auto w-full">
      {/* Hero Header */}
      <header className="mb-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2 font-bold tracking-tight">
              Active Bounties
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Review and vote on the latest community beatmap submissions. Card specifications reflect verified approach rates, circle size, and timing parameters.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-600 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Cycle 14 Curation: 3 Days Remaining</span>
          </div>
        </div>
      </header>

      {/* Search & Filters Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md mb-lg shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
          <input
            id="bounty-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, artist, or mapper..."
            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors bg-white text-on-surface"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
          {/* Genre Select */}
          <select
            id="genre-filter-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 text-body-sm font-body-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none bg-white cursor-pointer"
          >
            <option>All Genres</option>
            <option>Electronic</option>
            <option>Rock</option>
            <option>Pop</option>
          </select>

          {/* Difficulty Select */}
          <select
            id="difficulty-filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 text-body-sm font-body-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none bg-white cursor-pointer"
          >
            <option>Any Difficulty</option>
            <option>Normal (&lt;4★)</option>
            <option>Hard (4.0★ - 4.8★)</option>
            <option>Insane (4.8★+)</option>
          </select>

          {/* Sort Button */}
          <button
            id="sort-bounties-btn"
            onClick={() => {
              playSound('select');
              setSortBy((prev) => (prev === 'votes' ? 'rating' : prev === 'rating' ? 'bpm' : 'votes'));
            }}
            className="flex items-center gap-1.5 border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap bg-white shadow-2xs"
          >
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
            <span>
              Sort: {sortBy === 'votes' ? 'Votes' : sortBy === 'rating' ? 'Difficulty' : 'BPM'}
            </span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout: Cards and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Grid: Beatmap Cards in Image Style */}
        <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBounties.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
              <p className="text-lg font-medium text-on-surface mb-2">No matching beatmap bounties</p>
              <p className="text-sm text-on-surface-variant mb-4">Try clearing filters or search terms</p>
              <button
                onClick={() => {
                  onSearchChange('');
                  setSelectedGenre('All Genres');
                  setSelectedDifficulty('Any Difficulty');
                }}
                className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredBounties.map((bounty) => (
              <BeatmapCard
                key={bounty.id}
                bounty={bounty}
                isPlaying={activeAudioId === bounty.id}
                audioProgress={audioProgress[bounty.id] ?? 0}
                onTogglePlay={() => handleTogglePlay(bounty)}
                onScrubAudio={(e) => handleScrubWaveform(bounty, e)}
                onVote={() => onVote(bounty.id)}
                onFavorite={() => onFavorite(bounty.id)}
                onOpenComments={() => onOpenComments(bounty)}
                onInspectCard={() => setInspectingBounty(bounty)}
              />
            ))
          )}
        </div>

        {/* Sidebar / Bonus Section */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-gutter">
          {/* Participation Bonus Card */}
          <div
            id="participation-bonus-card"
            className="bg-primary-container/10 border border-primary-container/20 rounded-xl p-lg relative overflow-hidden shadow-2xs"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-5 h-5 text-primary-container" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Participation Bonus
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                Earn points for every community vote you cast. Use points to sponsor your own submissions or unlock custom profile flairs.
              </p>

              <div className="bg-surface-container-lowest rounded-lg p-3 border border-primary-container/10 flex justify-between items-center shadow-2xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Reward per vote:
                </span>
                <span className="font-label-md text-label-md text-primary-container font-bold">
                  +50 Points
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-primary-container/15 flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Your Current Balance:</span>
                <span className="font-bold text-primary font-geist text-sm">
                  {userPoints.toLocaleString()} PTS
                </span>
              </div>
            </div>

            {/* Decorative background star */}
            <Star
              className="absolute -bottom-6 -right-6 w-36 h-36 text-primary-container/5 -rotate-12 pointer-events-none"
              strokeWidth={1}
            />
          </div>

          {/* Voting Rules */}
          <div
            id="voting-rules-card"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-2xs"
          >
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-outline-variant font-bold">
              Voting Rules
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-on-surface-variant mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">
                    One Vote Per Map
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-normal">
                    You can only cast a single vote for any given beatmap bounty.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-on-surface-variant mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">
                    Weekly Cycles
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-normal">
                    Voting closes every Sunday at 23:59 UTC. Results are tallied on Monday.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-on-surface-variant mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">
                    Quality Control
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-normal">
                    Suspicious voting patterns may result in account penalties to ensure fairness.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Card Parameter Legend */}
          <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Card Technical Legend</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">CS (Circle Size):</span>
                <span>Hit object hitcircle radius</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">AR (Approach Rate):</span>
                <span>Visual reaction speed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">OD (Accuracy):</span>
                <span>Hit judgement window in ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">HP (Drain):</span>
                <span>Health recovery & decay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Inspector Modal */}
      <CardInspectModal
        bounty={inspectingBounty}
        onClose={() => setInspectingBounty(null)}
        onVote={onVote}
        onFavorite={onFavorite}
      />
    </main>
  );
};
