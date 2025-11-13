"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}

export function GenericTable<T extends { _id?: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  actions,
}: GenericTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={cn(col.className)}>
                {col.label}
              </TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={String(item._id || Math.random())}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className={cn(col.className)}>
                    {col.render ? col.render(item) : (item[col.key as keyof T] as any)}
                  </TableCell>
                ))}
                {actions && <TableCell className="text-right">{actions(item)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
