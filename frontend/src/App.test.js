import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./shared/components/AuthContext";

test("Trying to render <App />", () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});
