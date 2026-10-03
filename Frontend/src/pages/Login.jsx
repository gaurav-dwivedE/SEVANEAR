import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormMessage from "../components/ui/FormMessage";
import Reveal from "../components/motion/Reveal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    const redirectTo =
      location.state?.from?.pathname || (result.user.role === "admin" ? "/admin" : "/dashboard");
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
      <Reveal className="card-surface w-full max-w-md p-8 md:p-10">
        <p className="eyebrow mb-3">Welcome back</p>
        <h1 className="font-display text-3xl text-ivory-50">Log in to SevaNear</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <FormMessage>{error}</FormMessage>

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ivory-200/50">
          New to SevaNear?{" "}
          <Link to="/signup" className="text-clay-400 hover:text-clay-500">
            Create an account
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
