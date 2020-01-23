/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const API_KEY = "AIzaSyDCfKSNLeYj2DCufI9nfMTc_-gtpyWMW9M";
const CLIENT_ID =
  "332020508961-t7tue80uk5ovr7it0j6513plf450tfmv.apps.googleusercontent.com";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  const loadYoutubeApi = () => {
    if (window.gapi) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      gapi.load("client", () => {
        gapi.client.load("youtube", "v3", () => {
          gapi.client.setApiKey(API_KEY);
          gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: "https://www.googleapis.com/auth/youtube.readonly"
          });
          setGapiLoaded(true);
        });
      });
    };

    document.body.appendChild(script);
  };

  const authenticate = async () => {
    window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        () => setIsLoggedIn(true),
        err => console.error("Error signing in", err)
      );
  };

  // Make sure the client is loaded and sign-in is complete before calling this method.
  const execute = async () => {
    try {
      const response = await window.gapi.client.youtube.videos.list({
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: "US"
      });
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
    } catch (err) {
      return console.error("Execute error", err);
    }
  };

  useEffect(() => loadYoutubeApi(), []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {gapiLoaded && (
          <button onClick={() => authenticate()}>Authenticate</button>
        )}
        {isLoggedIn && <button onClick={() => execute()}>Fetch Videos</button>}
      </header>
    </div>
  );
};

export default App;
