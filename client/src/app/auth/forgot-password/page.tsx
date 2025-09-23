"use client";

import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Alert, AlertDescription } from "@/components/UI/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/UI/input";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if email exists in our demo users
  const isValidDemoEmail = (email: string): boolean => {
    const demoEmails = [
      "test@gmail.com",
      "vendor@gmail.com",
      "admin@gmail.com",
    ];
    return demoEmails.includes(email.toLowerCase());
  };

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

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if email exists in our demo system
      if (!isValidDemoEmail(email)) {
        setError(
          "No account found with this email address. Please check your email or create a new account."
        );
        return;
      }

      // Simulate successful password reset email sending
      setSuccess(true);
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSuccess(false);
    setEmail("");
    setError("");
  };

  const fillDemoEmail = (demoEmail: string) => {
    setEmail(demoEmail);
    setError("");
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold tracking-tight">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mt-2">
              Password reset instructions sent
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Email Sent</CardTitle>
              <CardDescription className="text-center">
                We{`'`}ve sent password reset instructions to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> In a real application, a password
                  reset email would be sent to <strong>{email}</strong>. The
                  email would contain a secure link to reset your password.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Didn{`'`}t receive the email? Check your spam folder or try
                  again.
                </p>

                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Another Email
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="text-primary hover:underline"
                  >
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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

            {/* Demo email buttons */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Demo emails (click to fill):
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoEmail("test@gmail.com")}
                  className="w-full text-xs"
                >
                  test@gmail.com (Customer)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoEmail("vendor@gmail.com")}
                  className="w-full text-xs"
                >
                  vendor@gmail.com (Vendor)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoEmail("admin@gmail.com")}
                  className="w-full text-xs"
                >
                  admin@gmail.com (Admin)
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/sign-in"
                  className="text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don{`'`}t have an account?{" "}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Note:</strong> This is a demo. Password reset emails are
                simulated. Use the demo emails above to test the functionality.
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
