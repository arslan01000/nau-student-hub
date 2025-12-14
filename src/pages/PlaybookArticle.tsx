import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, Loader2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface PlaybookData {
  id: string;
  title: string;
  description: string;
  author_name: string;
  author_major: string | null;
  author_grad_year: string | null;
  tags: string[];
  body: string;
  intro: string | null;
  views: number;
}

const PlaybookArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [playbook, setPlaybook] = useState<PlaybookData | null>(null);
  const [relatedPlaybooks, setRelatedPlaybooks] = useState<PlaybookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPlaybook = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch the playbook
      const { data, error } = await supabase
        .from("playbooks")
        .select("id, title, description, author_name, author_major, author_grad_year, tags, body, intro, views")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();

      if (error || !data) {
        console.error("Error fetching playbook:", error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPlaybook(data);

      // Increment view count
      await supabase.rpc("increment_playbook_views", { playbook_id: id });

      // Fetch related playbooks (same tag, different ID)
      if (data.tags && data.tags.length > 0) {
        const { data: related } = await supabase
          .from("playbooks")
          .select("id, title, description, author_name, author_major, author_grad_year, tags, body, intro, views")
          .eq("status", "approved")
          .neq("id", id)
          .contains("tags", [data.tags[0]])
          .limit(3);

        setRelatedPlaybooks(related || []);
      }

      setLoading(false);
    };

    fetchPlaybook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !playbook) {
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
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {playbook.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground"
              >
                {tag}
              </span>
            ))}
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
            <div className="flex-1">
              <p className="font-medium text-foreground">{playbook.author_name}</p>
              {(playbook.author_major || playbook.author_grad_year) && (
                <p className="text-sm text-muted-foreground">
                  {playbook.author_major}
                  {playbook.author_grad_year && `, Class of ${playbook.author_grad_year}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              {playbook.views} views
            </div>
          </div>

          {/* Intro */}
          {playbook.intro && (
            <div className="text-lg text-muted-foreground leading-relaxed mb-12 pb-12 border-b border-border/50">
              {playbook.intro}
            </div>
          )}

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
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {playbook.body}
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
                    <div className="flex flex-wrap gap-1 mb-4">
                      {related.tags?.slice(0, 1).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
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
