"use client";

import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Alert, AlertDescription } from "@/components/UI/alert";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import {
  useForgetPasswordMutation,
  useResitPasswordMutation,
} from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgorPasswordMutations] = useForgetPasswordMutation();
  const [resetPasswordSection] = useResitPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!showPassword) {
        const response = await forgorPasswordMutations({ email }).unwrap();
        if (!response?.data) {
          setError(
            "No account found with this email address. Please check your email or create a new account."
          );
          return;
        } else {
          setShowPassword(true);
        }
      } else {
        const data = { email, password };
        const res = await resetPasswordSection(data);

        if (res?.data?.code != 200) {
          setError(
            "No account found with this email address. Please check your email or create a new account."
          );
        } else {
          router.replace("/auth/signin");
          toast.success("Password reset successful! Please sign in.");
        }
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              We{`'`}ll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {showPassword ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Type your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="password"
                    />
                  </div>
                </>
              ) : (
                <></>
                // <div className="space-y-2">
                //   <Label htmlFor="email">Email Address</Label>
                //   <Input
                //     id="email"
                //     type="email"
                //     placeholder="Enter your email address"
                //     value={email}
                //     onChange={(e) => setEmail(e.target.value)}
                //     required
                //     autoComplete="email"
                //   />
                // </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
              role="progressbar"
              aria-label="Loading"
            ></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
