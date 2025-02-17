import Link from 'next/link';

const PublicNavbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link href="/dashboard">Research Hub</Link>
      </div>
      <ul>
        <li><Link href="/dashboard">Home</Link></li>
        <li><Link href="/library">Library</Link></li>
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default PublicNavbar;
