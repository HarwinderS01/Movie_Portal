import './globals.css';


export const metadata = {
  title: 'IMR Movie Portal',
  description: 'Manage movies with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
