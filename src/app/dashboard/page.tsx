import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E9F2] max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#1E2761] mb-4">Dashboard</h1>
        <p className="text-[#5A6478]">Welcome to Decyra, {user.email}</p>
      </div>
    </div>
  );
}
