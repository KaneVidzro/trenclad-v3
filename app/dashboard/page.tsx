import { requireUser } from "@/lib/auth";

export default async function Page() {
  const user = await requireUser(); // Will redirect to /login if not signed in

  return (
    <div>
      Name: {user.name}
      UserID: {user.id}
      Username: {user.username}
      Email: {user.email}
      Created At: {user.createdAt.toString()}
    </div>
  );
}
