import React from "react";
import { Router } from "@routes/index";
import { AuthProvider } from "@context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { ChatWidget } from "./components/ChatWidget";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <div className="App">
        <Router />
        <ChatWidget />
        <Toaster />
      </div>
    </AuthProvider>
  );
};