/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { usePaginatedQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import "./App.css";
import { useGapi } from "./useGapi";

const getPopularVideos = async (key: string, pageToken?: string) => {
  const response = await window.gapi.client.youtube.videos.list({
    part: "snippet",
    chart: "mostPopular",
    regionCode: "US",
    maxResults: 10,
    ...{ pageToken },
  });

  console.log(response);

  return response;
};

const App = () => {
  const gapiLoaded = useGapi();
  const [pageToken, setPageToken] = React.useState();

  const {
    status,
    resolvedData,
    latestData,
    error,
    isFetching,
  } = usePaginatedQuery(gapiLoaded && ["videos", pageToken], getPopularVideos, {
    retry: (_, response: any) => {
      if (response.result.error) {
        return false;
      }
      return true;
    },
    // staleTime: 100000,
  });

  return (
    <>
      <div className="App">
        {status === "loading" && <div>Loading...</div>}
        {status === "error" && (
          <div>Error: {(error as any).result.error.message}</div>
        )}
        {status === "success" &&
          resolvedData?.result?.items?.map((item) => (
            <div key={item.id}>{item?.snippet?.title}</div>
          ))}
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
};

export default App;
