import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TitanicPassengersTableProps = {
  headers: string[];
  rows: string[][];
};

export function TitanicPassengersTable({
  headers,
  rows,
}: TitanicPassengersTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-slate-50/80">
              {headers.map((header, colIndex) => (
                <TableCell
                  key={`${rowIndex}-${header}`}
                  className={
                    header === "Name"
                      ? "max-w-[280px] whitespace-normal px-3 py-2.5 text-slate-800"
                      : "px-3 py-2.5 text-slate-700"
                  }
                >
                  {row[colIndex] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
