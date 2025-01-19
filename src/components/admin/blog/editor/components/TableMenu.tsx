import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Table } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TableMenuProps {
  editor: Editor;
}

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");

  const insertTable = () => {
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    if (numRows > 0 && numCols > 0) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: numRows, cols: numCols, withHeaderRow: true })
        .run();
      setIsDialogOpen(false);
    }
  };

  const isTableActive = editor.isActive("table");

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle size="sm" className="h-8 w-8 p-0" pressed={isTableActive}>
              <Table className="h-4 w-4" />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem>Insert Table</DropdownMenuItem>
            </DialogTrigger>
            {isTableActive && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnBefore().run()}>
                  Add Column Before
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnAfter().run()}>
                  Add Column After
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => editor.chain().focus().deleteColumn().run()}>
                  Delete Column
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => editor.chain().focus().addRowBefore().run()}>
                  Add Row Before
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => editor.chain().focus().addRowAfter().run()}>
                  Add Row After
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => editor.chain().focus().deleteRow().run()}>
                  Delete Row
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => editor.chain().focus().deleteTable().run()}>
                  Delete Table
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().mergeCells().run()}
                  disabled={!editor.can().mergeCells()}
                >
                  Merge Cells
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().splitCell().run()}
                  disabled={!editor.can().splitCell()}
                >
                  Split Cell
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  Toggle Header Row
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cols">Columns</Label>
                <Input
                  id="cols"
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertTable}>Insert</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
