import Link from 'next/link';

const UserNavbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link href="/dashboard">Research Hub</Link>
      </div>
      <ul>
        <li><Link href="/dashboard">Home</Link></li>
        <li><Link href="/library">Library</Link></li>
        <li><Link href="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
