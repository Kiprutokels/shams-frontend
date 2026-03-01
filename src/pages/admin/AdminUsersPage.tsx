import React, { useEffect, useState } from "react";
import { Card } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { CreateUserModal } from "@components/modals/CreateUserModal";
import { userService } from "@services/api/user.service";
import { UserRole, type User } from "@types";
import {
  Users,
  Search,
  Mail,
  Phone,
  UserCheck,
  UserX,
  UserPlus,
  Shield,
  Stethoscope,
  User as UserIcon,
  Activity,
} from "lucide-react";

const ROLE_CONFIG: Record<
  string,
  { bg: string; text: string; icon: React.ElementType; label: string }
> = {
  ADMIN: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
    icon: Shield,
    label: "Admin",
  },
  DOCTOR: {
    bg: "bg-teal-100 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
    icon: Stethoscope,
    label: "Doctor",
  },
  PATIENT: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    icon: UserIcon,
    label: "Patient",
  },
  NURSE: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    icon: Activity,
    label: "Nurse",
  },
};

export const AdminUsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(roleFilter || undefined);
      setUsers(response.data ?? []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return !searchTerm || name.includes(term) || email.includes(term);
  });

  const handleToggleActive = async (user: User) => {
    if (
      !window.confirm(
        `${user.isActive ? "Deactivate" : "Activate"} ${user.firstName} ${user.lastName}?`,
      )
    )
      return;
    try {
      await userService.updateProfile(user.id, { isActive: !user.isActive });
      loadUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const statsCards = [
    {
      label: "Total Users",
      value: users.length,
      color: "border-l-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      label: "Patients",
      value: users.filter((u) => u.role === "PATIENT").length,
      color: "border-l-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      icon: UserIcon,
      iconColor: "text-teal-500",
    },
    {
      label: "Doctors",
      value: users.filter((u) => u.role === "DOCTOR").length,
      color: "border-l-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: Stethoscope,
      iconColor: "text-purple-500",
    },
    {
      label: "Active",
      value: users.filter((u) => u.isActive).length,
      color: "border-l-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: UserCheck,
      iconColor: "text-green-500",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Create and manage all system users
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${s.bg} rounded-lg`}>
                <s.icon className={`w-6 h-6 ${s.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </div>
                <div className="text-xs text-neutral font-semibold">
                  {s.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6 border-l-4 border-l-blue-600">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["", "PATIENT", "DOCTOR", "NURSE", "ADMIN"].map((role) => (
              <button
                key={role || "all"}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  roleFilter === role
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {role || "All Roles"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card
        title={`Users (${filteredUsers.length})`}
        className="border-l-4 border-l-blue-600"
      >
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400 mb-4">
              No users found
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" /> Create First User
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {["User", "Contact", "Role", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white text-sm"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.PATIENT;
                  const RoleIcon = roleCfg.icon;
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${roleCfg.bg} flex items-center justify-center`}
                          >
                            <span
                              className={`font-bold text-sm ${roleCfg.text}`}
                            >
                              {user.firstName?.charAt(0)}
                              {user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-neutral">
                              ID: #{user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-sm text-neutral flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-neutral flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.specialization && (
                            <div className="text-xs text-teal-600 dark:text-teal-400">
                              {user.specialization}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleCfg.bg} ${roleCfg.text}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              user.isActive
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {user.isActive ? "● Active" : "○ Inactive"}
                          </span>
                          <div
                            className={`text-xs ${user.isVerified ? "text-green-600" : "text-amber-600"}`}
                          >
                            {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.isActive
                              ? "border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "border-green-400 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }
                          onClick={() => handleToggleActive(user)}
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadUsers();
        }}
        createdBy={UserRole.ADMIN} // instead of "ADMIN"
      />
    </div>
  );
};
