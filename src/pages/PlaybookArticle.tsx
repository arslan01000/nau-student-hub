import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { getPlaybookById, getRelatedPlaybooks } from "@/data/playbooks";
import ReactMarkdown from "react-markdown";

const PlaybookArticle = () => {
  const { id } = useParams<{ id: string }>();
  const playbook = id ? getPlaybookById(id) : undefined;
  const relatedPlaybooks = id ? getRelatedPlaybooks(id, 3) : [];

  if (!playbook) {
    return <Navigate to="/playbooks" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="border-b border-border bg-card/20">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <Link to="/playbooks">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Playbooks
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground mb-6">
            {playbook.tag}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
            {playbook.title}
          </h1>

          {/* Author Section */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-border">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{playbook.author}</p>
              <p className="text-sm text-muted-foreground">
                {playbook.major}, Class of {playbook.graduationYear}
              </p>
            </div>
          </div>

          {/* Intro */}
          <div className="text-lg text-muted-foreground leading-relaxed mb-12 pb-12 border-b border-border/50">
            {playbook.intro}
          </div>

          {/* Main Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl font-serif mt-12 mb-4 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-serif mt-8 mb-3 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {playbook.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Related Playbooks */}
      {relatedPlaybooks.length > 0 && (
        <section className="py-16 px-4 border-t border-border bg-card/20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-serif mb-8">Related Playbooks</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPlaybooks.map((related) => (
                <Link
                  key={related.id}
                  to={`/playbooks/${related.id}`}
                  className="group"
                >
                  <div className="h-full p-6 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-all duration-300">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground mb-4">
                      {related.tag}
                    </div>
                    <h3 className="text-lg font-serif mb-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {related.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      Read more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PlaybookArticle;
