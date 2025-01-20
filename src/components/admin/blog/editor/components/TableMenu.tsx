import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Table } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");
  const rowsInputRef = useRef<HTMLInputElement>(null);
  const insertButtonRef = useRef<HTMLButtonElement>(null);

  const isTableActive = editor.isActive("table");

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setRows("3");
      setCols("3");
      // Focus the rows input after dialog is mounted
      requestAnimationFrame(() => rowsInputRef.current?.focus());
    }
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    // When dropdown closes, focus back on the trigger button
    if (!open) {
      requestAnimationFrame(() => insertButtonRef.current?.focus());
    }
  };

  const createTable = () => {
    const numRows = parseInt(rows, 10);
    const numCols = parseInt(cols, 10);
    
    if (numRows > 0 && numCols > 0) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: numRows, cols: numCols, withHeaderRow: true })
        .run();

      setIsDialogOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createTable();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange} modal>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Toggle 
                  ref={insertButtonRef}
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  pressed={isTableActive}
                  aria-label="Table options"
                >
                  <Table className="h-4 w-4" />
                </Toggle>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert Table</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="start" className="w-48">
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Insert Table
            </DropdownMenuItem>
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
              <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                Merge Cells
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                Split Cell
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                Toggle Header Cell
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Enter the number of rows and columns for your table.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4" role="group" aria-label="Table dimensions">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rows" className="text-right">
              Rows
            </Label>
            <Input
              id="rows"
              ref={rowsInputRef}
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3"
              aria-label="Number of rows"
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
              max="10"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3"
              aria-label="Number of columns"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={createTable}>Insert</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
