"use client";

export default function PageBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-bg">
      {children}

      <style jsx>{`
        .page-bg {
          min-height: 100vh;
          background-color: black;

          background-image: radial-gradient(
            rgba(255, 122, 24, 0.18) 1px,
            transparent 1px
          );

          background-size: 24px 24px;
          background-position: center;
          color: white;
        }
      `}</style>
    </div>
  );
}
