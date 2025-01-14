import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onItemClick: (id: string) => void;
}

export function TableOfContents({ items, activeId, onItemClick }: TableOfContentsProps) {
  const renderItems = (items: TocItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="w-full">
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            onItemClick(item.id);
          }}
          className={cn(
            "block py-1 text-sm transition-colors hover:text-primary",
            activeId === item.id
              ? "text-primary font-medium"
              : "text-muted-foreground",
            item.level > 2 && "pl-4"
          )}
        >
          {item.title}
        </a>
        {item.children && (
          <div className="ml-4 border-l border-border/50">
            {renderItems(item.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Card className="p-4 bg-background/95 backdrop-blur-sm border-border/40">
      <h4 className="font-semibold mb-4">On this page</h4>
      <nav className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {renderItems(items)}
      </nav>
    </Card>
  );
}
