import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormMessage from "../components/ui/FormMessage";
import Reveal from "../components/motion/Reveal";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDone(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
      <Reveal className="card-surface w-full max-w-md p-8 md:p-10">
        {done ? (
          <div className="text-center">
            <p className="font-display text-2xl text-ivory-50">Account created</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory-200/60">
              You're all set, {form.name.split(" ")[0]}. Log in to book your first service.
            </p>
            <button onClick={() => navigate("/login")} className="btn-primary mt-8 w-full">
              Go to login
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-3">Get started</p>
            <h1 className="font-display text-3xl text-ivory-50">Create your account</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="label-field">Full name</label>
                <input
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ananya Sharma"
                />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="label-field">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>

              <FormMessage>{error}</FormMessage>

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-ivory-200/50">
              Already have an account?{" "}
              <Link to="/login" className="text-clay-400 hover:text-clay-500">
                Log in
              </Link>
            </p>
          </>
        )}
      </Reveal>
    </div>
  );
}
