export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm text-gray-600">
        <div>
          <div className="font-semibold text-gray-900 mb-2">Metrimonial</div>
          <p>Find trusted wedding vendors and plan your perfect day.</p>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-2">Explore</div>
          <ul className="space-y-2">
            <li><a className="hover:text-rose-600" href="/blog">Blog</a></li>
            <li><a className="hover:text-rose-600" href="/about">About</a></li>
            <li><a className="hover:text-rose-600" href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-2">Legal</div>
          <ul className="space-y-2">
            <li><a className="hover:text-rose-600" href="/terms">Terms</a></li>
            <li><a className="hover:text-rose-600" href="/privacy">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-xs text-gray-500">© {new Date().getFullYear()} Metrimonial. All rights reserved.</div>
      </div>
    </footer>
  );
}


