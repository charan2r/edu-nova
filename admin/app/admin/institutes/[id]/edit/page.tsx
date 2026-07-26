"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { instituteApi } from "@/lib/api-client";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export default function EditInstitutePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    address: { street: "", city: "", state: "", country: "", zipCode: "" },
  });

  const fetchInstitute = useCallback(async () => {
    try {
      const res = await instituteApi.getById(id);
      const inst = res.data;
      setFormData({
        name: inst.name ?? "",
        email: inst.email ?? "",
        phone: inst.phone ?? "",
        website: inst.website ?? "",
        description: inst.description ?? "",
        address: {
          street: inst.address?.street ?? "",
          city: inst.address?.city ?? "",
          state: inst.address?.state ?? "",
          country: inst.address?.country ?? "",
          zipCode: inst.address?.zipCode ?? "",
        },
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to load institute");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInstitute();
  }, [fetchInstitute]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await instituteApi.update(id, formData);
      setSuccess("Institute updated successfully!");
      setTimeout(() => router.push(`/admin/institutes/${id}`), 1500);
    } catch (err: any) {
      setError(err.message ?? "Failed to update institute");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/institutes/${id}`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Institute</h1>
          <p className="text-muted-foreground mt-1">Update institute information</p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          <CheckCircle2 size={18} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} disabled={saving} className={inputClass} placeholder="https://" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} disabled={saving} className={inputClass} />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Street</label>
                <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">State</label>
                <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} disabled={saving} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 font-medium"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/admin/institutes/${id}`}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
