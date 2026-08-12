"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Props {
  logo?: string;
  setLogo: (url: string) => void;
}

export default function LogoUpload({ logo, setLogo }: Props) {
  const [uploading, setUploading] = useState(false);

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    // validate image

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const filePath = `logos/${fileName}`;

      const { error } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      setLogo(data.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);

      alert("Logo upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label
        className="
        text-sm
        font-medium
        text-slate-700
        "
      >
        Company Logo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={uploadLogo}
        className="
        block
        w-full
        text-sm
        "
      />

      {uploading && <p className="text-sm text-slate-500">Uploading logo...</p>}

      {logo && (
        <div
          className="
          mt-4
          h-28
          w-28
          overflow-hidden
          rounded-xl
          border
          "
        >
          <Image
            src={logo}
            alt="Company Logo"
            width={112}
            height={112}
            className="
            h-full
            w-full
            object-cover
            "
          />
        </div>
      )}
    </div>
  );
}
