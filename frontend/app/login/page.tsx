"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { saveAuth, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/appointments");
  }, [router]);

  const validate = () => {
    const errs: typeof errors = {};
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
      const res = await authService.login(form.email, form.password);
      saveAuth(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/appointments");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-900 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative">
          <span className="text-white font-bold text-xl">
            Clinic<span className="text-teal-300">Flow</span>
          </span>
        </div>
        <div className="relative">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Modern Healthcare
            <br />
            Scheduling Made
            <br />
            Simple
          </h2>
          <p className="text-teal-200 text-base leading-relaxed max-w-sm">
            Manage your clinic appointments efficiently. Secure, fast, and
            designed for modern healthcare providers.
          </p>
          <div className="mt-8 flex gap-6">
            {[
              ["100+", "Appointments"],
              ["98%", "Uptime"],
              ["24/7", "Support"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-white text-2xl font-bold">{num}</p>
                <p className="text-teal-300 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-teal-400 text-sm">
          © {new Date().getFullYear()} ClinicFlow. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                placeholder="••••••••"
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
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-teal-600 font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
