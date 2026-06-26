import csv from 'csv-parser';
import fs from 'fs';

export interface CsvRow {
  companyName: string;
  role: string;
  hrName: string;
  email: string;
  phone?: string;
  location?: string;
}

export function parseCsvFile(filePath: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const results: CsvRow[] = [];

    if (!fs.existsSync(filePath)) {
      reject(new Error('File not found'));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: Record<string, string>) => {
        const row: CsvRow = {
          companyName: data.companyName || '',
          role: data.role || '',
          hrName: data.hrName || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
        };
        if (row.companyName && row.role && row.hrName && row.email) {
          results.push(row);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}
