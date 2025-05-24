import Layout from "./components/Layout";
import CuttingPage from "./pages/CuttingPage";
import Verlauf from "./pages/Verlauf";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CuttingPage />} />
          <Route path="history" element={<Verlauf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
