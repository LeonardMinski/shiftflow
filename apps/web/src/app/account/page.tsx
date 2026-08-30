import Link from "next/link";
import { ShieldCheck, UserCircle } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
      <section className="max-w-4xl">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full border border-[#c6cbc2] bg-white text-[#52642b]">
            <UserCircle className="size-7" aria-hidden />
          </span>
          <div>
            <p className="text-sm text-[#52642b]">Profile</p>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Account
            </h1>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#3f433c]">
          Placeholder account page for ShiftFlow Ops. This page will show user
          profile details, role permissions, office access, and authentication
          settings.
        </p>

        <div className="mt-10 border border-[#c6cbc2] bg-white p-6">
          <ShieldCheck className="size-7 text-[#52642b]" aria-hidden />
          <h2 className="mt-6 text-xl font-bold tracking-[-0.02em]">
            Account Details
          </h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#52642b]">Name</dt>
              <dd className="mt-1 text-[#3f433c]">Placeholder user</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#52642b]">Role</dt>
              <dd className="mt-1 text-[#3f433c]">Manager</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#52642b]">Office</dt>
              <dd className="mt-1 text-[#3f433c]">New York Office</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#52642b]">Status</dt>
              <dd className="mt-1 text-[#3f433c]">Placeholder account data</dd>
            </div>
          </dl>
        </div>

        <Link
          href="/employees"
          className="mt-10 inline-flex h-11 items-center justify-center border border-[#c6cbc2] bg-white px-5 text-sm font-semibold text-[#092514] transition hover:border-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
        >
          View Staff Directory
        </Link>
      </section>
    </main>
  );
}
