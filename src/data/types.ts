export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  photo?: string;
  relation: string;
  birthday: string;
  bio: string;
  color: string;
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  category: "milestone" | "daily" | "tradition" | "achievement";
  description: string;
  photos: string[];
  memberIds: string[];
  icon: string;
}

export interface FamilyMotto {
  content: string;
  source: string;
}

export const categoryLabels: Record<FamilyEvent["category"], string> = {
  milestone: "里程碑",
  daily: "日常",
  tradition: "传统",
  achievement: "成就",
};

export const categoryColors: Record<FamilyEvent["category"], string> = {
  milestone: "#E8725A",
  daily: "#5B9BD5",
  tradition: "#8BC34A",
  achievement: "#FFB74D",
};
