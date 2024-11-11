interface IAlgorithm {
  id: number;
  title: string;
  tag: string;
  description: string;
  createdAt: string;
  track_algorithm_id?: number;
}

interface IAlgorithmGetRequest {
  page: string | number;
  limit: string | number;
}

interface IAlgorithmGetResponse {
  data: IAlgorithm[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
  };
}

interface IAlgorithmTest {
  id: number;
  input: string;
  output: string;
  algorithmId: number;
}

interface IAlgorithmContextProps {
  loading: boolean;
  algorithms: IAlgorithmGetResponse | undefined;
  algorithmTests: IAlgorithmTest[];
  currentAlgorithmId: number | undefined;
  handleAddAlgorithmTest: (algorithmTest: IAlgorithmTest) => Promise<void>;
  handleRemoveAlgorithmTest: (id: number) => Promoise<void>;
  getAlgorithms: (params: IAlgorithmGetRequest) => Promise<void>;
  createAlgorithm: (algorithm: IAlgorithm) => Promise<void>;
  getAlgorithmById: (id: string | number) => Promise<IAlgorithm | undefined>;
  updateAlgorithm: (data: IAlgorithm) => Promise<void>;
}
