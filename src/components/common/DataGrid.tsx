import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

interface DataGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  onGridReady?: (event: GridReadyEvent) => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  rowData,
  columnDefs,
  onGridReady,
  onSelectionChanged,
}) => {
  return (
    <div className="ag-theme-alpine w-full h-[500px]">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        rowSelection="multiple"
        animateRows={true}
      />
    </div>
  );
}; 