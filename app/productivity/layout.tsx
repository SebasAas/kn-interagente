export default function ProductivityLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section className="px-8">{children}</section>;
}
