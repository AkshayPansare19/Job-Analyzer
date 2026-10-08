import { useState } from "react";

function Login({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = (event) => {
  event.preventDefault();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  const displayName = email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  onLogin({
    name: displayName,
    email: email,
  });
};

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">JM</div>
          <h1>JobMatch AI</h1>
        </div>

        <div className="auth-heading">
          <h2>Welcome Back</h2>
          <p>Login to continue your job search</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-options">

            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() => alert("Password reset will be added soon.")}
            >
              Forgot Password?
            </button>

          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="signup-section">
          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="create-account-button"
            onClick={onCreateAccount}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;