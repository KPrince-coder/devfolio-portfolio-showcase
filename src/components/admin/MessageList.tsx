import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ContactSubmission, EmailTemplate } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const MessageList = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    fetchTemplates();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
      return;
    }

    setMessages(data || []);
  };

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive"
      });
      return;
    }

    setTemplates(data || []);
  };

  const handleUpdateTemplate = async (template: EmailTemplate) => {
    const { error } = await supabase
      .from('email_templates')
      .update({
        subject: template.subject,
        html_content: template.html_content
      })
      .eq('id', template.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Template updated successfully"
    });
    fetchTemplates();
  };

  const handleDeleteTemplate = async (id: string) => {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Template deleted successfully"
    });
    fetchTemplates();
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="messages">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <h2 className="mb-6 text-2xl font-semibold">Contact Messages</h2>
          
          {messages.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">{message.full_name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="mt-2">{message.message}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                      {message.status !== 'archived' && (
                        <Button variant="outline" size="sm">
                          Archive
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No messages yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Email Templates</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Template</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Email Template</DialogTitle>
                  </DialogHeader>
                  {/* Template form will go here */}
                </DialogContent>
              </Dialog>
            </div>

            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{template.name}</h3>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {template.subject}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={selectedTemplate.subject}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={selectedTemplate.html_content}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      html_content: e.target.value,
                    })
                  }
                  rows={10}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedTemplate) {
                    handleUpdateTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};