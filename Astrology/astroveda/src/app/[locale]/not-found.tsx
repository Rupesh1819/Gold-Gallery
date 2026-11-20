import { Link } from '@/i18n/navigation';
import { Compass, Home, Calendar, Phone, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-ivory px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 border border-gold/30 shadow-xl text-center space-y-6">
        
        {/* Emblem */}
        <div className="h-20 w-20 mx-auto rounded-full bg-midnight border-2 border-gold flex items-center justify-center text-gold shadow-lg shadow-gold/20">
          <Compass className="h-10 w-10 animate-[spin_60s_linear_infinite]" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold font-heading text-action block">
            404
          </span>
          <h1 className="font-heading text-2xl font-bold text-midnight">
            Cosmic Path Not Found
          </h1>
          <p className="text-sm text-midnight/70 font-body leading-relaxed">
            The page or planetary alignment you are seeking does not exist or has moved to another orbit.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-midnight text-ivory text-sm font-semibold hover:bg-cosmic transition-colors"
          >
            <Home className="h-4 w-4 text-gold" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ivory border border-gold/30 text-midnight text-sm font-semibold hover:bg-gold/10 transition-colors"
          >
            <span>Explore Consultations</span>
          </Link>

          <Link
            href="/book"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-action text-white text-sm font-bold hover:bg-action-hover transition-colors shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            <span>Book a Consultation</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-cosmic/10">
          <Link href="/contact" className="text-xs text-action font-semibold hover:underline">
            Need assistance? Contact MyGuruji support
          </Link>
        </div>

      </div>
    </div>
  );
}

