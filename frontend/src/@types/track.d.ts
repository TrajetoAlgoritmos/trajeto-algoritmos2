interface Answers {
  correct: number;
  incorrect: number;
  error: number;
  running: number;
  notAnswered: number;
}
interface Student {
  id: number;
  name: string;
  email: string;
  answers: Answers;
}

interface ITrack {
  id: number;
  codigo: string;
  title: string;
  description: string;
  startAt: string;
  closeAt: string;
  students: Student[];
  algorithms: IAlgorithm[];
  userTrackId?: number;
  status?: 'started' | 'finished' | string | undefined;
}

interface ITrackGetRequest {
  page: string | number;
  limit: string | number;
}

interface ITrackGetResponse {
  data: ITrack[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
  };
}

interface IAnswer {
  id: number;
  content: string;
}

interface ITrackContextProps {
  loading: boolean;
  tracks: ITrackGetResponse | undefined;
  joinedTracks: ITrackGetResponse | undefined;
  currentTrack: ITrack | undefined;
  getTracks: (params: ITrackGetRequest) => Promise<void>;
  createTrack: (track: ITrack) => Promise<void>;
  getTrackById: (id: string | number, student?: boolean) => Promise<void>;
  updateTrack: (data: ITrack) => Promise<void>;
  handleAddAlgorithmToTrack: (
    trackId: number,
    algorithmId: number
  ) => Promise<void>;
  handleRemoveAlgorithmToTrack: (
    trackId: number,
    algorithmId: number
  ) => Promise<void>;
  handleJoinTrack: (code: string) => Promise<void>;
  getJoinedTracks: (params: ITrackGetRequest) => Promise<void>;
}
