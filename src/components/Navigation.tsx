import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/logo-villageois.png" 
              alt="Villageois 2.0" 
              className="h-14 w-14 object-contain transition-smooth group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Villageois 2.0</span>
              <span className="text-xs text-muted-foreground">Connectons nos villages</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-foreground hover:text-primary transition-smooth font-medium relative group"
            >
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-smooth font-medium outline-none">
                À propos
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-56 bg-background border-2 border-border rounded-lg shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <a 
                    href="/about" 
                    className="block px-4 py-3 text-foreground hover:bg-muted hover:text-primary transition-smooth"
                  >
                    <div className="font-medium">Qui sommes-nous</div>
                    <div className="text-xs text-muted-foreground mt-1">Notre histoire et mission</div>
                  </a>
                  <a 
                    href="/themes" 
                    className="block px-4 py-3 text-foreground hover:bg-muted hover:text-primary transition-smooth"
                  >
                    <div className="font-medium">Axes thématiques</div>
                    <div className="text-xs text-muted-foreground mt-1">Nos 4 piliers d'action</div>
                  </a>
                </div>
              </div>
            </div>

            <a
              href="/projects"
              className="text-foreground hover:text-primary transition-smooth font-medium relative group"
            >
              Nos projets
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>

            <a
              href="/blog"
              className="text-foreground hover:text-primary transition-smooth font-medium relative group"
            >
              Actualité
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>

            <a
              href="/contact"
              className="text-foreground hover:text-primary transition-smooth font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>

            <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-medium transition-smooth">
              Boîte à outils
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-4">
              <a
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
              >
                Accueil
              </a>
              
              <div>
                <button
                  onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                  className="flex items-center justify-between w-full text-foreground hover:text-primary transition-smooth font-medium py-2"
                >
                  À propos
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileAboutOpen && (
                  <div className="pl-4 mt-2 space-y-2 bg-muted/30 rounded-lg p-3">
                    <a
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block py-2"
                    >
                      <div className="font-medium text-foreground">Qui sommes-nous</div>
                      <div className="text-xs text-muted-foreground">Notre histoire et mission</div>
                    </a>
                    <a
                      href="/themes"
                      onClick={() => setIsOpen(false)}
                      className="block py-2"
                    >
                      <div className="font-medium text-foreground">Axes thématiques</div>
                      <div className="text-xs text-muted-foreground">Nos 4 piliers d'action</div>
                    </a>
                  </div>
                )}
              </div>

              <a
                href="/projects"
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
              >
                Nos projets
              </a>

              <a
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
              >
                Actualité
              </a>

              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
              >
                Contact
              </a>

              <Button className="gradient-primary text-primary-foreground w-full">
                Boîte à outils
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
