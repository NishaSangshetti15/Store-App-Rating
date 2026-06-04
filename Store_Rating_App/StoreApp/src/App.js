
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import UserDashboard from "./pages/UserDashboard.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import OwnerDashboard from "./pages/OwnerDashboard.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/user"
          element={<UserDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/owner"
          element={<OwnerDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;