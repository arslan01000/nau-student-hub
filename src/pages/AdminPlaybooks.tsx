import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, XCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface Playbook {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author_name: string;
  author_major: string | null;
  author_grad_year: string | null;
  body: string;
  external_links: string[] | null;
  status: string;
  created_at: string;
}

const AdminPlaybooks = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied");
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPlaybooks();
    }
  }, [isAdmin]);

  const fetchPlaybooks = async () => {
    try {
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaybooks(data || []);
    } catch (error: any) {
      console.error('Error fetching playbooks:', error);
      toast.error("Failed to load playbooks");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playbooks')
        .update({
          status: 'published',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Playbook approved and published!");
      fetchPlaybooks();
    } catch (error: any) {
      console.error('Error approving playbook:', error);
      toast.error("Failed to approve playbook");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playbooks')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Playbook rejected");
      fetchPlaybooks();
    } catch (error: any) {
      console.error('Error rejecting playbook:', error);
      toast.error("Failed to reject playbook");
    }
  };

  const handleView = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setViewDialogOpen(true);
  };

  if (adminLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Playbook Moderation</h1>
          <p className="text-muted-foreground">Review and manage submitted playbooks</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading playbooks...</p>
          </div>
        ) : playbooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No playbooks to review</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playbooks.map((playbook) => (
                  <TableRow key={playbook.id}>
                    <TableCell className="font-medium">{playbook.title}</TableCell>
                    <TableCell>
                      {playbook.author_name}
                      {playbook.author_major && (
                        <div className="text-xs text-muted-foreground">
                          {playbook.author_major}
                          {playbook.author_grad_year && ` • ${playbook.author_grad_year}`}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {playbook.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          playbook.status === 'published' ? 'default' : 
                          playbook.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {playbook.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(playbook.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(playbook)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {playbook.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(playbook.id)}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(playbook.id)}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {selectedPlaybook?.title}
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex gap-2">
                    {selectedPlaybook?.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm">
                    By {selectedPlaybook?.author_name}
                    {selectedPlaybook?.author_major && (
                      <> • {selectedPlaybook.author_major}</>
                    )}
                    {selectedPlaybook?.author_grad_year && (
                      <> • Class of {selectedPlaybook.author_grad_year}</>
                    )}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <p className="text-muted-foreground">{selectedPlaybook?.description}</p>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{selectedPlaybook?.body || ''}</ReactMarkdown>
              </div>
              {selectedPlaybook?.external_links && selectedPlaybook.external_links.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-2">External Links</h4>
                  <ul className="space-y-1">
                    {selectedPlaybook.external_links.map((link, idx) => (
                      <li key={idx}>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {selectedPlaybook?.status === 'pending' && (
              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                <Button
                  onClick={() => {
                    handleApprove(selectedPlaybook.id);
                    setViewDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedPlaybook.id);
                    setViewDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPlaybooks;
