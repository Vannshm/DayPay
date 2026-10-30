import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { WalletCards, Mail, LockKeyhole, Eye, EyeOff, Check, LoaderCircle, AlertCircle } from "lucide-react";
import "./LoginPage.css";
import { useAuthStore } from '../authStore'

type FormErrors = { usernameOrEmail?: string; password?: string };

export default function LoginPage(){
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuthStore(); 
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage("");
    setSuccessMessage("");

    const nextErrors: FormErrors = {};
    if (!usernameOrEmail.trim()) nextErrors.usernameOrEmail = "Enter your username or email.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await login(usernameOrEmail.trim(), password);
      setSuccessMessage("Login successful.");
      navigate("/home")
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="daypay-login-page">
      <section className="login-hero" aria-label="Welcome to DayPay">
        <a className="login-brand" href="/" aria-label="DayPay home">
          <span className="login-brand-icon"><WalletCards size={29} strokeWidth={2.5} /></span><span>DayPay</span>
        </a>
        <div className="login-hero-copy">
          <h1>Welcome Back!</h1>
          <p>Log in to your account and continue<br className="login-desktop-break" /> tracking your expenses.</p>
        </div>
        <div className="login-illustration" aria-hidden="true">
          <div className="login-illustration-halo" />
          <div className="login-plant login-plant-left"><span /><span /><span /></div>
          <div className="login-device">
            <div className="device-top"><span /><span /></div>
            <div className="device-screen">
              <div className="device-chart-title" />
              <div className="device-chart"><i /><i /><i /><i /><i /></div>
              <div className="device-line" /><div className="device-line short" />
            </div>
          </div>
          <div className="login-receipt"><div /><div /><div /><div /><div className="receipt-short" /></div>
          <div className="login-coin">$</div>
          <div className="login-plant login-plant-right"><span /><span /><span /></div>
        </div>
        <ul className="login-benefits">
          <li><span><Check size={13} strokeWidth={3} /></span>View your spending history</li>
          <li><span><Check size={13} strokeWidth={3} /></span>Manage your budgets</li>
          <li><span><Check size={13} strokeWidth={3} /></span>Get insights &amp; reports</li>
        </ul>
      </section>

      <section className="login-panel" aria-label="Log in to your DayPay account">
        <div className="login-card">
          <header className="login-form-header">
            <h2>Login to DayPay</h2>
            <p>Enter your credentials to access your account.</p>
          </header>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="usernameOrEmail">Username or Email</label>
              <div className={`login-input-wrap ${errors.usernameOrEmail ? "has-error" : ""}`}>
                <Mail size={17} aria-hidden="true" />
                <input id="usernameOrEmail" name="usernameOrEmail" type="text" autoComplete="username" placeholder="Enter your username or email" value={usernameOrEmail}
                  onChange={(event) => { setUsernameOrEmail(event.target.value); setErrors((current) => ({ ...current, usernameOrEmail: undefined })); setServerMessage(""); setSuccessMessage(""); }}
                  aria-invalid={Boolean(errors.usernameOrEmail)} aria-describedby={errors.usernameOrEmail ? "login-identity-error" : undefined} />
              </div>
              {errors.usernameOrEmail && <p className="login-field-error" id="login-identity-error">{errors.usernameOrEmail}</p>}
            </div>

            <div className="login-field">
              <label htmlFor="loginPassword">Password</label>
              <div className={`login-input-wrap ${errors.password ? "has-error" : ""}`}>
                <LockKeyhole size={17} aria-hidden="true" />
                <input id="loginPassword" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password}
                  onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); setServerMessage(""); setSuccessMessage(""); }}
                  aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} />
                <button className="login-visibility-button" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="login-field-error" id="login-password-error">{errors.password}</p>}
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                <span className="remember-check"><Check size={12} strokeWidth={3} /></span>Remember me
              </label>
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            {serverMessage && <div className="login-server-alert" role="alert"><AlertCircle size={17} /><span>{serverMessage}</span></div>}
            {successMessage && <p className="login-success-message" role="status">{successMessage}</p>}

            <button className="login-submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><LoaderCircle className="login-spinner" size={17} /> Logging in...</> : "Login"}
            </button>
            <div className="login-divider"><span /><p>OR</p><span /></div>
            <button className="google-login-button" type="button" disabled title="Google sign-in is not connected yet">
              <span className="google-g" aria-hidden="true">G</span>Continue with Google
            </button>
            <p className="login-form-footer">Don't have an account? <a href="/signup">Sign Up</a></p>
          </form>
        </div>
      </section>
    </main>
  );
}
