'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

const COLS = 26; // A-Z
const ROWS = 100;

export default function Spreadsheet() {
  const [data, setData] = useState<Record<string, string>>({});

  const headers = useMemo(() => {
    const cols = [];
    for (let i = 0; i < COLS; i++) {
      cols.push(String.fromCharCode(65 + i));
    }
    return cols;
  }, []);

  const handleInputChange = (cell: string, value: string) => {
    setData(prev => ({ ...prev, [cell]: value }));
  };

  return (
    <div className="h-full overflow-auto bg-background text-sm">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-secondary z-10">
          <tr>
            <th className="p-1 border border-border w-12 sticky left-0 bg-secondary"></th>
            {headers.map(header => (
              <th key={header} className="p-1 border border-border font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <tr key={rowIndex}>
              <td className="p-1 border border-border font-medium w-12 sticky left-0 bg-secondary text-center">
                {rowIndex + 1}
              </td>
              {headers.map((colHeader, colIndex) => {
                const cellId = `${colHeader}${rowIndex + 1}`;
                return (
                  <td key={cellId} className="border border-border p-0">
                    <Input
                      type="text"
                      value={data[cellId] || ''}
                      onChange={(e) => handleInputChange(cellId, e.target.value)}
                      className="w-full h-full border-0 rounded-none focus:ring-1 focus:ring-ring p-1 text-sm"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
