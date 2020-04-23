/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import "./App.css";
import { useGapi } from "./useGapi";

const App = () => {
  const gapiLoaded = useGapi();
  const [pageToken, setPageToken] = React.useState();

  const getPopularVideos = async (key: string, pageToken?: string) => {
    try {
      const { result } = await window.gapi.client.youtube.videos.list({
        part: "snippet",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: 10,
        ...{ pageToken },
      });

      return result;
    } catch (error) {
      throw error.result.error;
    }
  };

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(gapiLoaded && "videos", getPopularVideos, {
    getFetchMore: (lastGroup, allGroups) => lastGroup.nextPageToken,
    retry: (i, error) => {
      if (error.code === 403) {
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
        {status === "error" && <div>Error: {(error as any).message}</div>}
        {status === "success" &&
          data.map((group, i) => (
            <React.Fragment key={i}>
              {group?.items?.map((item) => (
                <div key={item.id}>{item?.snippet?.title}</div>
              ))}
            </React.Fragment>
          ))}
        <div>
          <button
            onClick={() => fetchMore()}
            disabled={!canFetchMore || isFetchingMore}
          >
            {isFetching || isFetchingMore
              ? "Loading more..."
              : canFetchMore
              ? "Load More"
              : "Nothing more to load"}
          </button>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
};

export default App;
