import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { playbooks as staticPlaybooks, Playbook } from "@/data/playbooks";

const allTags = [
  "All",
  "Academics",
  "US Life",
  "Career",
  "Campus Life",
  "Immigration",
  "Money",
];

const Playbooks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "az">("newest");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // фильтрация + сортировка поверх статичного массива
  const filteredPlaybooks = useMemo(() => {
    let result: Playbook[] = staticPlaybooks;

    if (selectedTag !== "All") {
      result = result.filter((p) => p.tag === selectedTag);
    }

    if (sortBy === "az") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // "newest" — оставляем порядок, как в файле (или можно развернуть)
      result = [...result];
    }

    return result;
  }, [selectedTag, sortBy]);

  const handleSubmitClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      navigate("/playbooks/submit");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden grid-pattern">
        <div className="absolute inset-0"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
              Student Playbooks
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Practical guides created by NAU students and alumni. Learn from
              real experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Tag Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "az")}
              className="px-4 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            >
              <option value="newest">Newest</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Playbooks Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedTag === "All"
                  ? "No playbooks yet. Be the first to add one!"
                  : `No playbooks found for ${selectedTag}`}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaybooks.map((playbook) => (
                <Link
                  key={playbook.id}
                  to={`/playbooks/${playbook.id}`}
                  className="group"
                >
                  <div className="h-full p-6 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-all duration-300 hover:border-border/50">
                    {/* Tag */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground">
                        {playbook.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">
                      {playbook.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {playbook.description}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {playbook.author}
                        </p>
                        {(playbook.major || playbook.graduationYear) && (
                          <p className="text-xs text-muted-foreground">
                            {playbook.major}
                            {playbook.graduationYear &&
                              ` • Class of ${playbook.graduationYear}`}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border bg-card/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-muted rounded-full mb-6">
            <BookOpen className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-3xl font-serif mb-4">Have a guide to share?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help other NAU students by sharing your experiences and insights.
          </p>
          <Button size="lg" onClick={handleSubmitClick}>
            Submit a Playbook
          </Button>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Playbooks;
