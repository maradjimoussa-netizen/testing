import React, { useState } from 'react';
import { INITIAL_BOUNTIES } from './data/mockData';
import { BeatmapBounty } from './types';
import { playSound } from './utils/audioSynth';
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { BountiesView } from './components/BountiesView';
import { CommentsModal } from './components/CommentsModal';
import { NewBountyModal } from './components/NewBountyModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Coins } from 'lucide-react';

export default function App() {
  const [bounties, setBounties] = useState<BeatmapBounty[]>(INITIAL_BOUNTIES);
  const [userPoints, setUserPoints] = useState<number>(450);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [commentingBounty, setCommentingBounty] = useState<BeatmapBounty | null>(null);
  const [isNewBountyModalOpen, setIsNewBountyModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  // Points notification toast
  const [rewardToast, setRewardToast] = useState<{ message: string; pts: number } | null>(null);

  const triggerRewardToast = (message: string, pts: number) => {
    setRewardToast({ message, pts });
    setTimeout(() => {
      setRewardToast(null);
    }, 2800);
  };

  const handleVote = (id: string) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextVoted = !b.userVoted;
          if (nextVoted) {
            playSound('vote');
            setUserPoints((pts) => pts + 50);
            triggerRewardToast('Participation Bonus Received!', 50);
            return {
              ...b,
              votes: b.votes + 1,
              userVoted: true,
            };
          } else {
            playSound('select');
            setUserPoints((pts) => Math.max(0, pts - 50));
            return {
              ...b,
              votes: Math.max(0, b.votes - 1),
              userVoted: false,
            };
          }
        }
        return b;
      })
    );
  };

  const handleFavorite = (id: string) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextFav = !b.userFavorited;
          playSound(nextFav ? 'favorite' : 'select');
          return {
            ...b,
            userFavorited: nextFav,
          };
        }
        return b;
      })
    );
  };

  const handleAddComment = (bountyId: string, text: string, rating: number) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      user: 'Admin User',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBD2xdrhWknpV9hkImpCimVV7kdbkR3f9lHTTwYydcCeVsdkI6rolwJsLCsT3_KadhGE0wGyTC06udm20ku797lru-V0_6Lg1AvVXEP3C1FqDZ-bRqRfD16BNmIvgNb_QkErapnkwiP8g5J8d65eeKJDSkE8JuD0bOo6iaLUnypaAQWkqqeIftJFBWaJwn1JMxFIO5G5BlN0NMu8eGLMkT-B_NvIY45MBBNjovV2Fwnd56OnQx6jB9p',
      time: 'Just now',
      text,
      rating,
    };

    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          return {
            ...b,
            comments: [newComment, ...b.comments],
          };
        }
        return b;
      })
    );

    // Also update commentingBounty so modal re-renders
    setCommentingBounty((prev) =>
      prev && prev.id === bountyId
        ? { ...prev, comments: [newComment, ...prev.comments] }
        : prev
    );

    triggerRewardToast('Review feedback posted! (+20 pts)', 20);
    setUserPoints((pts) => pts + 20);
  };

  const handleCreateBounty = (newBounty: BeatmapBounty) => {
    setBounties((prev) => [newBounty, ...prev]);
    triggerRewardToast('Bounty published for review! (+100 pts)', 100);
    setUserPoints((pts) => pts + 100);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-inter selection:bg-primary-container selection:text-white">
      {/* Reward Toast Animation */}
      {rewardToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 text-white border border-amber-400/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold">{rewardToast.message}</p>
            <p className="text-sm font-bold text-amber-400 font-geist">
              +{rewardToast.pts} Points
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNavBar
        userPoints={userPoints}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotifications(0);
        }}
        unreadNotifications={unreadNotifications}
      />

      {/* Main App Layout */}
      <div className="flex flex-1">
        {/* Side Navigation Bar (Enterprise Admin) */}
        <SideNavBar onOpenNewReport={() => setIsNewBountyModalOpen(true)} />

        {/* Active Bounties Portal with rhythm cards designed like the screenshot */}
        <BountiesView
          bounties={bounties}
          onVote={handleVote}
          onFavorite={handleFavorite}
          onOpenComments={(bounty) => setCommentingBounty(bounty)}
          userPoints={userPoints}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Comments & Reviews Modal */}
      <CommentsModal
        bounty={commentingBounty}
        onClose={() => setCommentingBounty(null)}
        onAddComment={handleAddComment}
      />

      {/* New Bounty Report Modal */}
      <NewBountyModal
        isOpen={isNewBountyModalOpen}
        onClose={() => setIsNewBountyModalOpen(false)}
        onSubmit={handleCreateBounty}
      />

      {/* Community Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => {
          setUnreadNotifications(0);
          setIsNotificationsOpen(false);
        }}
      />
    </div>
  );
}
