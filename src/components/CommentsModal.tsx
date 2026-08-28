import React, { useState } from 'react';
import { BeatmapBounty } from '../types';
import { playSound } from '../utils/audioSynth';
import { MessageSquare, Star, Send, X } from 'lucide-react';

interface CommentsModalProps {
  bounty: BeatmapBounty | null;
  onClose: () => void;
  onAddComment: (bountyId: string, text: string, rating: number) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  bounty,
  onClose,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);

  if (!bounty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(bounty.id, commentText.trim(), rating);
    setCommentText('');
    playSound('vote');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                Discussion & Feedback
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-1">
                {bounty.title} · Mapped by {bounty.mapper}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {bounty.comments.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant text-xs">
              No comments yet on this bounty. Be the first to share mapping feedback!
            </div>
          ) : (
            bounty.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/50"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-outline-variant"
                    />
                    <span className="font-semibold text-xs text-on-surface">
                      {comment.user}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {comment.time}
                    </span>
                  </div>
                  {comment.rating && (
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{comment.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-on-surface leading-relaxed pl-8">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3.5 border-t border-outline-variant bg-surface-container-low"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">
              Your Review Rating:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-0.5 text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? 'fill-amber-500' : 'text-outline-variant'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave constructive feedback for the mapper..."
              className="flex-1 px-3.5 py-2 text-xs bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
