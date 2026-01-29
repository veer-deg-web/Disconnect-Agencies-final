export default function BookCallLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-br from-black to-[#1a1a1a]">
        {children}
      </section>
    );
  }
  