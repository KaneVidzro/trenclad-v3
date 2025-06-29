import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mailer";
import { PasswordResetSuccessEmail } from "@/components/email/PasswordResetSuccessEmail";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { token },
  });
  if (!resetToken) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }
  const identifier = resetToken.identifier;
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { email: identifier },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.delete({
      where: { identifier_token: { identifier, token } },
    }),
  ]);

  // Send password reset success email
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`;
  await sendMail({
    to: identifier,
    subject: "Your password was changed",
    react: PasswordResetSuccessEmail({ loginUrl }),
  });

  return NextResponse.json({ message: "Password reset successful" });
}
