import { Injectable } from '@angular/core';
import { Column } from '../../../../../libs/shared-template/src/lib/shared-template/shared/component/data-grid/interfaces/column';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  exportToPDF(data: any[], columns: Column[], title: string, fileName: string) {
    const doc = new jsPDF();

    doc.text(title, 14, 16);

    const visibleColumns = columns.filter(col => col.type !== 'hidden');
    const headers = visibleColumns.map(col => col.name);
    const rows = data.map(row =>
      visibleColumns.map(col => {
        const value = row[col.field];
        return this.formatValue(value, col.type);
      })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: {
        cellPadding: 3,
        fontSize: 8,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    doc.save(`${fileName}.pdf`);
  }

  private formatValue(value: any, type: string): string {
    if (value === null || value === undefined) return '';

    switch(type) {
      case 'numeric':
        return new Intl.NumberFormat().format(Number(value));
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value.toString();
    }
  }
}
