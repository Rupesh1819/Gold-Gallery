import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#F7F3EA] text-[#10172B] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#D8B56D]/40 text-center space-y-5 shadow-xl">
          <h1 className="text-3xl font-bold font-serif text-[#10172B]">Page Not Found</h1>
          <p className="text-sm text-[#10172B]/70">
            The page you requested could not be located.
          </p>
          <div>
            <Link
              href="/en"
              className="inline-block px-6 py-3 rounded-lg bg-[#D62839] text-white font-semibold text-sm hover:bg-[#B81F2F]"
            >
              Go to MyGuruji Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

