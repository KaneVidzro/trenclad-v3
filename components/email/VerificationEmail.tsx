import * as React from "react";
import { Tailwind, Button } from "@react-email/components";

export interface VerificationEmailProps {
  verificationUrl: string;
}
/**
 * VerificationEmail component renders an email template for verifying a user's email address.
 * It includes a verification button and some basic information about the TrenClad service.
 *
 * @param {VerificationEmailProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered email template.
 */
export function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
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

        <h2 className="text-2xl font-semibold mb-4">
          Verify your email address
        </h2>

        <p className="mb-4 text-base leading-6">
          Hi there,
          <br />
          Thank you for signing up for TrenClad! Please verify your email
          address to activate your account.
        </p>

        <Button
          href={verificationUrl}
          className="bg-blue-600 text-white px-5 py-3 rounded-md text-sm font-medium no-underline"
        >
          Verify Email
        </Button>

        <p className="mt-4 text-sm text-gray-600">
          If you did not create an account, you can safely ignore this email.
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
