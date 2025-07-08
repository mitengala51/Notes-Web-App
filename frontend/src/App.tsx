import "./App.css";
import Dashboard from "./Pages/DashBoard";
import SignUpPage from "./Pages/SignUpPage";
import { BrowserRouter, Routes , Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
