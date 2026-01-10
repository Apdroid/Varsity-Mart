export default function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground border-t border-border">
      <div className="max-w-global mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Varsity Mart</h3>
            <p className="text-sm text-foreground/80">A university-focused marketplace connecting students and local businesses.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Explore</h4>
            <ul className="text-sm text-foreground/80 space-y-1">
              <li><a className="hover:text-primary" href="/">Home</a></li>
              <li><a className="hover:text-primary" href="/products">Products</a></li>
              <li><a className="hover:text-primary" href="/stores">Stores</a></li>
              <li><a className="hover:text-primary" href="/restaurants">Restaurants</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Help</h4>
            <ul className="text-sm text-foreground/80 space-y-1">
              <li><a className="hover:text-primary" href="/help">Support</a></li>
              <li><a className="hover:text-primary" href="/contact">Contact</a></li>
              <li><a className="hover:text-primary" href="/terms">Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Stay in touch</h4>
            <p className="text-sm text-foreground/80 mb-3">Get updates, deals and more.</p>
            <form className="flex gap-2">
              <input aria-label="Email" placeholder="you@school.edu" className="flex-1 rounded-md border border-border px-3 py-2 bg-transparent text-sm" />
              <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-sm text-foreground/70 flex flex-col md:flex-row justify-between items-center">
          <span>© {new Date().getFullYear()} Varsity Mart. All rights reserved.</span>
          <div className="mt-3 md:mt-0 space-x-4">
            <a className="hover:text-primary" href="/privacy">Privacy</a>
            <a className="hover:text-primary" href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
