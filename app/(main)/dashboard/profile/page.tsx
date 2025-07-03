import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ProfilePage() {
  const user = await getUser();
  const profile = await prisma.profile.findUnique({
    where: { userId: user?.id },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Profile</h1>
      <form
        action="/api/account/edit-profile"
        method="POST"
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <Label>Name</Label>
          <Input type="text" name="name" defaultValue={user?.name || ""} />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            defaultValue={user?.email || ""}
            disabled
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            type="text"
            name="phoneNumber"
            defaultValue={profile?.phoneNumber || ""}
          />
        </div>
        <div>
          <Label>Region</Label>
          <Input
            type="text"
            name="region"
            defaultValue={profile?.region || ""}
          />
        </div>
        <div>
          <Label>City</Label>
          <Input type="text" name="city" defaultValue={profile?.city || ""} />
        </div>
        <div>
          <Label>Profile Image</Label>
          <Input type="file" name="image" />
        </div>
        <div>
          <Label>Bio</Label>
          <Input type="text" name="bio" defaultValue={profile?.bio || ""} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
