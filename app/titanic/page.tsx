import { readFile } from "node:fs/promises";
import path from "node:path";

import { TitanicCsvUpload } from "@/components/titanic/TitanicCsvUpload";
import { TitanicPassengersTable } from "@/components/titanic/TitanicPassengersTable";
import { parseCsv } from "@/lib/parseCsv";

async function loadTitanicCsv() {
  const csvPath = path.join(process.cwd(), "public", "titanic.csv");
  const text = await readFile(csvPath, "utf-8");
  return parseCsv(text);
}

export default async function TitanicPage() {
  const { headers, rows } = await loadTitanicCsv();

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Titanic Dataset
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Passengers
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            titanic.csv · {rows.length.toLocaleString()} rows
          </p>
        </header>

        <TitanicPassengersTable headers={headers} rows={rows} />

        <section className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="mb-6 text-center text-lg font-semibold text-slate-800">
            CSV 업로드
          </h2>
          <div className="flex justify-center">
            <TitanicCsvUpload />
          </div>
        </section>
      </div>
    </div>
  );
}
