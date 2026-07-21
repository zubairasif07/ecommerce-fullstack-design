import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import { LocaleProvider } from "./contexts/LocaleContext";

const RootRouter = () => {
  return (
    <LocaleProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </LocaleProvider>
  );
};

export default RootRouter;
