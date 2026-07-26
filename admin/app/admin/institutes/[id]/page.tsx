"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { instituteApi } from "@/lib/api-client";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  Users,
  BookOpen,
  Mail,
  Phone,
  Globe,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Instructor {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Institute {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function InstituteDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [assignedInstructors, setAssignedInstructors] = useState<Instructor[]>([]);
  const [unassignedInstructors, setUnassignedInstructors] = useState<Instructor[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchInstitute = useCallback(async () => {
    setLoadingInstitute(true);
    try {
      const res = await instituteApi.getById(id);
      setInstitute(res.data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load institute");
    } finally {
      setLoadingInstitute(false);
    }
  }, [id]);

  const fetchInstructors = useCallback(async () => {
    setLoadingInstructors(true);
    try {
      const [assignedRes, unassignedRes] = await Promise.all([
        instituteApi.getInstructors(id),
        instituteApi.getUnassignedInstructors(),
      ]);
      setAssignedInstructors(assignedRes.data ?? []);
      setUnassignedInstructors(unassignedRes.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load instructors");
    } finally {
      setLoadingInstructors(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInstitute();
    fetchInstructors();
  }, [fetchInstitute, fetchInstructors]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleAssign = async () => {
    if (!selectedInstructorId) return;
    setAssigning(true);
    setError(null);
    try {
      const res = await instituteApi.assignInstructor(id, selectedInstructorId);
      showSuccess(
        `Instructor assigned! ${res.cascaded.studentsUpdated} student(s) also linked to this institute.`
      );
      setSelectedInstructorId("");
      await fetchInstructors();
    } catch (err: any) {
      setError(err.message ?? "Failed to assign instructor");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (instructorId: string) => {
    if (!confirm("Remove this instructor from the institute? Their courses will be unlinked.")) return;
    setRemovingId(instructorId);
    setError(null);
    try {
      await instituteApi.unassignInstructor(instructorId);
      showSuccess("Instructor removed from institute");
      await fetchInstructors();
    } catch (err: any) {
      setError(err.message ?? "Failed to remove instructor");
    } finally {
      setRemovingId(null);
    }
  };

  if (loadingInstitute) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="text-center text-muted-foreground py-16">
        Institute not found.{" "}
        <Link href="/admin/institutes" className="underline text-primary">Go back</Link>
      </div>
    );
  }

  const addressParts = [
    institute.address?.street,
    institute.address?.city,
    institute.address?.state,
    institute.address?.country,
    institute.address?.zipCode,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/institutes"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{institute.name}</h1>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                institute.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {institute.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {institute.description && (
            <p className="text-muted-foreground mt-1">{institute.description}</p>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-lg leading-none">×</button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          <CheckCircle2 size={18} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Info + Stats */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={16} className="shrink-0" />
                <span>{institute.email}</span>
              </div>
              {institute.phone && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={16} className="shrink-0" />
                  <span>{institute.phone}</span>
                </div>
              )}
              {institute.website && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe size={16} className="shrink-0" />
                  <a href={institute.website} target="_blank" rel="noreferrer" className="text-primary underline truncate">
                    {institute.website}
                  </a>
                </div>
              )}
              {addressParts.length > 0 && (
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <span>{addressParts.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2">
                <Users size={20} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{assignedInstructors.length}</p>
              <p className="text-xs text-muted-foreground">Instructors</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2">
                <BookOpen size={20} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
          </div>
        </div>

        {/* Right — Instructor Management */}
        <div className="lg:col-span-2 space-y-4">
          {/* Assign Panel */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              <UserPlus size={20} className="text-primary" />
              Assign Instructor
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Assigning an instructor will automatically link all their existing courses and enrolled students to this institute.
            </p>
            {loadingInstructors ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading...
              </div>
            ) : unassignedInstructors.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No unassigned instructors available.
              </p>
            ) : (
              <div className="flex gap-3">
                <select
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an instructor...</option>
                  {unassignedInstructors.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.fullname} — {inst.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedInstructorId || assigning}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {assigning ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Assign
                </button>
              </div>
            )}
          </div>

          {/* Current Instructors */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Current Instructors
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {assignedInstructors.length} total
              </span>
            </h2>

            {loadingInstructors ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : assignedInstructors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No instructors assigned yet.</p>
                <p className="text-xs mt-1">Use the form above to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignedInstructors.map((instructor) => (
                  <div
                    key={instructor._id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        {instructor.fullname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{instructor.fullname}</p>
                      <p className="text-xs text-muted-foreground truncate">{instructor.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      Since {new Date(instructor.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => handleRemove(instructor._id)}
                      disabled={removingId === instructor._id}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove from institute"
                    >
                      {removingId === instructor._id
                        ? <Loader2 size={16} className="animate-spin text-destructive" />
                        : <UserMinus size={16} className="text-destructive" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
