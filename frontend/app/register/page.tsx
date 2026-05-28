"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { saveAuth, isAuthenticated } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/appointments");
  }, [router]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = "Full name is required (min 2 chars)";
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register(
        form.name,
        form.email,
        form.password,
      );
      saveAuth(res.token, res.user);
      toast.success(`Account created! Welcome, ${res.user.name}!`);
      router.push("/appointments");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create account
          </h1>
          <p className="text-slate-500">
            Join ClinicFlow to manage appointments
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Dr. Jane Smith"
                value={form.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? "border-red-400" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={form.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? "border-red-400" : ""}`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
