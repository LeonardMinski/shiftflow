import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 py-12">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "var(--primary)",
            colorBackground: "var(--card)",
            colorForeground: "var(--foreground)",
            colorInput: "var(--background)",
            colorInputForeground: "var(--foreground)",
            borderRadius: "var(--radius-lg)",
          },
          elements: {
            card: "shadow-none border border-border",
          },
        }}
      />
    </main>
  );
}
