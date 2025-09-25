/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import Link from "next/link";

// Import your custom components

import { Loader2, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Alert, AlertDescription } from "@/components/UI/alert";
import { Button } from "@/components/UI/button";

function SignupCard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [adduser] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        email: email,
        password: password,
        name: `${firstName}`,
        phoneNumber: phone,
        role: "user",
        type: "customer",
      };

      const res = await adduser(data);
      console.log("add user data show this section ", res);

      if (!res.data) {
        setError("Failed to create account. Please try again.");
        return;
      }

      setSuccess(
        "Account created successfully! Redirecting to email verification..."
      );

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                <span>{success}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Demo Mode:</strong> Account registration is simulated. After
            creating an account, you{`'`}ll be redirected to email verification.
            Use the demo verification codes on the verification page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignupCard;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { Form, Input, Button, Card, Alert, Typography, Divider } from "antd";
// import {
//   UserAddOutlined,
//   MailOutlined,
//   LockOutlined,
//   PhoneOutlined,
//   UserOutlined,
//   LoadingOutlined,
// } from "@ant-design/icons";
// import Link from "next/link";
// // import usePublicAxiosSecure from "@/hooks/useAxiosPublic";
// import { useRouter } from "next/navigation";
// // import axios from "axios";
// import { useRegisterMutation } from "@/redux/features/auth/authApi";

// const { Text } = Typography;
// const { Password } = Input;
// function SignupCard() {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const router = useRouter();
//   // const axiosPublic = usePublicAxiosSecure();

//   const [adduser] = useRegisterMutation();

//   const onFinish = async (values: any) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       console.log(values, "console. value");
//       const data = {
//         email: values.email,
//         password: values.password,
//         name: `${values.firstName}`,
//         phoneNumber: values.phone,
//         role: "user",
//         type: "customer",
//       };

//       const res = await adduser(data);
//       console.log("add user data show this section ", res);

//       if (!res.data) return;
//       setSuccess(
//         "Account created successfully! Redirecting to email verification..."
//       );
//       router.push(
//         `/auth/verify-email?email=${encodeURIComponent(values.email)}`
//       );
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validatePassword = (_: any, value: string) => {
//     if (!value) {
//       return Promise.reject(new Error("Please enter your password"));
//     }
//     if (value.length < 6) {
//       return Promise.reject(
//         new Error("Password must be at least 6 characters")
//       );
//     }
//     return Promise.resolve();
//   };

//   const validateConfirmPassword = ({ getFieldValue }: any) => ({
//     validator(_: any, value: string) {
//       if (!value || getFieldValue("password") === value) {
//         return Promise.resolve();
//       }
//       return Promise.reject(new Error("Passwords do not match"));
//     },
//   });

//   const validatePhone = (_: any, value: string) => {
//     const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
//     if (!value) {
//       return Promise.reject(new Error("Please enter your phone number"));
//     }
//     if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
//       return Promise.reject(new Error("Please enter a valid phone number"));
//     }
//     return Promise.resolve();
//   };

//   return (
//     <Card
//       className="shadow-xl border-0 rounded-2xl bg-[#252D3D]"
//       bodyStyle={{ padding: "32px" }}
//     >
//       <Form
//         form={form}
//         onFinish={onFinish}
//         layout="vertical"
//         size="large"
//         disabled={loading}
//       >
//         {/* Name Fields */}
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <Form.Item
//             name="firstName"
//             label="First Name"
//             rules={[
//               { required: true, message: "Please enter your first name" },
//             ]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="First name" />
//           </Form.Item>

//           <Form.Item
//             name="lastName"
//             label="Last Name"
//             rules={[{ required: true, message: "Please enter your last name" }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="Last name" />
//           </Form.Item>
//         </div>

//         {/* Email */}
//         <Form.Item
//           name="email"
//           label="Email Address"
//           rules={[
//             { required: true, message: "Please enter your email" },
//             { type: "email", message: "Please enter a valid email" },
//           ]}
//         >
//           <Input
//             prefix={<MailOutlined />}
//             placeholder="your.email@example.com"
//             type="email"
//           />
//         </Form.Item>

//         {/* Phone */}
//         <Form.Item
//           name="phone"
//           label="Phone Number"
//           rules={[{ validator: validatePhone }]}
//         >
//           <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
//         </Form.Item>

//         {/* Password */}
//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[{ validator: validatePassword }]}
//         >
//           <Password
//             prefix={<LockOutlined />}
//             placeholder="At least 6 characters"
//           />
//         </Form.Item>

//         {/* Confirm Password */}
//         <Form.Item
//           name="confirmPassword"
//           label="Confirm Password"
//           dependencies={["password"]}
//           rules={[validateConfirmPassword]}
//         >
//           <Password
//             prefix={<LockOutlined />}
//             placeholder="Confirm your password"
//           />
//         </Form.Item>

//         {/* Error/Success Messages */}
//         {error && (
//           <Alert
//             message={error}
//             type="error"
//             showIcon
//             closable
//             className="mb-4"
//           />
//         )}

//         {success && (
//           <Alert message={success} type="success" showIcon className="mb-4" />
//         )}

//         {/* Submit Button */}
//         <Form.Item className="mb-4">
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
//             icon={loading ? <LoadingOutlined /> : <UserAddOutlined />}
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </Button>
//         </Form.Item>

//         {/* Divider */}
//         <Divider>
//           <Text type="secondary" className="text-sm">
//             Already have an account?
//           </Text>
//         </Divider>

//         {/* Sign In Link */}
//         <div className="text-center">
//           <Link href="/auth/signin">
//             <Button type="link" className="text-indigo-600 font-medium">
//               Sign in to your account
//             </Button>
//           </Link>
//         </div>
//       </Form>
//     </Card>
//   );
// }

// export default SignupCard;
