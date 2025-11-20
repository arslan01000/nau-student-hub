import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const tags = ["Academics", "US Life", "Career", "Campus Life", "Immigration", "Money"];

const SubmitPlaybook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedTags: [] as string[],
    body: "",
    externalLinks: "",
    authorMajor: "",
    authorGradYear: "",
    confirmed: false,
  });

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.confirmed) {
      toast.error("Please confirm the accuracy of your playbook");
      return;
    }

    if (formData.selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', user?.id)
        .single();

      const authorName = profile?.display_name || profile?.username || 'Anonymous';
      
      const externalLinksArray = formData.externalLinks
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

      const { error } = await supabase
        .from('playbooks')
        .insert({
          title: formData.title,
          description: formData.description,
          tags: formData.selectedTags,
          body: formData.body,
          external_links: externalLinksArray.length > 0 ? externalLinksArray : null,
          author_name: authorName,
          author_major: formData.authorMajor || null,
          author_grad_year: formData.authorGradYear || null,
          author_id: user?.id,
          status: 'pending',
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Playbook submitted successfully!");
      
      setTimeout(() => {
        navigate('/playbooks');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting playbook:', error);
      toast.error(error.message || "Failed to submit playbook");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-6">
            <BookOpen className="w-12 h-12 text-foreground" />
          </div>
          <h1 className="text-4xl font-serif">Thanks for submitting a Playbook!</h1>
          <p className="text-xl text-muted-foreground">
            Your Playbook is now under review. Once approved, it will appear in the Playbooks section.
          </p>
          <Button onClick={() => navigate('/playbooks')} size="lg">
            Back to Playbooks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link 
          to="/playbooks" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playbooks
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Submit a Playbook</h1>
          <p className="text-lg text-muted-foreground">
            Share your experience and help other NAU students succeed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., How to Finish Undergraduate in 2 Years"
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief 1-2 sentence summary of your guide"
              required
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags * (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    formData.selectedTags.includes(tag)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Author Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Your Major (optional)</Label>
              <Input
                id="major"
                value={formData.authorMajor}
                onChange={(e) => setFormData(prev => ({ ...prev, authorMajor: e.target.value }))}
                placeholder="e.g., Computer Science"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradYear">Graduation Year (optional)</Label>
              <Input
                id="gradYear"
                value={formData.authorGradYear}
                onChange={(e) => setFormData(prev => ({ ...prev, authorGradYear: e.target.value }))}
                placeholder="e.g., 2023"
                maxLength={4}
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Main Content *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your guide here. You can use markdown formatting."
              required
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supports markdown formatting (headings, lists, bold, italic, links, etc.)
            </p>
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <Label htmlFor="externalLinks">External Links (optional)</Label>
            <Textarea
              id="externalLinks"
              value={formData.externalLinks}
              onChange={(e) => setFormData(prev => ({ ...prev, externalLinks: e.target.value }))}
              placeholder="Add relevant links (one per line)&#10;https://github.com/...&#10;https://notion.so/..."
              rows={4}
            />
          </div>

          {/* Confirmation */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Checkbox
              id="confirm"
              checked={formData.confirmed}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, confirmed: checked as boolean }))
              }
            />
            <Label htmlFor="confirm" className="cursor-pointer text-sm leading-relaxed">
              I confirm this Playbook is based on my own experience and is accurate to the best of my knowledge.
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit Playbook"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/playbooks')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPlaybook;
