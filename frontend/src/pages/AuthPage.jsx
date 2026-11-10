
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(
        { ...(isRegister ? { name } : {}), email, password },
        isRegister ? "/auth/register" : "/auth/login"
      );

      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to The bnb
      </Link>

      <section className="auth-card">
        <div className="auth-heading">
          <img
            src="/bnb-logo.svg"
            alt="The bnb"
            className="auth-logo"
          />

          <p className="eyebrow">
            {isRegister ? "Your next chapter" : "Welcome back"}
          </p>

          <h1>
            {isRegister ? "Join the journey" : "Log in to The bnb"}
          </h1>

          <p>
            {isRegister
              ? "Create an account to find your next favorite place."
              : "Your next great getaway is just a sign-in away."}
          </p>
        </div>

        {error && <div className="notice error-notice">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <label>
              Your name
              <span className="input-with-icon">
                <UserRound size={17} />
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Alex Morgan"
                  maxLength={80}
                  required
                />
              </span>
            </label>
          )}

          <label>
            Email address
            <span className="input-with-icon">
              <Mail size={17} />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </span>
          </label>

          <label>
            Password
            <span className="input-with-icon">
              <KeyRound size={17} />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegister ? "At least 8 characters" : "Your password"}
                minLength={8}
                required
              />

              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting
              ? "One moment…"
              : isRegister
                ? "Create account"
                : "Log in"}
            <ArrowRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to The bnb?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
