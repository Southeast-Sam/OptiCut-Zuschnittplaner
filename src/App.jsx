import Layout from "./components/Layout";
import CuttingPage from "./pages/CuttingPage";
import PDFExportPage from "./pages/PDFExportPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CuttingPage />} />
          <Route path="pdf" element={<PDFExportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
