/**
 * RegisterPage.tsx
 * Patient self-registration – NO role selection.
 * Roles ADMIN / DOCTOR / NURSE are created exclusively by admins.
 *
 * Steps:
 *   1 → Account credentials (email, phone, password)
 *   2 → Personal information (first name, last name)
 *   3 → Confirmation & submit
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { register, clearError } from "@store/slices/authSlice";
import { Button } from "@components/common/Button/Button";
import { Alert } from "@components/common/Alert/Alert";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle,
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    phone: "+254",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agree: false,   // new field
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
  };
  // ── Password strength helpers ──────────────────────────────
const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains number", test: (p: string) => /\d/.test(p) },
  { label: "Contains special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const getPasswordScore = (password: string) =>
  passwordRules.filter((rule) => rule.test(password)).length;

  // ── Step navigation ──────────────────────────────────────────────
const nextStep = () => {
  setValidationError("");

  if (step === 1) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setValidationError("Please fill in all required fields");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setValidationError("Phone must be valid (e.g. +254712345678)");
      return;
    }

    // Strict password validation
    const score = getPasswordScore(formData.password);
    if (score < passwordRules.length) {
      setValidationError("Password must meet all strength requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
  }

  if (step === 2) {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setValidationError("Please enter your first and last name");
      return;
    }
  }

  if (step === 3) {
    if (!formData.agree) {
      setValidationError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    // ✅ Do NOT increment step here — step 3 is the final stage
    return;
  }

  // Only increment step if not at the final step
  setStep((s) => s + 1);
};

  const prevStep = () => {
    setValidationError("");
    setStep((s) => s - 1);
  };

// ── Submit ────────────────────────────────────────────────────────
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setValidationError("");

  // ✅ Enforce agreement before submission
  if (!formData.agree) {
    setValidationError("You must agree to the Terms of Service and Privacy Policy");
    return;
  }

  const result = await dispatch(
    register({
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    }),
  );

  if (register.fulfilled.match(result)) {
    navigate("/verify-email", { state: { email: formData.email } });
  }
};

  // ── Step labels & icons ───────────────────────────────────────────
  const steps = [
    { label: "Account", icon: Lock },
    { label: "Personal", icon: User },
    { label: "Confirm", icon: CheckCircle },
  ];
  

  return (
    
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundImage: `url('/src/assets/shams.png')` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-900/50 via-black/30 to-blue-900/60" />

      <div className="relative z-20 bg-white/75 dark:bg-gray-900/75 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-white/30 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/src/assets/logo.png"
              alt="SHAMS"
              className="w-14 h-14 rounded-full object-contain"
            />
            <h1 className="text-3xl font-extrabold gradient-primary bg-clip-text text-transparent">
              SHAMS
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Create Patient Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Join SHAMS – Smart Healthcare Management System
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => {
            const idx = i + 1;
            const StepIcon = s.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${
                      step > idx
                        ? "bg-green-500 text-white"
                        : step === idx
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {step > idx ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-semibold text-gray-600 dark:text-gray-400">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 -mt-5 ${step > idx ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Alerts */}
        {(error || validationError) && (
          <div className="mb-5">
            <Alert
              type="error"
              message={error || validationError}
              onClose={() => {
                dispatch(clearError());
                setValidationError("");
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Step 1: Account ─────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g. +254 for Kenya)
                </p>
              </div>

           <div>
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
    Password <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Minimum 8 characters"
      value={formData.password}
      onChange={handleChange}
      required
      className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  </div>

  {/* Strength Meter */}
  <div className="flex gap-1 mt-2">
    {passwordRules.map((_, i) => (
      <div
        key={i}
        className={`h-2 flex-1 rounded ${
          i < getPasswordScore(formData.password)
            ? getPasswordScore(formData.password) < 4
              ? "bg-yellow-400"
              : "bg-green-500"
            : "bg-red-400"
        }`}
      />
    ))}
  </div>

  {/* Checklist */}
  <ul className="mt-2 space-y-1 text-sm">
    {passwordRules.map((rule, i) => (
      <li
        key={i}
        className={`flex items-center ${
          rule.test(formData.password) ? "text-green-600" : "text-gray-500"
        }`}
      >
        <CheckCircle
          className={`w-4 h-4 mr-1 ${
            rule.test(formData.password) ? "text-green-500" : "text-gray-400"
          }`}
        />
        {rule.label}
      </li>
    ))}
  </ul>
</div>

{/* Confirm Password */}
<div className="mt-4">
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
    Confirm Password <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type={showPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Re-enter password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
      className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
    />
    {formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword && (
        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
      )}
  </div>
</div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500"
                />
                Show passwords
              </label>

              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={nextStep}
              >
                Continue →
              </Button>
            </>
          )}

          {/* ── Step 2: Personal ─────────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="text-center mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <User className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  Tell us your name so doctors can identify you
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={prevStep}>
                  ← Back
                </Button>
                <Button type="button" variant="primary" onClick={nextStep}>
                  Continue →
                </Button>
              </div>
            </>
          )}

{/* ── Step 3: Confirm ──────────────────────────────────────── */}
{/* ── Step 3: Confirm ──────────────────────────────────────── */}
{step === 3 && (
  <>
    {/* Review Details */}
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 space-y-3 border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
        Review your details
      </h3>
      {[
        { label: "Full Name", value: `${formData.firstName} ${formData.lastName}` },
        { label: "Email", value: formData.email },
        { label: "Phone", value: formData.phone },
      ].map((item) => (
        <div key={item.label} className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {item.label}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {item.value}
          </span>
        </div>
      ))}
    </div>

    {/* Verification Info */}
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        📧 A 6-digit verification code will be sent to{" "}
        <strong>{formData.email}</strong>
      </p>
    </div>

    {/* Agreement Checkbox */}
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={(e) =>
            setFormData({ ...formData, agree: e.target.checked })
          }
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          I agree to the{" "}
          <Link to="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>
      {!formData.agree && validationError && (
        <p className="text-red-500 text-xs mt-1">{validationError}</p>
      )}
    </div>

    {/* Navigation Buttons */}
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" onClick={prevStep}>
        ← Back
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!formData.agree} // ✅ disabled until checkbox is ticked
      >
        {formData.agree ? "Create Account" : "Please agree to continue"}
      </Button>
    </div>
  </>
)}
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
