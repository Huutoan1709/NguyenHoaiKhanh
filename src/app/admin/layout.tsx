
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Quản lý website blog',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 mt-16 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
