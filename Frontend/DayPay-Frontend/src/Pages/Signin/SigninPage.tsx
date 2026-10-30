import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  WalletCards,
  UserRound,
  Mail,
  LockKeyhole,
  CircleDollarSign,
  ChartNoAxesColumnIncreasing,
  Sprout,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import "./SigninPage.css";
import { useAuthStore } from '../authStore'
import {WalletIllustration} from '../Signin/WalletIllustration'
import type { FormValues , FormErrors, FieldName } from './FormValues'
import { validateForm } from "./validateForm";

const initialValues: FormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};


export default function SignupPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { signup } = useAuthStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as FieldName;

    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage("");
    setSuccessMessage("");

    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
  await signup(values.username, values.email, values.password);
  setSuccessMessage("Your account has been created successfully.");
} catch (err) {
  console.error(err);
  setServerMessage("Unable to create your account. Please try again.");
} finally {
  setIsSubmitting(false);
}
  };

  const passwordChecks = [
    { label: "8+ characters", met: values.password.length >= 8 },
    { label: "Uppercase and lowercase", met: /[A-Z]/.test(values.password) && /[a-z]/.test(values.password) },
    { label: "A number", met: /\d/.test(values.password) },
    { label: "A special character", met: /[^A-Za-z0-9]/.test(values.password) },
  ];
  const showPasswordChecks = values.password.length > 0;

  return (
    <main className="daypay-signup-page">
      <section className="signup-hero" aria-label="About DayPay">
        <a className="daypay-brand" href="/" aria-label="DayPay home">
          <span className="brand-icon"><WalletCards size={28} strokeWidth={2.5} /></span>
          <span>DayPay</span>
        </a>

        <div className="hero-copy">
          <p className="eyebrow">A clearer view of your money</p>
          <h1>Take Control<br />of Your Finances</h1>
          <p className="hero-description">
            Track your expenses, build better habits<br className="desktop-break" /> and achieve your financial goals.
          </p>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon"><CircleDollarSign size={21} strokeWidth={2.2} /></span>
            <div><h2>Track Expenses</h2><p>Keep record of all your spending.</p></div>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><ChartNoAxesColumnIncreasing size={22} strokeWidth={2.5} /></span>
            <div><h2>Analyse Spending</h2><p>Get useful insights with reports.</p></div>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><Sprout size={22} strokeWidth={2.5} /></span>
            <div><h2>Reach Your Goals</h2><p>Save more, live better.</p></div>
          </div>
        </div>

        <div className="illustration-glow" aria-hidden="true" />
        <WalletIllustration />
        <p className="hero-footnote">Small steps today. Better money habits tomorrow.</p>
      </section>

      <section className="signup-panel" aria-label="Create your DayPay account">
        <div className="signup-card">
          <header className="form-header">
            <h2>Create Account</h2>
            <p>Join DayPay and start your journey to better<br className="desktop-break" /> money management.</p>
          </header>

          {successMessage ? (
            <div className="success-state" role="status">
              <span className="success-mark"><CheckCircle2 size={30} /></span>
              <h3>You're all set!</h3>
              <p>{successMessage}</p>
              <a className="submit-button success-login-link" href="/login">Continue to Login <span aria-hidden="true">→</span></a>
            </div>
          ) : (
            <form className="signup-form" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <div className={`input-wrap ${errors.username ? "has-error" : ""}`}>
                  <UserRound size={17} aria-hidden="true" />
                  <input id="username" name="username" type="text" autoComplete="username" placeholder="Enter your username" value={values.username} onChange={handleChange} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? "username-error" : undefined} />
                </div>
                {errors.username && <p className="field-error" id="username-error">{errors.username}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <div className={`input-wrap ${errors.email ? "has-error" : ""}`}>
                  <Mail size={17} aria-hidden="true" />
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                </div>
                {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
              </div>


              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className={`input-wrap ${errors.password ? "has-error" : ""}`}>
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password" value={values.password} onChange={handleChange} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : showPasswordChecks ? "password-checks" : undefined} />
                  <button className="visibility-button" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
                {showPasswordChecks && (
                  <div className="password-checks" id="password-checks" aria-live="polite">
                    {passwordChecks.map((check) => (
                      <span key={check.label} className={check.met ? "check-met" : ""}>
                        <CheckCircle2 size={12} /> {check.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`input-wrap ${errors.confirmPassword ? "has-error" : ""}`}>
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirm your password" value={values.confirmPassword} onChange={handleChange} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined} />
                  <button className="visibility-button" type="button" onClick={() => setShowConfirmPassword((shown) => !shown)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="field-error" id="confirm-password-error">{errors.confirmPassword}</p>}
              </div>

              {serverMessage && <div className="server-alert" role="alert"><AlertCircle size={17} /><span>{serverMessage}</span></div>}

              <button className="submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle className="button-spinner" size={17} /> Creating account...</> : "Sign Up"}
              </button>
              <p className="form-footer">Already have an account? <a href="/login">Login</a></p>
            </form>
          )}
          <p className="secure-note"><LockKeyhole size={12} /> Your information is kept private and secure.</p>
        </div>
      </section>
    </main>
  );
}
