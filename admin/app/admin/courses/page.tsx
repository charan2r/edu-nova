"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { courseApi } from "@/lib/api-client";
import { BookOpen, Trash2, RefreshCw, AlertCircle } from "lucide-react";


interface Course {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  instructor?: { fullname: string; email: string };
  institute?: { name: string };
  students?: string[];
  createdAt: string;
}



export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getAll();
      setCourses(res.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await courseApi.delete(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.message ?? "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

 

  const columns = [
    {
      key: "name",
      label: "Course",
      render: (value: string, row: Course) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        </div>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (_: any, row: Course) => row.instructor?.fullname ?? "—",
    },
    {
      key: "institute",
      label: "Institute",
      render: (_: any, row: Course) => row.institute?.name ?? "—",
    },
    
    {
      key: "students",
      label: "Students",
      render: (_: any, row: Course) => (
        <span className="font-medium">{row.students?.length ?? 0}</span>
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
      render: (_: any, row: Course) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
          disabled={deletingId === row._id}
          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
          title="Delete course"
        >
          <Trash2 size={16} className="text-destructive" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage all platform courses</p>
        </div>
        <button
          onClick={fetchCourses}
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
          <button onClick={fetchCourses} className="ml-auto text-sm underline">
            Retry
          </button>
        </div>
      )}

     

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={courses.map((c) => ({ ...c, actions: null }))}
        loading={loading}
        searchPlaceholder="Search courses by name, instructor, or category..."
        rowsPerPage={10}
      />
    </div>
  );
}
