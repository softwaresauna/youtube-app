type ErrorResponse = {
  error: {
    errors: {
      domain: string;
      reason: string;
      message: string;
      extendedHelp: string;
    }[];
    code: number;
    message: string;
  };
};

type VideoResponse =
  | gapi.client.Response<gapi.client.youtube.VideoListResponse>
  | ErrorResponse;
