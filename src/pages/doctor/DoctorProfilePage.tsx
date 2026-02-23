import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Input } from '@components/common/Input/Input';
import { Loader } from '@components/common/Loader/Loader';
import { userService } from '@services/api/user.service';
import type { User, ApiResponse } from '@types';
import { User as UserIcon, Mail, Briefcase, Building2, FileCheck, Save } from 'lucide-react';
import { setUser } from '@store/slices/authSlice';

export const DoctorProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    licenseNumber: '',
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile() as ApiResponse<User>;
      const profile = response?.data;
      if (profile) {
        setFormData({
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
          specialization: profile.specialization ?? '',
          department: profile.department ?? '',
          licenseNumber: profile.licenseNumber ?? '',
        });
      } else if (user) {
        setFormData({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          specialization: (user as User).specialization ?? '',
          department: (user as User).department ?? '',
          licenseNumber: (user as User).licenseNumber ?? '',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (user) {
        setFormData({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          specialization: (user as User).specialization ?? '',
          department: (user as User).department ?? '',
          licenseNumber: (user as User).licenseNumber ?? '',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const response = await userService.updateProfile(user.id, formData) as ApiResponse<User>;
      const updated = response?.data;
      if (updated) {
        dispatch(setUser(updated));
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your professional information
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-primary text-primary"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={saving}
                className="bg-[#1565C0] hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:opacity-90"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <Card
        title="Professional Information"
        className="border-l-4 border-l-primary"
      >
        <div className="bg-neutral-bg dark:bg-gray-900 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<UserIcon className="w-4 h-4" />}
              fullWidth
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<UserIcon className="w-4 h-4" />}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<Mail className="w-4 h-4" />}
              fullWidth
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Medical Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Briefcase className="w-4 h-4" />}
                fullWidth
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Building2 className="w-4 h-4" />}
                fullWidth
              />
              <Input
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FileCheck className="w-4 h-4" />}
                fullWidth
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
