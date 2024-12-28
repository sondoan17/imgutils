export default function Footer() {
  return (
    <footer className="mt-auto py-6 bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-600">Powered by sondoan17 • Made with ❤️</p>
        <p className="text-sm text-gray-500 mt-2">
          © {new Date().getFullYear()} ImageUltis. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
