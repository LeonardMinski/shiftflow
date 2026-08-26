import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">ShiftFlow</h1>

        <p className="mt-4 text-lg text-gray-600">
          Employee scheduling without spreadsheet chaos.
        </p>

        <div>
          <Link href="/employees">Employees Page</Link>
        </div>
        <div>
          <Link href="/availability">Employee Availability Page</Link>
        </div>
        <div>
          <Link href="/shifts">Employee Shifts Page</Link>
        </div>
        <div>
          <Link href="/rota">Employee Rota Page</Link>
        </div>
      </section>
    </main>
  );
}
