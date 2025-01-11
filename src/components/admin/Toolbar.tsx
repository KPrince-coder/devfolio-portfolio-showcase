// // components/Toolbar.tsx
// import { Button } from "@/components/ui/button";
// import { Bold, Italic, Code, Underline, Strikethrough } from "lucide-react";

// interface ToolbarProps {
//   editor: any;
// }

// const Toolbar = ({ editor }: ToolbarProps) => {
//   return (
//     <div className="flex gap-2 mb-2">
//       <Button
//         type="button"
//         onClick={() => editor?.commands.toggleBold()}
//         className="p-2 rounded-lg"
//       >
//         <Bold className="h-4 w-4" />
//       </Button>
//       <Button
//         type="button"
//         onClick={() => editor?.commands.toggleItalic()}
//         className="p-2 rounded-lg"
//       >
//         <Italic className="h-4 w-4" />
//       </Button>
//       <Button
//         type="button"
//         onClick={() => editor?.commands.toggleCode()}
//         className="p-2 rounded-lg"
//       >
//         <Code className="h-4 w-4" />
//       </Button>
//       <Button
//         type="button"
//         onClick={() => editor?.commands.toggleUnderline()}
//         className="p-2 rounded-lg"
//       >
//         <Underline className="h-4 w-4" />
//       </Button>
//       <Button
//         type="button"
//         onClick={() => editor?.commands.toggleStrike()}
//         className="p-2 rounded-lg"
//       >
//         <Strikethrough className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };

// export default Toolbar;




// components/Toolbar.tsx
import { Button } from "@/components/ui/button";
import { Bold, Italic, Code, Underline, Strikethrough, Type as FontFamilyIcon, Type as FontSizeIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  editor: any;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  return (
    <div className="flex gap-2 mb-2">
      <Button
        type="button"
        onClick={() => editor?.commands.toggleBold()}
        className="p-2 rounded-lg"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleItalic()}
        className="p-2 rounded-lg"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleCode()}
        className="p-2 rounded-lg"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleUnderline()}
        className="p-2 rounded-lg"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleStrike()}
        className="p-2 rounded-lg"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => setShowFontFamily(!showFontFamily)}
        className="p-2 rounded-lg"
      >
        <FontFamilyIcon className="h-4 w-4" />
      </Button>
      {showFontFamily && (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => editor?.commands.setFontFamily('Arial')}
            className="p-2 rounded-lg"
          >
            Arial
          </Button>
          <Button
            type="button"
            onClick={() => editor?.commands.setFontFamily('Times New Roman')}
            className="p-2 rounded-lg"
          >
            Times New Roman
          </Button>
          <Button
            type="button"
            onClick={() => editor?.commands.setFontFamily('Courier New')}
            className="p-2 rounded-lg"
          >
            Courier New
          </Button>
        </div>
      )}
      <Button
        type="button"
        onClick={() => setShowFontSize(!showFontSize)}
        className="p-2 rounded-lg"
      >
        <FontSizeIcon className="h-4 w-4" />
      </Button>
      {showFontSize && (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => editor?.commands.setFontSize('12px')}
            className="p-2 rounded-lg"
          >
            12px
          </Button>
          <Button
            type="button"
            onClick={() => editor?.commands.setFontSize('14px')}
            className="p-2 rounded-lg"
          >
            14px
          </Button>
          <Button
            type="button"
            onClick={() => editor?.commands.setFontSize('16px')}
            className="p-2 rounded-lg"
          >
            16px
          </Button>
        </div>
      )}
      <Button
        type="button"
        onClick={() => editor?.commands.setTextAlign('left')}
        className="p-2 rounded-lg"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.setTextAlign('center')}
        className="p-2 rounded-lg"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.setTextAlign('right')}
        className="p-2 rounded-lg"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleBulletList()}
        className="p-2 rounded-lg"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor?.commands.toggleOrderedList()}
        className="p-2 rounded-lg"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
              <Button
                type="button"
                onClick={() => editor?.commands.createLink()}
                className="p-2 rounded-lg"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => editor?.commands.insertImage()}
                className="p-2 rounded-lg"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        };
        
        export default Toolbar;
       
