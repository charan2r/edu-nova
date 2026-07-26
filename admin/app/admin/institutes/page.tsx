"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { instituteApi } from "@/lib/api-client";
import { Plus, Edit2, Trash2, RefreshCw, AlertCircle } from "lucide-react";

interface Institute {
  _id: string;
  name: string;
  email: string;
  website?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInstitutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instituteApi.getAll();
      setInstitutes(res.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load institutes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this institute? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await instituteApi.delete(id);
      setInstitutes((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      alert(err.message ?? "Failed to delete institute");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Institute Name",
      render: (value: string, row: Institute) => (
        <Link
          href={`/admin/institutes/${row._id}`}
          className="font-medium text-primary hover:underline"
        >
          {value}
        </Link>
      ),
    },
    { key: "email", label: "Email" },
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
      key: "createdAt",
      label: "Created",
      render: (v: string) =>
        v ? new Date(v).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Institute) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/institutes/${row._id}/edit`}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Edit2 size={16} className="text-muted-foreground" />
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
            disabled={deletingId === row._id}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} className="text-destructive" />
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
          <h1 className="text-3xl font-bold text-foreground">Institutes</h1>
          <p className="text-muted-foreground mt-1">Manage all educational institutes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInstitutes}
            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-muted-foreground" />
          </button>
          <Link
            href="/admin/institutes/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            <span>Add Institute</span>
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchInstitutes} className="ml-auto text-sm underline">
            Retry
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={institutes.map((inst) => ({ ...inst, actions: null }))}
        loading={loading}
        searchPlaceholder="Search institutes..."
        rowsPerPage={10}
      />
    </div>
  );
}
