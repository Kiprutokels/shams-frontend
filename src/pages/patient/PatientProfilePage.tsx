import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { userService } from '@services/api/user.service';
import type { User } from '@types';
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Droplet,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      const data = response.data ?? user;
      setProfile(data);
      setFormData({
        firstName: data?.firstName ?? '',
        lastName: data?.lastName ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        dateOfBirth: data?.dateOfBirth ?? '',
        gender: data?.gender ?? '',
        address: data?.address ?? '',
        bloodType: data?.bloodType ?? '',
        allergies: data?.allergies ?? '',
        medicalHistory: data?.medicalHistory ?? '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setProfile(user ?? null);
      setFormData({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        dateOfBirth: '',
        gender: '',
        address: '',
        bloodType: '',
        allergies: '',
        medicalHistory: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await userService.updateProfile(user.id, formData);
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      dateOfBirth: profile?.dateOfBirth ?? '',
      gender: profile?.gender ?? '',
      address: profile?.address ?? '',
      bloodType: profile?.bloodType ?? '',
      allergies: profile?.allergies ?? '',
      medicalHistory: profile?.medicalHistory ?? '',
    });
    setEditing(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your personal information
          </p>
        </div>
        {!editing ? (
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => setEditing(true)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-neutral text-neutral"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-primary hover:opacity-90"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-6 border-l-4 border-l-primary">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
              <span className="text-4xl font-bold text-primary">
                {profile?.firstName?.charAt(0)}
                {profile?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="mt-4 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-secondary font-semibold">Patient</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Your address"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary placeholder-neutral"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <Droplet className="w-4 h-4 inline mr-1" />
                Blood Type
              </label>
              <input
                type="text"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g., O+"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary placeholder-neutral"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!editing}
                placeholder="List any allergies"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary placeholder-neutral"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Medical History
              </label>
              <textarea
                rows={4}
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Relevant medical history"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-neutral-bg dark:disabled:bg-gray-900 focus:outline-none focus:border-primary placeholder-neutral"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
