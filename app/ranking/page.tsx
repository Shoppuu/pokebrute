import Navbar from "@/components/navbar";

export default function Ranking() {
  return (
    <main className="min-h-screen p-8">
      <Navbar />

      <h1 className="mb-6 text-5xl font-bold">
        Classement
      </h1>

      <p className="text-gray-500">
        Le classement arrivera quand la progression et les talents seront stabilisés.
      </p>
    </main>
  );
}
