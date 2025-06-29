import * as React from "react";
import { Tailwind, Button } from "@react-email/components";

export interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Tailwind>
      <div className="bg-[#f9f9f9] p-6 font-sans text-[#222]">
        {/* Inline Geist font for compatibility */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Geist&display=swap');
            * {
              font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
          `}
        </style>

        <h2 className="text-2xl font-semibold mb-4">Reset your password</h2>

        <p className="mb-4 text-base leading-6">
          Hi there,
          <br />
          We received a request to reset your password for your TrenClad
          account. Click the button below to set a new password.
        </p>

        <Button
          href={resetUrl}
          className="bg-blue-600 text-white px-5 py-3 rounded-md text-sm font-medium no-underline"
        >
          Reset Password
        </Button>

        <p className="mt-4 text-sm text-gray-600">
          If you did not request a password reset, you can safely ignore this
          email.
        </p>

        <p className="mt-6 text-sm text-gray-600">
          If the button above doesn&apos;t work, copy and paste this link into
          your browser:
          <br />
          <a href={resetUrl} className="text-blue-600 break-all">
            {resetUrl}
          </a>
        </p>

        <hr className="my-6 border-gray-300" />

        <p className="text-xs text-gray-400">
          TrenClad Inc. · 123 Business Rd · City, State ZIP
          <br />
          Need help?{" "}
          <a href="mailto:support@trenclad.com" className="text-blue-500">
            Contact us
          </a>
        </p>
      </div>
    </Tailwind>
  );
}
