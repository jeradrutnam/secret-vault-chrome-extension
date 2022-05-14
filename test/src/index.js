import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./AuthContext";

import "rsuite/dist/rsuite.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const authConfig = {
    signInRedirectURL: "http://localhost:3000/app", // Application Sign-In request handle URL
    signOutRedirectURL: "http://localhost:3000/app", // Application Sign-out request handle URL
    clientID: "LRk3fArkyPVASjbHfS9MCpkYgaca", // Application register ID
    baseUrl: "https://api.asgardeo.io/t/jerad", // Identity Provider Account Base Path
    scope: [ "openid", "profile" ]
};

root.render(
    <AuthProvider config={ authConfig }>
        <App />
    </AuthProvider>
);
