/**
 * CreateUserModal.tsx
 *
 * Admin can create users of ANY role (PATIENT, DOCTOR, NURSE, ADMIN).
 * Doctor can create PATIENT accounts only.
 *
 * On creation the backend sends an invite/verification email to the user.
 */
import React, { useState } from "react";
import { userService } from "@services/api/user.service";
import { Button } from "@components/common/Button/Button";
import { Alert } from "@components/common/Alert/Alert";
import type { UserRole, CreateUserData } from "@types";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Building,
  FileText,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** If provided, only PATIENT role is available */
  restrictToPatient?: boolean;
  /** Who is creating (ADMIN or DOCTOR) */
  createdBy?: UserRole;
}

const ROLE_OPTIONS = [
  { value: "PATIENT" as const, label: "🏥 Patient", color: "text-blue-600" },
  { value: "DOCTOR" as const, label: "👨‍⚕️ Doctor", color: "text-teal-600" },
  { value: "NURSE" as const, label: "👩‍⚕️ Nurse", color: "text-purple-600" },
  { value: "ADMIN" as const, label: "⚙️ Administrator", color: "text-red-600" },
] as const;

export const CreateUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  restrictToPatient = false,
  createdBy = "ADMIN",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "PATIENT" as UserRole,
    specialization: "",
    licenseNumber: "",
    department: "",
    sendInviteEmail: true,
  });

  const availableRoles = restrictToPatient
    ? ROLE_OPTIONS.filter((r) => r.value === "PATIENT")
    : createdBy === "ADMIN"
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter((r) => r.value === "PATIENT");

  const isMedicalRole = formData.role === "DOCTOR" || formData.role === "NURSE";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone must be valid (e.g. +254712345678)");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await userService.adminCreateUser(formData);
      setSuccess(
        `✅ ${formData.role} account created! ${formData.sendInviteEmail ? "Invite email sent." : ""}`,
      );
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      phone: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "PATIENT" as UserRole,
      specialization: "",
      licenseNumber: "",
      department: "",
      sendInviteEmail: true,
    });
    setError("");
    setSuccess("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New User
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {restrictToPatient
                ? "Create a patient account and send them login credentials"
                : "Create an account for any role in the system"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {success && <Alert type="success" message={success} />}

          {/* Role Selection */}
          {!restrictToPatient && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableRoles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: r.value as UserRole,
                      }))
                    }
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                      formData.role === r.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+254712345678"
                className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 8 characters"
                className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              User can change this after logging in
            </p>
          </div>

          {/* Medical professional fields */}
          {isMedicalRole && (
            <div className="space-y-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
              <h4 className="font-bold text-teal-800 dark:text-teal-300 text-sm">
                Professional Information
              </h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Specialization
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  License Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Medical license number"
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Emergency"
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Send Invite Email */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              name="sendInviteEmail"
              checked={formData.sendInviteEmail}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                Send invite email
              </p>
              <p className="text-xs text-gray-500">
                User will receive login credentials and verification link
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Create{" "}
              {formData.role === "PATIENT"
                ? "Patient"
                : formData.role === "DOCTOR"
                  ? "Doctor"
                  : formData.role}{" "}
              Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
