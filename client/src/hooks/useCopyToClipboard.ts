import { useState } from "react";

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [boolean, CopyFn] {
  const [isCopied, setIsCopied] = useState(false);

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);

      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
      return false;
    }
  };

  return [isCopied, copy];
}
