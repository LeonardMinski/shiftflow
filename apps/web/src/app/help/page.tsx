import Link from "next/link";
import { CircleHelp, Mail, MessageSquareText } from "lucide-react";

export default function HelpPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
      <section className="max-w-4xl">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full border border-[#c6cbc2] bg-white text-[#52642b]">
            <CircleHelp className="size-6" aria-hidden />
          </span>
          <div>
            <p className="text-sm text-[#52642b]">Support</p>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Help Center
            </h1>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#3f433c]">
          Placeholder help content for ShiftFlow Ops. This page will hold setup
          notes, scheduling guidance, troubleshooting steps, and support
          contact details.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="border border-[#c6cbc2] bg-white p-6">
            <MessageSquareText
              className="size-7 text-[#52642b]"
              aria-hidden
            />
            <h2 className="mt-6 text-xl font-bold tracking-[-0.02em]">
              Common Questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#3f433c]">
              Placeholder answers for rota publishing, availability changes,
              employee records, and shift conflicts.
            </p>
          </article>

          <article className="border border-[#c6cbc2] bg-white p-6">
            <Mail className="size-7 text-[#52642b]" aria-hidden />
            <h2 className="mt-6 text-xl font-bold tracking-[-0.02em]">
              Contact Support
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#3f433c]">
              Placeholder support information for managers who need help with
              account access or scheduling workflows.
            </p>
          </article>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex h-11 items-center justify-center border border-[#c6cbc2] bg-white px-5 text-sm font-semibold text-[#092514] transition hover:border-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
