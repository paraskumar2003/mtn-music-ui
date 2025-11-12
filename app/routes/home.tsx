import type { Route } from "./+types/home";
import { redirect } from "react-router";

export function loader() {
  // You can add auth logic here if needed
  return redirect("/login");
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redirecting..." },
    { name: "description", content: "Redirecting to login page" },
  ];
}

export default function Home() {
  return null; // Won’t render because redirect happens before render
}
