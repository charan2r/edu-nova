"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { userApi } from "@/lib/api-client";
import { UserCircle2, Edit2, Trash2, ToggleLeft, ToggleRight, RefreshCw, AlertCircle } from "lucide-react";

type UserRole = "student" | "instructor" | "admin";

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: UserRole;
  institute?: { name: string };
  isActive: boolean;
  createdAt: string;
}

const roleStyles: Record<UserRole, string> = {
  student: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  instructor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  admin: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"all" | UserRole>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAll();
      setUsers(res.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (user: User) => {
    setTogglingId(user._id);
    try {
      const res = await userApi.toggleStatus(user._id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: res.data.isActive } : u
        )
      );
    } catch (err: any) {
      alert(err.message ?? "Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  const counts = {
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    instructor: users.filter((u) => u.role === "instructor").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  const columns = [
    {
      key: "fullname",
      label: "Name",
      render: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <UserCircle2 size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{value || "—"}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: UserRole) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${roleStyles[value]}`}>
          {value}
        </span>
      ),
    },
    {
      key: "institute",
      label: "Institute",
      render: (_: any, row: User) => row.institute?.name ?? "—",
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (v: string) =>
        v ? new Date(v).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleToggle(row); }}
            disabled={togglingId === row._id}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
            title={row.isActive ? "Deactivate user" : "Activate user"}
          >
            {row.isActive ? (
              <ToggleRight size={18} className="text-green-600" />
            ) : (
              <ToggleLeft size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchUsers} className="ml-auto text-sm underline">
            Retry
          </button>
        </div>
      )}

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "student", "instructor", "admin"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filterRole === role
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {role === "all" ? "All Users" : role + "s"}{" "}
            <span className="ml-1 opacity-70">({counts[role]})</span>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers.map((u) => ({ ...u, actions: null }))}
        loading={loading}
        searchPlaceholder="Search users by name or email..."
        rowsPerPage={10}
      />
    </div>
  );
}
