"use client";

import { Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import SignupCard from "@/components/Auth/Signup/SignupCard"; // Ensure this path and export are correct

const { Title, Text } = Typography;

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <UserAddOutlined className="text-2xl text-white" />
            </div>
          </div>
          <Title level={2} className="mb-2" style={{ color: "#f3f3f3" }}>
            Join LPX Collect
          </Title>
          <Text
            type="secondary"
            className="text-lg"
            style={{ color: "#f3f3f3" }}
          >
            Create your account and start your collection journey
          </Text>
        </div>
        {/* Signup Card */}
        {SignupCard && <SignupCard />} {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <Text
            type="secondary"
            className="text-xs text-white"
            style={{ color: "#f3f3f3" }}
          >
            By creating an account, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
}
