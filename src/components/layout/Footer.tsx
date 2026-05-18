import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row">
        <p>Copyright &copy; {currentYear} 邃思</p>

        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="transition-colors hover:text-foreground"
          >
            RSS
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
