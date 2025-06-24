import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Farmer } from '@/lib/types';
import { format } from 'date-fns';

type RecentFarmersTableProps = {
  farmers: Farmer[];
};

export function RecentFarmersTable({ farmers }: RecentFarmersTableProps) {
  const recentFarmers = farmers
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Recent Additions</CardTitle>
        <CardDescription>The latest farmers to join the network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Region</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFarmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell>
                  <div className="font-medium">{farmer.name}</div>
                  <div className="text-sm text-muted-foreground">{farmer.id}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{farmer.region}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(farmer.joinDate), 'PPP')}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={farmer.status === 'Active' ? 'default' : 'secondary'} className={farmer.status === 'Active' ? 'bg-primary/20 text-primary-foreground' : ''}>
                    {farmer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
