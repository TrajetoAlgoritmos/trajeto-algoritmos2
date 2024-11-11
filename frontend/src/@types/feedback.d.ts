interface ISendFeedback {
  value: number;
  trackId: number;
  algorithmId: number | null;
  group: string | null;
}

interface IFeedbackByTrack {
  id: number;
  value: number;
  algorithmId: any;
  trackId: number;
  userId: number;
  group: string;
  createdAt: string;
  updatedAt: string;
}
