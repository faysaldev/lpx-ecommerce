/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Divider } from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import usePublicAxiosSecure from "@/hooks/useAxiosPublic";
import { useRouter } from "next/navigation";
import axios from "axios";

const { Text } = Typography;
const { Password } = Input;
function SignupCard() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const axiosPublic = usePublicAxiosSecure();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log(values, "console. value");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/auth/register`,
        {
          email: values.email,
          password: values.password,
          name: `${values.firstName}`,
          phoneNumber: values.phone,
          role: "user",
          type: "customer",
        }
      );
      if (!res.data) return;
      setSuccess(
        "Account created successfully! Redirecting to email verification..."
      );
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(values.email)}`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your password"));
    }
    if (value.length < 6) {
      return Promise.reject(
        new Error("Password must be at least 6 characters")
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  });

  const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!value) {
      return Promise.reject(new Error("Please enter your phone number"));
    }
    if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }
    return Promise.resolve();
  };

  return (
    <Card
      className="shadow-xl border-0 rounded-2xl"
      bodyStyle={{ padding: "32px" }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        disabled={loading}
      >
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last name" />
          </Form.Item>
        </div>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="your.email@example.com"
            type="email"
          />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ validator: validatePhone }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ validator: validatePassword }]}
        >
          <Password
            prefix={<LockOutlined />}
            placeholder="At least 6 characters"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[validateConfirmPassword]}
        >
          <Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
          />
        </Form.Item>

        {/* Error/Success Messages */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mb-4"
          />
        )}

        {success && (
          <Alert message={success} type="success" showIcon className="mb-4" />
        )}

        {/* Submit Button */}
        <Form.Item className="mb-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
            icon={loading ? <LoadingOutlined /> : <UserAddOutlined />}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form.Item>

        {/* Divider */}
        <Divider>
          <Text type="secondary" className="text-sm">
            Already have an account?
          </Text>
        </Divider>

        {/* Sign In Link */}
        <div className="text-center">
          <Link href="/sign-in">
            <Button type="link" className="text-indigo-600 font-medium">
              Sign in to your account
            </Button>
          </Link>
        </div>
      </Form>
    </Card>
  );
}

export default SignupCard;
