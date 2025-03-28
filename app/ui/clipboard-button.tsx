"use client";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ClipboardButtonProps {
  text: string;
}

export default function ClipboardButton({ text }: ClipboardButtonProps) {
  const [copiedServer, setCopiedServer] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedServer(text);
    setTimeout(() => setCopiedServer(null), 2000);
  };
  return (
    <button
      onClick={() => handleCopyToClipboard(text)}
      className="hover:bg-orange-300 p-1 rounded ml-1"
      aria-label="Copy"
    >
    {copiedServer === text ? (
      <span className="text-green-500 text-xs">Copied!</span>
    ) : (
      <ClipboardIcon className="w-5 h-5" />
    )}
    </button>
  );
}
