import './globals.css';

export const metadata = {
  title: 'Inventory Manager'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
