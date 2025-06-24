'use client';

import * as React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle, Upload } from 'lucide-react';
import { FarmerDataTable } from '@/components/farmers/farmer-data-table';
import { columns } from '@/components/farmers/farmer-columns';
import { mockFarmers } from '@/lib/mock-data';
import type { Farmer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function FarmersPage() {
  const { toast } = useToast();
  const [farmers, setFarmers] = React.useState<Farmer[]>(mockFarmers);
  
  const handleExport = () => {
    const csvHeader = "ID,Name,Region,Gender,JoinDate,FarmSize,Status\n";
    const csvRows = farmers.map(f => 
      `${f.id},"${f.name}",${f.region},${f.gender},${f.joinDate},${f.farmSize},${f.status}`
    ).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "farmers_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: 'Export Successful',
      description: 'Farmer data has been exported to CSV.',
    });
  };
  
  const handleUploadClick = () => {
    // This would trigger a file input dialog.
    // The parsing logic would require a library like 'xlsx'
    toast({
      title: 'Upload Feature',
      description: 'Implement file upload and parsing logic here.',
      variant: 'default',
    });
  };


  return (
    <AppShell>
      <PageHeader 
        title="Farmer Management"
        description="View, add, edit, and manage all farmer records."
      >
        <Button variant="outline" onClick={handleUploadClick}>
          <Upload className="mr-2" />
          Upload
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2" />
          Export
        </Button>
        <Button>
          <PlusCircle className="mr-2" />
          Add Farmer
        </Button>
      </PageHeader>
      
      <div className="grid gap-6">
        <FarmerDataTable columns={columns} data={farmers} />
      </div>
    </AppShell>
  );
}
