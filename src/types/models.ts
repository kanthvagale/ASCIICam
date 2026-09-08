import type { Language } from "@/i18n/config";

/** Dummy content that isn't in the translation files carries both languages. */
export type Localized = Record<Language, string>;

export type User = {
  id: string;
  name: Localized;
  email: string;
  phone: string;
  bio: Localized;
  avatar: string;
  stats: { posts: number; followers: number; following: number };
};

export type Category = {
  id: string;
  label: Localized;
  icon: string;
  color: string;
};

export type FeedItem = {
  id: string;
  title: Localized;
  excerpt: Localized;
  categoryId: string;
  image: string;
  readMinutes: number;
  createdAt: string;
};

export type NotificationKind = "message" | "like" | "system" | "follow";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: Localized;
  body: Localized;
  createdAt: string;
  read: boolean;
};

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
};

export type LegalSection = {
  id: string;
  heading: Localized;
  body: Localized;
};

export type OnboardingSlide = {
  id: string;
  titleKey: string;
  bodyKey: string;
  icon: string;
};
