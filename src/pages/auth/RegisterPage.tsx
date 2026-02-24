import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { register, clearError } from '@store/slices/authSlice';
import { Button } from '@components/common/Button/Button';
import { Alert } from '@components/common/Alert/Alert';
import { UserRole } from '@types';
import {
  Activity,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Briefcase,
  FileText,
  Building,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '', // Only for frontend validation
    firstName: '',
    lastName: '',
    role: 'PATIENT' as UserRole,
    specialization: '',
    licenseNumber: '',
    department: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Prepare data for backend (exclude confirmPassword)
    const registerData = {
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      ...(formData.specialization && { specialization: formData.specialization }),
      ...(formData.licenseNumber && { licenseNumber: formData.licenseNumber }),
      ...(formData.department && { department: formData.department }),
    };

    const result = await dispatch(register(registerData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/verify-email', { state: { email: formData.email } });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setValidationError('');

    if (step === 1) {
      // Validate Step 1
      if (
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setValidationError('Please fill all required fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setValidationError('Please enter a valid email address');
        return;
      }

      // Phone validation (international format)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phone)) {
        setValidationError('Phone number must be valid (e.g., +1234567890)');
        return;
      }

      // Password validation
      if (formData.password.length < 8) {
        setValidationError('Password must be at least 8 characters');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
    }

    if (step === 2) {
      // Validate Step 2
      if (!formData.firstName || !formData.lastName) {
        setValidationError('Please enter your first and last name');
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setValidationError('');
    setStep(step - 1);
  };

return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 1. THE BACKGROUND IMAGE LAYER (Cinematic Zoom) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: `url('/src/assets/shams.png')`,
        }}
      />

      {/* 2. THE CREATIVE OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-navy/40 via-black/20 to-navy/70" />

      {/* 3. YOUR REGISTRATION CARD */}
<div className="relative z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-slide-up border border-white/30">
       <div className="text-center mb-8">
  <div className="flex items-center justify-center gap-3 mb-6">
    {/* Updated Logo Container - Circular & Transparent */}
    <div className="p-1 bg-transparent rounded-full overflow-hidden flex items-center justify-center">
      <img 
        src="/src/assets/logo.png" 
        alt="SHAMS Logo" 
        className="w-16 h-16 transition-all duration-300 object-contain rounded-full shadow-lg shadow-blue-500/10"
      />
    </div>
    
    <h1 className="text-3xl font-extrabold gradient-primary bg-clip-text text-transparent">
      SHAMS
    </h1>
  </div>
  
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
    Create Account
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Join our healthcare management system
  </p>
</div>
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                    step >= s
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                <span className="text-xs mt-2 font-semibold text-gray-600 dark:text-gray-400">
                  {s === 1 ? 'Account' : s === 2 ? 'Personal' : 'Role'}
                </span>
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 mx-2 -mt-5 transition-colors ${
                    step > s ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {(error || validationError) && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error || validationError}
              onClose={() => {
                dispatch(clearError());
                setValidationError('');
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Account Information */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Include country code (e.g., +1 for USA)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span>Show passwords</span>
              </label>

              <Button type="button" variant="primary" size="lg" fullWidth onClick={nextStep}>
                Continue →
              </Button>
            </>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
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

          {/* Step 3: Role Information */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  I am a
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  required
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                </select>
              </div>

              {(formData.role === 'DOCTOR' || formData.role === 'NURSE') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Specialization
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="specialization"
                        placeholder="e.g., Cardiology"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      License Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="licenseNumber"
                        placeholder="Your medical license number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g., Emergency"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <label className="flex items-start gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={prevStep}>
                  ← Back
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
