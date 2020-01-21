import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const API_KEY = "AIzaSyDCfKSNLeYj2DCufI9nfMTc_-gtpyWMW9M";

const App = () => {
  const loadYoutubeApi = () => {
    if (window.gapi) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      window.gapi.load("client", () => {
        window.gapi.client.setApiKey(API_KEY);
        window.gapi.client.load("youtube", "v3", () => {
          console.log("Google client api loaded");
        });
      });
    };

    document.body.appendChild(script);
  };

  function authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(
        () => console.log("Sign-in successful"),
        (err: Error) => console.error("Error signing in", err)
      );
  }

  // // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return window.gapi.client.youtube.videos
      .list({
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: "US"
      })
      .then(
        function(response: any) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function(err: any) {
          console.error("Execute error", err);
        }
      );
  }

  useEffect(() => loadYoutubeApi(), []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
