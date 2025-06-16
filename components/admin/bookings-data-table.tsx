"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingDetailsModal } from "./booking-details-modal"
import type { Booking } from "@/lib/data-service"

interface BookingsDataTableProps {
  bookings: Booking[]
}

export function BookingsDataTable({ bookings }: BookingsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue<string>("id").slice(0, 8)}...</div>,
    },
    {
      accessorKey: "item.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-gray-300 hover:text-white"
          >
            Item Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.original.item?.name}</div>,
    },
    {
      accessorKey: "renter.full_name",
      header: "Renter",
      cell: ({ row }) => <div>{row.original.renter?.full_name}</div>,
    },
    {
      accessorKey: "owner.full_name",
      header: "Owner",
      cell: ({ row }) => <div>{row.original.owner?.full_name}</div>,
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-gray-300 hover:text-white"
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{new Date(row.getValue<string>("start_date")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => <div>{new Date(row.getValue<string>("end_date")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-gray-300 hover:text-white"
          >
            Total Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-semibold">${row.getValue<number>("total_price")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<string>("status")
        return (
          <Badge
            variant={
              status === "confirmed" || status === "active"
                ? "default"
                : status === "completed"
                  ? "secondary"
                  : "destructive"
            }
            className={
              status === "confirmed" || status === "active"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : status === "completed"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-gray-300 hover:text-white"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{new Date(row.getValue<string>("created_at")).toLocaleDateString()}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBooking(row.original)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Bookings Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by item name..."
                value={(table.getColumn("item_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("item_name")?.setFilterValue(event.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-700">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-800/50">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-gray-300">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-gray-700 hover:bg-gray-800/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-gray-400">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  )
}
