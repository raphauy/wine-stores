"use client"

import { Toggle } from "@/components/ui/toggle"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Heading2, Italic, List, ListOrdered, Strikethrough } from "lucide-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Heading } from "@tiptap/extension-heading"

type Props = {
  fieldName: string
  value: string
}
export default function Tiptap({ fieldName, value }: Props) {
  const { setValue } = useFormContext()
  const editor = useEditor({
    extensions: [
        Placeholder.configure({
            placeholder: "Escribe aquí",
            emptyNodeClass:
            "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
        }),
        StarterKit.configure({
            orderedList: {
                HTMLAttributes: {
                    class: "list-decimal pl-4",
                },
            },

            bulletList: {
                HTMLAttributes: {
                    class: "list-disc pl-4",
                },
            },
        }),
        Heading.configure({
            HTMLAttributes: {
                class: "text-xl font-bold",
                levels: [2],
            },          
        }),
    ],

    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setValue(fieldName, content, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: value,
  })

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="border-input border rounded-md">
          <Toggle
            pressed={editor.isActive("heading")}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            size={"sm"}
          >
            <Heading2 className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            size={"sm"}
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            size={"sm"}
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            size={"sm"}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            size={"sm"}
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            size={"sm"}
          >
            <List className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent placeholder="heyy" editor={editor} />
    </div>
  )
}

