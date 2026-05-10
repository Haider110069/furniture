import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const featuredPost = {
    title: "10 Tips for Creating a Cozy Living Room",
    excerpt: "Transform your living space into a warm, inviting haven with these expert design tips that combine comfort with style.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
    date: "May 1, 2026",
    category: "Interior Design",
    slug: "cozy-living-room-tips",
  }

  const posts = [
    {
      title: "The Rise of Sustainable Furniture",
      excerpt: "Discover how eco-friendly materials are shaping the future of furniture design.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      date: "Apr 28, 2026",
      category: "Sustainability",
      slug: "sustainable-furniture",
    },
    {
      title: "Minimalist Design: Less is More",
      excerpt: "How to embrace minimalism without sacrificing comfort or personality in your home.",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop",
      date: "Apr 25, 2026",
      category: "Design Trends",
      slug: "minimalist-design",
    },
    {
      title: "Choosing the Perfect Dining Table",
      excerpt: "A comprehensive guide to selecting a dining table that fits your space and lifestyle.",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
      date: "Apr 22, 2026",
      category: "Buying Guide",
      slug: "perfect-dining-table",
    },
    {
      title: "Color Psychology in Interior Design",
      excerpt: "Understanding how colors affect mood and atmosphere in your living spaces.",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&h=300&fit=crop",
      date: "Apr 18, 2026",
      category: "Interior Design",
      slug: "color-psychology",
    },
    {
      title: "Small Space Solutions",
      excerpt: "Creative furniture and layout ideas for maximizing small apartments and rooms.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      date: "Apr 15, 2026",
      category: "Tips & Tricks",
      slug: "small-space-solutions",
    },
    {
      title: "The Art of Mixing Furniture Styles",
      excerpt: "Learn how to blend different design aesthetics for a unique, personalized look.",
      image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop",
      date: "Apr 12, 2026",
      category: "Design Trends",
      slug: "mixing-furniture-styles",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Our Blog</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto text-pretty">
            Inspiration, tips, and trends for creating beautiful living spaces.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width={800}
                  height={500}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors text-balance">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <p className="text-sm text-muted-foreground">{featuredPost.date}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link 
                key={index} 
                href={`/blog/${post.slug}`}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-balance">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Stay Inspired</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest design tips, trends, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
