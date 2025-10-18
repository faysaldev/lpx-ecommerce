"use client";

import { Typography } from "antd";
import SignupCard from "@/components/Auth/Signup/SignupCard"; // Ensure this path and export are correct

const { Text } = Typography;

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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
