"use client";

import {
  Bold,
  Code,
  ChevronDown,
  Image as ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Undo2,
  UnderlineIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  token: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File, token: string) => Promise<string>;
  onPickImage?: () => Promise<string>;
};

export function RichTextEditor({
  value,
  token,
  placeholder = "Write rich content...",
  onChange,
  onUpload,
  onPickImage,
}: RichTextEditorProps) {
  const lastExternalValue = useRef(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            "my-4 max-w-full rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cyan-700 underline underline-offset-4 dark:text-cyan-300",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-80 max-w-none px-4 py-4 text-sm leading-7 outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:bg-teal-50/60 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:dark:bg-teal-950/20 [&_ol]:list-decimal [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-slate-100 [&_ul]:list-disc",
      },
    },
    onUpdate({ editor: activeEditor }) {
      const html = activeEditor.getHTML();
      lastExternalValue.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value === lastExternalValue.current) return;
    lastExternalValue.current = value;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  async function uploadImage(file: File) {
    if (!editor) return;
    setUploadError("");
    setUploading(true);
    try {
      const path = await onUpload(file, token);
      if (!path) return;
      editor.chain().focus().setImage({ src: path, alt: file.name }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10">
      <Toolbar editor={editor} uploading={uploading} onUpload={uploadImage} onPickImage={onPickImage} />
      <EditorContent editor={editor} />
      {(uploading || uploadError) ? (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
          {uploading ? <span className="text-slate-500 dark:text-slate-400">Uploading image...</span> : null}
          {uploadError ? <span className="text-red-600 dark:text-red-400">{uploadError}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

function Toolbar({
  editor,
  uploading,
  onUpload,
  onPickImage,
}: {
  editor: Editor | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onPickImage?: () => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return <div className="h-12 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />;
  }

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("URL", current ?? "");
    if (href === null) return;
    if (href === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const formatValue = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  const setFormat = (format: string) => {
    if (format === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
    if (format === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (format === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
    if (format === "paragraph") editor.chain().focus().setParagraph().run();
  };

  const pickImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
    event.target.value = "";
  };

  const insertPickedImage = async () => {
    if (!onPickImage) return;
    const path = await onPickImage();
    if (!path) return;
    editor.chain().focus().setImage({ src: path }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
      <label className="relative inline-flex h-9 min-w-34 items-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <span className="pointer-events-none absolute right-2 text-slate-400">
          <ChevronDown size={14} />
        </span>
        <select
          aria-label="Text style"
          className="h-full w-full appearance-none rounded-md bg-transparent py-0 pr-8 pl-3 outline-none"
          value={formatValue}
          onChange={(event) => setFormat(event.target.value)}
        >
          <option value="paragraph">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </label>
      <ToolbarDivider />
      <ToolbarButton active={editor.isActive("bold")} label="Bold" icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton active={editor.isActive("italic")} label="Italic" icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton active={editor.isActive("underline")} label="Underline" icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <ToolbarButton active={editor.isActive("code")} label="Code" icon={Code} onClick={() => editor.chain().focus().toggleCode().run()} />
      <ToolbarDivider />
      <ToolbarButton active={editor.isActive("bulletList")} label="Bullet list" icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarButton active={editor.isActive("orderedList")} label="Numbered list" icon={ListOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolbarButton active={editor.isActive("blockquote")} label="Quote" icon={Quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolbarDivider />
      <ToolbarButton active={editor.isActive("link")} label="Link" icon={LinkIcon} onClick={setLink} />
      <ToolbarButton disabled={uploading} label={uploading ? "Uploading image" : "Upload image"} icon={ImageIcon} onClick={() => inputRef.current?.click()} />
      {onPickImage ? <ToolbarButton label="Pick image" icon={ImageIcon} onClick={insertPickedImage} /> : null}
      <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={pickImage} />
      <ToolbarDivider />
      <ToolbarButton label="Clear" icon={RemoveFormatting} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
      <ToolbarButton disabled={!editor.can().undo()} label="Undo" icon={Undo2} onClick={() => editor.chain().focus().undo().run()} />
      <ToolbarButton disabled={!editor.can().redo()} label="Redo" icon={Redo2} onClick={() => editor.chain().focus().redo().run()} />
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-950"
          : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
      disabled={disabled}
      title={label}
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon size={15} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:inline-block dark:bg-slate-800" />;
}
