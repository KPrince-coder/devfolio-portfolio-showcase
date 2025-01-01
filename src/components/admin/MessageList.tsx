import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MessageList = () => {
  // In production, messages would be fetched from Supabase
  const messages: any[] = [];

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Contact Messages</h2>
      
      {messages.length > 0 ? (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{message.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{message.email}</p>
                <p className="mt-2">{message.message}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          No messages yet
        </div>
      )}
    </Card>
  );
};