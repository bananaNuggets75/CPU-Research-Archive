import './globals.css';
import Navbar from '../components/navbar';

export default function RootLayout({ 
  children,
 }: { 
  children: React.ReactNode;
 }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center p-24">{children}</div>
        <script src="https://cdn.tailwindcss.com"></script>
      </body>
    </html>
  );
}