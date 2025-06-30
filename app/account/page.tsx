import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded space-y-8">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg">{user.name || "-"}</div>
          <div className="text-gray-600">{user.email}</div>
        </div>
      </div>

      {/* Edit Profile */}
      <section>
        <h2 className="font-semibold mb-2">Edit Profile</h2>
        <form
          action="/api/account/edit-profile"
          method="POST"
          className="space-y-3"
        >
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>Name</Label>
            <Input type="text" name="name" defaultValue={user.name || ""} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>Profile Image</Label>
            <Input type="file" name="image" />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </form>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="font-semibold mb-2">Change Password</h2>
        <form
          action="/api/account/change-password"
          method="POST"
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>Current Password</Label>
            <Input type="password" name="currentPassword" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>New Password</Label>
            <Input type="password" name="newPassword" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>Confirm New Password</Label>
            <Input type="password" name="confirmPassword" />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Change Password
          </Button>
        </form>
      </section>

      {/* Sign Out */}
      <form action="/api/auth/signout" method="POST">
        <Button variant="destructive" type="submit" className="w-full">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
