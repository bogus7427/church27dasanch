import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = { title: "회원가입 | 다산교회 " };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
