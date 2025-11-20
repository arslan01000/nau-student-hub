import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { playbooks } from "@/data/playbooks";

const Playbooks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
              Student Playbooks
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Practical guides created by NAU students and alumni. Learn from real experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Playbooks Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((playbook) => (
              <Link
                key={playbook.id}
                to={`/playbooks/${playbook.id}`}
                className="group"
              >
                <div className="h-full p-6 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-all duration-300 hover:border-border/50">
                  {/* Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-foreground mb-4">
                    {playbook.tag}
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
                      <p className="text-xs text-muted-foreground">
                        {playbook.major} • Class of {playbook.graduationYear}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
            Help other NAU students by sharing your experiences and insights. Guide submissions are coming soon.
          </p>
          <Button size="lg" disabled className="opacity-50 cursor-not-allowed">
            Submit a Playbook (Coming Soon)
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Playbooks;
