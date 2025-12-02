import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todo";
import { useAuth } from "./context/auth";
import ProtectedRoute from "./components/ProtectedRoutes.tsx";

const App: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/todos">My Todos</Link>
            <button onClick={logout} className="link-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const Home: React.FC = () => (
  <div>
    <h1>Welcome to Todo App</h1>
    <p>Login or sign up to manage your todos.</p>
  </div>
);

const NotFound: React.FC = () => <h2>Page not found</h2>;

export default App;
