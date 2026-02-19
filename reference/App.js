import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import InputState from "./Context/inputState";

function App() {
  return (
    <div className="App">
      <InputState>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </InputState>
    </div>
  );
}

export default App;






