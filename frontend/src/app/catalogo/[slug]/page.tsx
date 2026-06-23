import React from "react";

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-light">
          Producto: {params.slug}
        </h1>
        <p className="mt-4 text-white/60">
          Página en construcción
        </p>
      </div>
    </main>
  );
}