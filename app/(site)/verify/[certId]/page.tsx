import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { appUrl } from "@/lib/env";

export const metadata: Metadata = { title: "Verify certificate", robots: { index: false } };

interface VerifyResult {
  valid: boolean;
  name?: string;
  role?: string;
  issuedOn?: string;
}

async function verify(certId: string): Promise<VerifyResult> {
  try {
    const res = await fetch(`${appUrl}/api/verify/${encodeURIComponent(certId)}`, {
      cache: "no-store",
    });
    const body = await res.json();
    return body?.data ?? { valid: false };
  } catch {
    return { valid: false };
  }
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const result = await verify(certId);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 text-center">
        {result.valid ? (
          <>
            <div className="w-14 h-14 rounded-full bg-[#D4E6F4] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={26} className="text-[#1F6BA0]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Certificate verified</h1>
            <p className="text-sm text-gray-500 mb-6">
              This is a genuine YEEP Somalia certificate.
            </p>
            <dl className="text-left text-sm space-y-2 bg-[#f8fafc] rounded-lg p-4">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-400">Name</dt>
                <dd className="font-semibold text-gray-800">{result.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-400">Role</dt>
                <dd className="font-semibold text-gray-800">{result.role}</dd>
              </div>
              {result.issuedOn && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">Issued</dt>
                  <dd className="font-semibold text-gray-800">
                    {new Date(result.issuedOn).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-gray-400">Certificate ID</dt>
                <dd className="font-mono text-xs text-gray-600">{certId.toUpperCase()}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <XCircle size={26} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Not recognised</h1>
            <p className="text-sm text-gray-500">
              We couldn&apos;t match <span className="font-mono">{certId}</span> to any YEEP
              Somalia certificate.
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block mt-6 text-sm text-[#2D8FCE] font-semibold hover:underline"
        >
          yeep.org.so
        </Link>
      </div>
    </div>
  );
}
