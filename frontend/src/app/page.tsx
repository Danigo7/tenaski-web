import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

      <p className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight">
        Tena Skis
      </p>

      <h1 className="mt-6 max-w-xl text-zinc-600 text-lg leading-relaxed">
        Esquís artesanales de alta montaña
      </h1>

      <p className="text-sm tracking-[0.2em] uppercase text-zinc-500">
        Diseñados y construidos a mano en los Pirineos. Precisión, madera y nieve en su forma más pura.
      </p>

      <div className="mt-10 flex gap-4">
        <Button href="/catalogo" variant="primary">
          Ver catálogo
        </Button>
        <Button href="/historia" variant="secondary">
          Nuestra historia
        </Button>
      </div>

    </div>
  );
}