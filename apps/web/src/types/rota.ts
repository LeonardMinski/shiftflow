export type WeekPublication = {
  id: string;
  weekStart: string;
  publishedAt: string | null;
};

export type WeekPublicationData = {
  weekPublication: WeekPublication | null;
};

export type WeekPublicationVariables = {
  weekStart: string;
};

export type PublishWeekData = {
  publishWeek: WeekPublication;
};

export type PublishWeekVariables = {
  weekStart: string;
};
