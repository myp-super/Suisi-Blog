import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProjectForm } from "./EditProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return <EditProjectForm project={project} />;
}
