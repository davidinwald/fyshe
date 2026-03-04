export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-xl font-bold text-primary">
            fyshe
          </a>
          <nav className="flex items-center gap-4">
            <a href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
              Articles
            </a>
            <a href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
              Sign In
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Fyshe &mdash; Your fishing companion. Open source on GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
