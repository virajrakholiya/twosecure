import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <SignIn />
    </div>
  );
}
