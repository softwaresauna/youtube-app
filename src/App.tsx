/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import "./App.css";
import { useGapi } from "./useGapi";

// Make sure the client is loaded and sign-in is complete before calling this method.
const getPopularVideos = async () => {
  try {
    const response = await window.gapi.client.youtube.videos.list({
      part: "snippet",
      chart: "mostPopular",
      regionCode: "US",
    });
    // Handle the results here (response.result has the parsed body).
    return response.result;
  } catch (error) {
    return error;
  }
};

const App = () => {
  const gapiLoaded = useGapi();

  const { status, data, error } = useQuery(
    gapiLoaded && "videos",
    getPopularVideos
    // {
    //   retry: (_, response) => {
    //     if ((response as any).status === 403) {
    //       return false;
    //     }
    //     return true;
    //   },
    // }
  );

  React.useEffect(() => {
    console.log("status", status);
  }, [status]);

  // React.useEffect(() => {
  //   console.log("data", data);
  // }, [data]);

  React.useEffect(() => {
    console.log("error", error);
  }, [error]);

  return (
    <>
      <div className="App">
        {(() => {
          if (status === "loading") {
            return <span>Loading...</span>;
          }

          if (status === "error") {
            return <span>Error: {(error as any).result.error.message}</span>;
          }
        })()}
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
};

export default App;
