"use client";

import { useState } from "react";

/** Tombol bagikan — pakai Web Share API kalau ada, kalau tidak salin link. */
export default function TombolBagikan({ judul }: { judul: string }) {
  const [pesan, setPesan] = useState("");

  async function bagikan() {
    const url = window.location.href;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: judul, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setPesan("Link disalin!");
    } catch {
      setPesan("Gagal menyalin");
    } finally {
      setTimeout(() => setPesan(""), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={bagikan}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      {pesan || "Bagikan link"}
    </button>
  );
}
