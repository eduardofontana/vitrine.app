import { requireProfile } from "@/lib/auth";
import { NewProjectForm } from "./new-project-form";

export default async function NewProjectPage() {
  await requireProfile();
  return <NewProjectForm />;
}
