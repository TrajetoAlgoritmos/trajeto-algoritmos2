interface ISubmissionRequest {
  sourceCode: string;
  languageId: 75 | number;
  stdin?: string;
}

interface ISubmissionResponse {
  data: {
    stdout: string;
  };
}

interface IEvaluationRequest {
  track_algorithms_id: number;
  languageId: 75 | number;
  content: string;
}

interface IEvalationAnswer {
  userId: number;
  answerId: number;
  algorithmTestsId: number;
  content: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  result: string;
}

interface IEvaluationResponse {
  success: boolean;
  message: string;
  qtdTests: number;
  corrects: IEvalationAnswer[];
  incorrects: IEvalationAnswer[];
  erros: IEvalationAnswer[];
}
