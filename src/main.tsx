import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { BypassAuthProvider } from "./contexts/BypassAuthContext";
import { EnquiryProvider } from "./contexts/EnquiryContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <BypassAuthProvider>
          <AuthProvider>
            <UserProvider>
              <EnquiryProvider>
                <App />
              </EnquiryProvider>
            </UserProvider>
          </AuthProvider>
        </BypassAuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);