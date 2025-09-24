"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/UI/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { Button } from "@/components/UI/button";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //   const { login, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginUserSection] = useLoginMutation();
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     if (isSignedIn) {
  //       const redirectUrl = searchParams.get("redirect_url");
  //       router.push(redirectUrl ? decodeURIComponent(redirectUrl) : "/dashboard");
  //     }
  //   }, [isSignedIn, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = {
        email: email,
        password: password,
        fcmToken: "The new Auth FMC token",
      };
      const res = await loginUserSection(data);
      console.log(res);
      const { user } = res?.data?.data?.attributes;
      const { token } = res?.data?.data?.attributes?.tokens?.access;
      if (res) {
        dispatch(setUser({ user, token }));
        router.replace("/browse");
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail("test@gmail.com");
    setPassword("password");
  };

  const fillVendorCredentials = () => {
    setEmail("vendor@gmail.com");
    setPassword("password");
  };

  const fillAdminCredentials = () => {
    setEmail("admin@gmail.com");
    setPassword("password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your LPX Collect account
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo credentials buttons
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground text-center"></p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestCredentials}
                  className="flex-1"
                >
                  Customer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillVendorCredentials}
                  className="flex-1"
                >
                  Vendor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillAdminCredentials}
                  className="flex-1"
                >
                  Admin
                </Button>
              </div>
            </div> */}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don{`'`}t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
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
      <SignInForm />
    </Suspense>
  );
}
