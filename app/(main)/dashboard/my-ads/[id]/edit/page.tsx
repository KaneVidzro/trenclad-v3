import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditAdForm from "@/components/main/EditAdForm";

export default async function EditAdPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  const ad = await prisma.ad.findUnique({ where: { id: params.id } });
  if (!ad) return notFound();
  if (!user || ad.userId !== user.id) redirect("/dashboard/my-ads");

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>
      <EditAdForm ad={ad} />
    </div>
  );
}
