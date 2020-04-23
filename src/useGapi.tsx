import { useState, useEffect } from "react";

export const useGapi = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.gapi) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      gapi.load("client", () => {
        gapi.client.load("youtube", "v3", () => {
          gapi.client.setApiKey(process.env.REACT_APP_API_KEY as string);

          setIsLoaded(true);
        });
      });
    };

    document.body.appendChild(script);
  }, []);

  return isLoaded;

  // gapi.auth2.init({
  //   client_id: CLIENT_ID,
  //   scope: "https://www.googleapis.com/auth/youtube.readonly",
  // });
};

// const authenticate = async () => {
//   window.gapi.auth2
//     .getAuthInstance()
//     .signIn()
//     .then(
//       () => setIsLoggedIn(true),
//       (err) => console.error("Error signing in", err)
//     );
// };
