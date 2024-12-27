import React from 'react';
import { DataGrid } from '@/components/common/DataGrid';
import { type ColDef } from 'ag-grid-community';

interface MetricRow {
  id: string;
  name: string;
  value: number;
  change: number;
  status: 'up' | 'down' | 'neutral';
}

interface MetricsGridProps {
  data: MetricRow[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  const columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Metric', width: 150 },
    { field: 'value', headerName: 'Value', width: 120 },
    { field: 'change', headerName: 'Change', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        return (
          <span className={`status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    }
  ];

  return (
    <DataGrid
      rowData={data}
      columnDefs={columnDefs}
    />
  );
}; 
