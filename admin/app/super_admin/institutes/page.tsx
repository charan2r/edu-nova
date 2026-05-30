"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Institute {
  id: string;
  name: string;
  location: string;
  founded: number;
  students: number;
  courses: number;
  status: "active" | "inactive";
}

const mockInstitutes: Institute[] = [
  {
    id: "1",
    name: "Tech Institute of Excellence",
    location: "New York",
    founded: 2010,
    students: 250,
    courses: 15,
    status: "active",
  },
  {
    id: "2",
    name: "Global Business Academy",
    location: "London",
    founded: 2008,
    students: 180,
    courses: 12,
    status: "active",
  },
  {
    id: "3",
    name: "Science and Engineering Hub",
    location: "Singapore",
    founded: 2012,
    students: 320,
    courses: 18,
    status: "active",
  },
  {
    id: "4",
    name: "Creative Arts Institute",
    location: "Paris",
    founded: 2015,
    students: 140,
    courses: 8,
    status: "active",
  },
  {
    id: "5",
    name: "Modern Medical College",
    location: "Toronto",
    founded: 2009,
    students: 200,
    courses: 10,
    status: "inactive",
  },
];

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>(mockInstitutes);

  const columns = [
    {
      key: "name",
      label: "Institute Name",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "founded",
      label: "Founded",
    },
    {
      key: "students",
      label: "Students",
    },
    {
      key: "courses",
      label: "Courses",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 size={16} className="text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Trash2 size={16} className="text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institutes</h1>
          <p className="text-muted-foreground mt-1">
            Manage all educational institutes
          </p>
        </div>
        <Link
          href="/super_admin/institutes/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          <span>Add Institute</span>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={institutes.map((inst) => ({
          ...inst,
          actions: null,
        }))}
        searchPlaceholder="Search institutes..."
        rowsPerPage={10}
      />
    </div>
  );
}
