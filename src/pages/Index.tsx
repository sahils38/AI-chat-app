import { Helmet } from "react-helmet-async";
import { ChatWidget } from "@/components/chat/ChatWidget";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Cozy Cart Support | AI Customer Service Chat</title>
        <meta
          name="description"
          content="Get instant help with your Cozy Cart orders. Our AI support agent is available 24/7 to answer questions about shipping, returns, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">Cozy Cart</h1>
                <p className="text-xs text-muted-foreground">Home Goods & Lifestyle</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-primary font-medium">
                Support
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                How can we help you today?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Chat with our AI support agent for instant answers about orders, shipping, returns, and more.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "🚚", label: "Shipping Info" },
                { icon: "↩️", label: "Returns" },
                { icon: "💳", label: "Payment" },
                { icon: "📦", label: "Track Order" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-accent transition-all duration-200 group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Chat Widget */}
            <div className="h-[600px] md:h-[650px]">
              <ChatWidget />
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Need more help?{" "}
                <a href="mailto:support@cozy-cart.store" className="text-primary hover:underline">
                  Email our team
                </a>{" "}
                or call{" "}
                <a href="tel:1-800-COZY" className="text-primary hover:underline">
                  1-800-COZY
                </a>
              </p>
              <p className="mt-2">
                Available Mon-Fri, 9 AM - 6 PM EST
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
