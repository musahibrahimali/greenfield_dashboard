'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Farmer } from '@/lib/types';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Farmer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const farmer = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="font-medium">{farmer.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => row.getValue('region') || 'N/A',
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => {
      const joinDate = row.getValue('joinDate') as string | undefined;
      return joinDate ? format(new Date(joinDate), 'PPP') : 'N/A';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as 'Active' | 'Inactive' | undefined;
      return (
        <Badge variant={status === 'Active' ? 'default' : 'secondary'} className={status === 'Active' ? 'bg-primary/20 text-primary-foreground' : ''}>
          {status || 'Unknown'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'farmSize',
    header: () => <div className="text-right">Farm Size (acres)</div>,
    cell: ({ row }) => {
      const amount = row.getValue('farmSize') as number | undefined;
      return <div className="text-right font-medium">{amount ?? 'N/A'}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const farmer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(farmer.id)}
            >
              Copy Farmer ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Farmer</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete Farmer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
