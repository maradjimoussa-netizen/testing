import React, { useState } from 'react';
import { BeatmapBounty } from '../types';
import { playSound } from '../utils/audioSynth';
import { PlusCircle, X, Music, AlertCircle } from 'lucide-react';

interface NewBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newBounty: BeatmapBounty) => void;
}

export const NewBountyModal: React.FC<NewBountyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [mapper, setMapper] = useState('EnterpriseMapper');
  const [genre, setGenre] = useState<'Electronic' | 'Rock' | 'Pop' | 'Anime'>('Electronic');
  const [difficultyRating, setDifficultyRating] = useState('4.2');
  const [bpm, setBpm] = useState('180');
  const [length, setLength] = useState('02:15');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    const ratingNum = parseFloat(difficultyRating) || 4.0;
    const diffCategory = ratingNum < 3 ? 'Easy' : ratingNum < 5 ? 'Normal' : 'Hard';

    // Curated art matching genres
    const sampleBanners = {
      Electronic:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCM_6GnQxb0s7ohCPcvrmW672E9SilC-3_hJEUFukkGzibLKSTQDYPbvn6fnMEh1AO-kIpT8SZRiRCcd78t7RKN5TaDZ0giT4_hCfdOS-xKnW1IYj5GkRfYjqGZdwdRpgRWcScrNBiIi9y1efdPirbr7FJArd8N--xpVtJwIBV0Jcm4dl7-mMOvAy1wAKpBNjN_YtuZd153vpnidqw78EIUoL5umOud_vfKbotqILpWgfk-fFL6pRpU',
      Rock:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxFhZscH9LGj6pGXzI-ZQbUE6evliaTsc37e0Hyj6oOjdtChE5iinWR47lxCldDffmBJhqP8GEYMl6fZ3b1I4CJljM0y1Hf3H_2X36xp1bpOWshifugr_l7I1NCTO5TggG3u4sB8TM9mtWX1rwwl3w0TqiKC3kXPbQ3759popdgAKrU8x83FkqnlnOQ6LHVbb-lI_RsNFFuZJsfVEkaeZDbd3ZUVed2v1s57NJwK2Hr9ZcPX07UddZ',
      Pop:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZAN8hWB5x7uuY3cfXY6CBx0SiXAYnS-VKMIatfshsuJimLMwmZgEVLtHlqIr5Bkg1LCqNDjogiCYQRDwgoeQgzNdgTP_P1bJOO6dBe2v_tVcXEafwxgMOXfYhSi7zdI2islPguUAElbg-ZnT3QXCdEK2JbiStmWFHyVqpKXbZa_bOi7njyjmYcRWS-VCN7l9cgNUICU_cmTFfkxFNVfzs1bigRLTabzsC6X-_Ce7o3UyQEfzpcGWY',
      Anime:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCM_6GnQxb0s7ohCPcvrmW672E9SilC-3_hJEUFukkGzibLKSTQDYPbvn6fnMEh1AO-kIpT8SZRiRCcd78t7RKN5TaDZ0giT4_hCfdOS-xKnW1IYj5GkRfYjqGZdwdRpgRWcScrNBiIi9y1efdPirbr7FJArd8N--xpVtJwIBV0Jcm4dl7-mMOvAy1wAKpBNjN_YtuZd153vpnidqw78EIUoL5umOud_vfKbotqILpWgfk-fFL6pRpU',
    };

    const newBounty: BeatmapBounty = {
      id: `bounty-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      mapper: mapper.trim() || 'CommunityMapper',
      genre,
      difficultyRating: ratingNum,
      difficultyCategory: diffCategory,
      difficultyName: `${mapper}'s Extra`,
      votes: 1,
      userVoted: true,
      userFavorited: false,
      bannerUrl: sampleBanners[genre],
      previewDuration: '1:00',
      previewSeconds: 60,
      currentPlaybackTime: 0,
      isPlaying: false,
      bpm: parseInt(bpm) || 180,
      length: length.trim() || '02:00',
      circleSize: 4.0,
      approachRate: 9.0,
      accuracy: 8.0,
      hpDrain: 6.0,
      bountyRewardPoints: 50,
      description: description.trim() || 'New community beatmap bounty submission.',
      comments: [],
    };

    onSubmit(newBounty);
    playSound('vote');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">
              Submit New Beatmap Bounty
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Beatmap Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Stellar Overdrive"
                className="w-full px-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Artist / Band *
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Camellia"
                className="w-full px-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as any)}
                className="w-full px-2.5 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              >
                <option value="Electronic">Electronic</option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Anime">Anime</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Stars (★)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={difficultyRating}
                onChange={(e) => setDifficultyRating(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                BPM
              </label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Mapping Notes / Pattern Highlights
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe stream velocity, slider art, or rhythm gimmicks..."
              className="w-full px-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Publish Bounty</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
