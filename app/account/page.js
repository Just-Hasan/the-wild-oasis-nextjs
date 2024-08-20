import { auth } from "@/app/_lib/auth";
export const metadata = {
  title: "Account",
};

export default async function Page() {
  const user = await auth();
  const firstName = user?.user?.name.split(" ")[0];
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}
