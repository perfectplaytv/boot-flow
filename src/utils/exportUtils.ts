import { agentLogger } from '@/lib/logger.agent';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const logger = agentLogger;

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

export const exportToCSV = (data: ExportData, filename: string = 'export'): void => {
  try {
    const csv = Papa.unparse({
      fields: data.headers,
      data: data.rows,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logger.info('CSV exportado com sucesso', { filename });
  } catch (error) {
    logger.error('Erro ao exportar CSV', { error: (error as Error).message });
    throw error;
  }
};

export const exportToPDF = async (
  data: ExportData,
  filename: string = 'export',
  options?: { orientation?: 'portrait' | 'landscape'; fontSize?: number },
): Promise<void> => {
  try {
    const doc = new jsPDF(options?.orientation || 'portrait');
    const fontSize = options?.fontSize || 12;

    doc.setFontSize(16);
    doc.text(data.title || 'Relatório', 14, 20);

    doc.setFontSize(fontSize);
    let y = 30;

    // Headers
    const colWidth = 180 / data.headers.length;
    data.headers.forEach((header, idx) => {
      doc.text(header, 14 + idx * colWidth, y);
    });

    y += 10;
    doc.line(14, y - 5, 194, y - 5);

    // Rows
    data.rows.forEach((row) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      row.forEach((cell, idx) => {
        doc.text(String(cell), 14 + idx * colWidth, y);
      });
      y += 7;
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    logger.info('PDF exportado com sucesso', { filename });
  } catch (error) {
    logger.error('Erro ao exportar PDF', { error: (error as Error).message });
    throw error;
  }
};

export const exportToJSON = (data: unknown, filename: string = 'export'): void => {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logger.info('JSON exportado com sucesso', { filename });
  } catch (error) {
    logger.error('Erro ao exportar JSON', { error: (error as Error).message });
    throw error;
  }
};

