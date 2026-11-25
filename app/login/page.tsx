import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = { title: "로그인 | 다산교회" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
