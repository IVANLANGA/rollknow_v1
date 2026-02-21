export interface StudentProfile {
    id: string;
    name: string;
    avatar_url?: string;
    level: number;
    xp: number;
    next_level_xp: number;
    current_streak: number;
    longest_streak: number;
    skills: {
        research: number;
        collaboration: number;
        creation: number;
    };
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
    skill_tree: 'Research' | 'Collaboration' | 'Creation';
    estimated_hours: number;
    xp_reward: number;
    objectives: string[];
    success_criteria: string[];
    requirements?: {
        min_level?: number;
        required_skills?: Record<string, number>;
    };
    status?: 'locked' | 'available' | 'active' | 'completed';
}

export interface ChallengeSubmission {
    id: string;
    challenge_id: string;
    challenge_title: string;
    status: 'active' | 'pending_review' | 'completed';
    started_at: string;
    submitted_at?: string;
    completed_at?: string;
    files?: Array<{ name: string; url: string }>;
    feedback?: string;
}

export interface RollSession {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'upcoming' | 'completed';
    start_time: string;
    participants_count: number;
    is_participant: boolean;
}

export interface DiceRoll {
    id: string;
    user_name: string;
    user_avatar?: string;
    value: number;
    timestamp: string;
    challenge_generated?: string;
}
