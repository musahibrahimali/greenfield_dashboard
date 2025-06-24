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
import { UploadReportDialog } from '@/components/farmers/upload-report-dialog';

type FailedRecord = {
  rowIndex: number;
  rowData: string;
  error: string;
};

export default function FarmersPage() {
  const { toast } = useToast();
  const [farmers, setFarmers] = React.useState<Farmer[]>(mockFarmers);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [failedRecords, setFailedRecords] = React.useState<FailedRecord[]>([]);
  
  const handleExport = () => {
    const csvHeader = "ID,Name,Region,Gender,JoinDate,FarmSize,Status\n";
    const csvRows = farmers.map(f => 
      `${f.id},"${f.name}",${f.region || ''},${f.gender || ''},${f.joinDate || ''},${f.farmSize ?? ''},${f.status || ''}`
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
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCsv(text);
    };
    reader.readAsText(file);
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const processCsv = (csvText: string) => {
    const rows = csvText.split('\n').map(row => row.trim()).filter(row => row);
    if (rows.length < 2) {
      toast({ title: 'Error uploading file', description: 'CSV file is empty or has only a header.', variant: 'destructive' });
      return;
    }
    
    const header = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const expectedHeaders = ['ID', 'Name', 'Region', 'Gender', 'JoinDate', 'FarmSize', 'Status'];
    
    // A simple validation to check if all expected headers are present.
    const hasAllHeaders = expectedHeaders.every(h => header.includes(h));

    if (!hasAllHeaders) {
         toast({ title: 'Invalid CSV Header', description: 'CSV header is missing or does not match expected format: ' + expectedHeaders.join(', '), variant: 'destructive' });
         return;
    }
    
    const nameIndex = header.indexOf('Name');
    
    const newFarmers: Farmer[] = [];
    const localFailedRecords: FailedRecord[] = [];

    rows.slice(1).forEach((rowStr, index) => {
      if (!rowStr) return;
      const rowData = rowStr.split(',');
      
      // Validation: Farmer name is required.
      if (!rowData[nameIndex] || rowData[nameIndex].trim() === '') {
        localFailedRecords.push({ rowIndex: index + 2, rowData: rowStr, error: 'Farmer name is missing.' });
        return;
      }
      
      // Validation: FarmSize must be a valid number if present.
      const farmSizeStr = rowData[header.indexOf('FarmSize')]?.trim();
      const farmSize = farmSizeStr ? parseFloat(farmSizeStr) : undefined;
      if (farmSizeStr && isNaN(farmSize)) {
          localFailedRecords.push({ rowIndex: index + 2, rowData: rowStr, error: 'Invalid format for FarmSize.' });
          return;
      }
      
      // Validation: JoinDate must be a valid date if present.
      const joinDateStr = rowData[header.indexOf('JoinDate')]?.trim();
      if (joinDateStr && isNaN(new Date(joinDateStr).getTime())) {
          localFailedRecords.push({ rowIndex: index + 2, rowData: rowStr, error: 'Invalid format for JoinDate.' });
          return;
      }

      const farmer: Farmer = {
        id: rowData[header.indexOf('ID')]?.trim() || `FARM${Date.now()}${index}`,
        name: rowData[nameIndex].trim(),
        region: (rowData[header.indexOf('Region')]?.trim() as Farmer['region']) || undefined,
        gender: (rowData[header.indexOf('Gender')]?.trim() as Farmer['gender']) || undefined,
        joinDate: joinDateStr || undefined,
        farmSize: farmSize,
        status: (rowData[header.indexOf('Status')]?.trim() as Farmer['status']) || undefined,
      };
      
      newFarmers.push(farmer);
    });

    if (newFarmers.length > 0) {
      setFarmers(prev => [...prev, ...newFarmers]);
    }

    if (localFailedRecords.length > 0) {
      setFailedRecords(localFailedRecords);
      setIsReportOpen(true);
    }
    
    toast({
      title: 'Upload Processed',
      description: `${newFarmers.length} farmers added successfully. ${localFailedRecords.length} records failed.`,
      variant: localFailedRecords.length > 0 ? 'default' : 'default', // 'default' is fine for both cases
    });
  };


  return (
    <AppShell>
      <PageHeader 
        title="Farmer Management"
        description="View, add, edit, and manage all farmer records."
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" style={{ display: 'none' }} />
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
      <UploadReportDialog open={isReportOpen} onOpenChange={setIsReportOpen} failedRecords={failedRecords} />
    </AppShell>
  );
}
