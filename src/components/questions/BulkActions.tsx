import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, Download, Edit2 } from 'lucide-react';

interface BulkActionsProps {
  selectedIds: string[];
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onEdit: (ids: string[]) => void;
}

export function BulkActions({
  selectedIds,
  onDelete,
  onExport,
  onEdit
}: BulkActionsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onDelete(selectedIds)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport(selectedIds)}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(selectedIds)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Bulk Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 