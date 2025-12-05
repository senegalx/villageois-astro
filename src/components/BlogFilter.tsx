import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  categories: string[];
  image?: string;
}

interface BlogFilterProps {
  posts: BlogPost[];
  categories: string[];
}

export const BlogFilter = ({ posts, categories: allCategories }: BlogFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
  const categories = useMemo(() => ["Tous", ...allCategories], [allCategories]);
  
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Tous") return posts;
    return posts.filter(post => 
      post.categories.some(cat => cat === selectedCategory) || 
      post.category === selectedCategory
    );
  }, [posts, selectedCategory]);

  return (
    <>
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "border-2 hover:border-primary"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun article trouvé dans cette catégorie.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {filteredPosts.map((post) => (
                <a 
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block border-2 hover:shadow-medium transition-smooth group overflow-hidden rounded-lg bg-card"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden bg-muted">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-4xl text-primary/30">V2.0</span>
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3">
                      <div className="flex flex-col space-y-1.5 p-6">
                        <div className="flex flex-col gap-3 mb-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {post.category || post.categories[0] || 'Non classé'}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2 group-hover:text-primary transition-smooth">
                          {post.title}
                        </h3>
                      </div>
                      <div className="p-6 pt-0 space-y-4">
                        <p className="text-base leading-relaxed text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        <span 
                          className="inline-flex items-center gap-2 hover:text-primary transition-smooth p-0 h-auto font-semibold text-foreground group/btn"
                        >
                          Lire la suite
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-smooth" />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {filteredPosts.length > 10 && (
            <div className="text-center mt-12">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                Charger plus d'articles
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogFilter;
