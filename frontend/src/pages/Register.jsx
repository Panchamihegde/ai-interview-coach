import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Registration failed"
        );
      }

      // Registration successful
      navigate("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        {/* Header */}
        <div className="auth-header">
          <h1>AI Interview Coach</h1>

          <p>
            Create your account and start practicing interviews.
          </p>
        </div>

        {/* Registration Form */}
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          {/* Full Name */}
          <div className="input-group">

            <label className="input-label">
              Full Name
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                👤
              </span>

              <input
                className="auth-input"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>

          </div>


          {/* Email */}
          <div className="input-group">

            <label className="input-label">
              Email Address
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉️
              </span>

              <input
                className="auth-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

          </div>


          {/* Password */}
          <div className="input-group">

            <label className="input-label">
              Password
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                className="auth-input"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

          </div>


          {/* Terms */}
          <div className="terms-group">

            <input
              type="checkbox"
              className="terms-checkbox"
              required
            />

            <span>
              I agree to the{" "}
              <a
                href="#"
                className="terms-link"
                onClick={(e) => e.preventDefault()}
              >
                Terms & Conditions
              </a>
            </span>

          </div>


          {/* Error */}
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}


          {/* Create Account */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        {/* Login Link */}
        <div className="auth-switch">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;