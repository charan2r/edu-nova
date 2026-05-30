"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";

interface InstituteAdmin {
  id: string;
  fullname: string;
  email: string;
  institute: string;
  createdAt: string;
  isActive: boolean;
}

export default function InstituteAdminsPage() {
  const [admins, setAdmins] = useState<InstituteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInstituteAdmins();
  }, []);

  const fetchInstituteAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/institute`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch institute admins");

      const data = await response.json();
      setAdmins(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/institute-admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete admin");

      setAdmins(admins.filter((admin) => admin.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit admin:", id);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "fullname",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Institute",
      accessorKey: "institute",
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            title="Edit"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
            title="Delete"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Institute Admins
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all institute administrators
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading institute admins...</p>
          </div>
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">No institute admins found</p>
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition inline-flex items-center gap-2">
            <Plus size={18} />
            Create First Admin
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.header}
                      className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="px-6 py-4">{admin.fullname}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">{admin.institute || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(admin.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
