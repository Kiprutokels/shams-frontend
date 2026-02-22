import React, { useEffect, useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { userService } from '@services/api/user.service';
import type { User } from '@types';
import {
  Users,
  Search,
  Mail,
  Phone,
  UserCheck,
  UserX,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(roleFilter || undefined);
      setUsers(response.data ?? []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = (u.email ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return !searchTerm || name.includes(term) || email.includes(term);
  });

  const handleToggleActive = async (user: User) => {
    try {
      await userService.updateProfile(user.id, { isActive: !user.isActive });
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage system users and permissions
          </p>
        </div>
      </div>

      <Card className="mb-6 border-l-4 border-l-navy">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['', 'PATIENT', 'DOCTOR', 'ADMIN', 'NURSE'].map((role) => (
              <button
                key={role || 'all'}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  roleFilter === role
                    ? 'bg-navy text-white'
                    : 'bg-neutral-bg dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {role || 'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title={`Users (${filteredUsers.length})`} className="border-l-4 border-l-navy">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Role
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-neutral-bg dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
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
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-navy/20 text-navy'
                            : user.role === 'DOCTOR'
                            ? 'bg-primary/20 text-primary'
                            : user.role === 'PATIENT'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-neutral/20 text-neutral'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isActive
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-warmRed/20 text-warmRed'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          user.isActive
                            ? 'border-accent text-accent hover:bg-accent/10'
                            : 'border-secondary text-secondary hover:bg-secondary/10'
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
