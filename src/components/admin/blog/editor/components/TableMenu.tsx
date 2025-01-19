import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Table } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TableMenuProps {
  editor: Editor;
}

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");

  const isTableActive = editor.isActive("table");

  const createTable = () => {
    const numRows = parseInt(rows, 10);
    const numCols = parseInt(cols, 10);
    
    if (numRows > 0 && numCols > 0) {
      // Create header row
      const headerRow = {
        type: "tableRow",
        content: Array.from({ length: numCols }, () => ({
          type: "tableHeader",
          content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
        })),
      };

      // Create regular rows
      const bodyRows = Array.from({ length: numRows - 1 }, () => ({
        type: "tableRow",
        content: Array.from({ length: numCols }, () => ({
          type: "tableCell",
          content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
        })),
      }));

      editor
        .chain()
        .focus()
        .insertContent({
          type: "table",
          content: [headerRow, ...bodyRows],
        })
        .run();
      
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Toggle size="sm" className="h-8 w-8 p-0" pressed={isTableActive}>
                  <Table className="h-4 w-4" />
                </Toggle>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert Table</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="start">
          <DialogTrigger asChild>
            <DropdownMenuItem>Insert Table</DropdownMenuItem>
          </DialogTrigger>
          {isTableActive && (
            <>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
                Delete Table
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                Add Column Before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                Add Column After
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                Delete Column
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                Add Row Before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                Add Row After
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                Delete Row
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Enter the number of rows and columns for your table.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rows" className="text-right">
              Rows
            </Label>
            <Input
              id="rows"
              type="number"
              min="1"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cols" className="text-right">
              Columns
            </Label>
            <Input
              id="cols"
              type="number"
              min="1"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={createTable}>Insert</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
