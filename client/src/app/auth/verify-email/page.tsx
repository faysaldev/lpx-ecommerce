/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from "@/components/UI/alert";
import { Button } from "@/components/UI/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/redux/features/auth/authApi";
import { ArrowLeft, CheckCircle, Loader2, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function VerifyEmailForm() {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [email, setEmail] = useState("");
  //   const { isSignedIn } = useAuth();
  const router = useRouter();
  const [verificationEmailCode] = useVerifyEmailMutation();
  const [resendVerification, { data, error, isLoading: resendLoading }] =
    useResendVerificationMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  // Extract email from URL params
  useEffect(() => {
    // const emailParam = searchParams.get("email");
    const email = searchParams ? searchParams.get("email") : null;

    if (email) {
      setEmail(decodeURIComponent(email));
    } else {
      // If no email provided, redirect to sign-up
      router.push("/sign-up");
    }
  }, [searchParams, router]);

  // Redirect if already signed in
  //   useEffect(() => {
  //     if (isSignedIn) {
  //       router.push("/dashboard");
  //     }
  //   }, [isSignedIn, router]);

  // Handle resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Check if the email belongs to a demo user
  const getDemoUserRole = (email: string): string | null => {
    const demoUsers: { [key: string]: string } = {
      "test@gmail.com": "customer",
      "vendor@gmail.com": "vendor",
      "admin@gmail.com": "admin",
    };
    return demoUsers[email.toLowerCase()] || null;
  };

  const handleCodeChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = verificationCode.split("");
    newCode[index] = digit;

    // Fill the array to 6 digits
    while (newCode.length < 6) {
      newCode.push("");
    }

    const updatedCode = newCode.join("").slice(0, 6);
    setVerificationCode(updatedCode);
    setError("");

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "Paste" || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setVerificationCode(pastedData.padEnd(6, ""));
    setError("");

    // Focus the first empty input or the last one
    const nextEmptyIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate code length
      if (verificationCode.length !== 6) {
        setError("Please enter a complete 6-digit verification code");
        return;
      }

      const data = {
        email: email,
        code: verificationCode,
      };
      console.log(data, "verfiy code");

      const res = await verificationEmailCode(data);
      if (res) router.replace("/auth/signin");
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError("");

    try {
      // Simulate API call delay
      const response = await resendVerification({ email }).unwrap();
      console.log(response, "resend email code"); // Log the response data
      // Show success message
      toast.success(
        "Verification email sent! Check your inbox (this is a demo)."
      );
    } catch (_err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const renderCodeInput = () => {
    // Generate stable keys for OTP inputs
    const otpInputKeys = Array.from({ length: 6 }, (_, i) => `otp-${i}`);

    return (
      <div className="flex gap-2 justify-center">
        {otpInputKeys.map((inputKey, index) => (
          <Input
            key={inputKey}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={verificationCode[index] || ""}
            onChange={(e) => handleCodeChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg font-semibold"
            autoComplete="one-time-code"
          />
        ))}
      </div>
    );
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold tracking-tight">
              Email Verified!
            </h1>
            <p className="text-muted-foreground mt-2">
              Your email has been successfully verified
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Success</CardTitle>
              <CardDescription className="text-center">
                Redirecting you to your dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Verification Complete:</strong> Your email {email} has
                  been verified. You will be redirected to your dashboard
                  shortly.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
          <h1 className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center">
              We sent a verification code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-center block">Verification Code</Label>
                {renderCodeInput()}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Enter the 6-digit code from your email
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{errors}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Email
                  </>
                )}
              </Button>
            </form>

            {/* Resend functionality */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn{`'`}t receive the code?
              </p>

              {resendCountdown > 0 ? (
                <Button variant="outline" disabled className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resend code in {resendCountdown}s
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend verification email
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Navigation links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* Demo mode notice */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo Mode:</strong> This is a demonstration of email
                verification. Use any of the demo codes above to test the
                verification process. In a real application, you would receive
                an actual verification code via email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
              role="progressbar"
              aria-label="Loading"
            />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
