"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const toolbarButtonBase =
  "rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted";
const toolbarButtonActive = "bg-primary text-white border-primary hover:bg-primary";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] p-4 text-sm leading-relaxed focus:outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="glass-card rounded-2xl border border-border">
      <div className="flex flex-wrap gap-2 border-b border-border p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${toolbarButtonBase} ${editor.isActive("bold") ? toolbarButtonActive : ""}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${toolbarButtonBase} ${editor.isActive("italic") ? toolbarButtonActive : ""}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${toolbarButtonBase} ${editor.isActive("heading", { level: 2 }) ? toolbarButtonActive : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${toolbarButtonBase} ${editor.isActive("heading", { level: 3 }) ? toolbarButtonActive : ""}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${toolbarButtonBase} ${editor.isActive("bulletList") ? toolbarButtonActive : ""}`}
        >
          BulletList
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${toolbarButtonBase} ${editor.isActive("orderedList") ? toolbarButtonActive : ""}`}
        >
          OrderedList
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={toolbarButtonBase}
        >
          HorizontalRule
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
