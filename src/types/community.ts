// ─────────────────────────────────────────────────────────────
// MyFitAI — Community Type Definitions (Category 6 stubs)
// ─────────────────────────────────────────────────────────────

export type ReactionType = 'fire' | 'solid' | 'beast';

export interface Reaction {
  type: ReactionType;
  userId: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBadge?: string;
  type: 'workout' | 'pr' | 'milestone' | 'routine';
  sessionId?: string;
  workoutName?: string;
  exerciseSummary?: string[];
  duration?: number;
  totalVolume?: number;
  prsHit?: number;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: string;
}

export interface PublishedRoutine {
  id: string;
  authorId: string;
  authorName: string;
  templateId: string;
  title: string;
  description: string;
  tags: string[];
  followerCount: number;
  rating: number;
  timesCompleted: number;
  publishedAt: string;
}
