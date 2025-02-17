import Link from 'next/link';

const AdminNavbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link href="/admin">Admin Panel</Link>
      </div>
      <ul>
        <li><Link href="/admin">Dashboard</Link></li>
        <li><Link href="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
