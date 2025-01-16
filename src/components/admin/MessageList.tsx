import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactSubmission, EmailTemplate } from '@/types/messages';
import { toast } from '@/components/ui/use-toast';

export const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchTemplates();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure the data matches the ContactSubmission type
      const typedMessages = data?.map(msg => ({
        ...msg,
        status: (msg.status || 'new') as ContactSubmission['status']
      })) as ContactSubmission[];

      setMessages(typedMessages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data as EmailTemplate[] || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email templates",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        {messages.map((message) => (
          <div 
            key={message.id}
            className="p-4 border rounded-lg mb-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">{message.subject}</h3>
            <p className="text-sm text-gray-600">{message.full_name} ({message.email})</p>
            <p className="mt-2">{message.message}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                message.status === 'read' ? 'bg-gray-100 text-gray-800' :
                message.status === 'replied' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {message.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Email Templates</h2>
        {templates.map((template) => (
          <div 
            key={template.id}
            className="p-4 border rounded-lg mb-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">Subject: {template.subject}</p>
            <div className="mt-2 text-sm">
              <p className="font-medium">HTML Content:</p>
              <div className="mt-1 p-2 bg-gray-50 rounded">
                {template.html_content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};