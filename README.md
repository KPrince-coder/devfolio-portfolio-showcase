# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9cf2e8fd-7724-4144-bda2-590d7b0c4198

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9cf2e8fd-7724-4144-bda2-590d7b0c4198) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Rich Text Editor

The blog editor comes with a powerful rich text editing experience, featuring various formatting options and block types.

### Block Types

#### 1. Blockquotes vs Callout Blocks

The editor provides two distinct types of blocks for different purposes:

##### Regular Blockquotes
- **Purpose**: Used for quoting external content or citations
- **Style**: Simple, traditional quote style with a subtle left border
- **Appearance**: 
  - Gray left border
  - Italic text
  - No background color
  - Simple indentation
- **Usage**: 
  - Use the Quote button in the toolbar
  - Type `/quote` in the editor
- **Best for**: Citations, external quotes, or referenced content

##### Callout Blocks
- **Purpose**: Highlight important information with visual emphasis
- **Types**:
  1. **Note Block** (Blue)
     - Purpose: Highlight important information
     - Command: `/note`
     - Use for: Key points, important reminders
  
  2. **Warning Block** (Yellow/Orange)
     - Purpose: Draw attention to cautionary information
     - Command: `/warning`
     - Use for: Warnings, cautions, important prerequisites
  
  3. **Info Block** (Gray)
     - Purpose: Provide additional context
     - Command: `/info`
     - Use for: Extra details, context, or explanations
  
  4. **Success Block** (Green)
     - Purpose: Highlight positive outcomes or completions
     - Command: `/success`
     - Use for: Completion messages, successful outcomes
  
  5. **Error Block** (Red)
     - Purpose: Highlight critical information or errors
     - Command: `/error`
     - Use for: Error messages, critical warnings, common mistakes

- **Features**:
  - Distinctive colored backgrounds and borders
  - Rounded corners on the right side
  - More prominent visual appearance
  - Regular text weight (not italic)
  - Dark mode support

### Usage Tips

1. **Choosing Between Block Types**:
   - Use **Blockquotes** when quoting external sources or adding citations
   - Use **Callout Blocks** when you want to draw attention to specific information

2. **Quick Access**:
   - Use slash commands (type `/` in the editor) to access all block types
   - Use the toolbar buttons for quick access to common blocks

3. **Keyboard Shortcuts**:
   - `⌘+⌥+Q` - Toggle blockquote
   - Use arrow keys to navigate slash command menu
   - Press Enter to select a block type

4. **Styling**:
   - All blocks support both light and dark mode
   - Blocks maintain consistent spacing and padding
   - Text inside blocks can be further formatted with bold, italic, etc.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9cf2e8fd-7724-4144-bda2-590d7b0c4198) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
