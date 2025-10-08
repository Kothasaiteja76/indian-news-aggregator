import jsPDF from 'jspdf';
import { NewsArticle, Note } from '../types';

export const generateNewsPDF = (articles: NewsArticle[], notes: Note[]): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('News Automata Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Headlines', margin, yPosition);
  yPosition += 10;

  articles.forEach((article, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(`${index + 1}. ${article.title}`, maxWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Source: ${article.source.name} | ${new Date(article.publishedAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += 6;

    if (article.description) {
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(article.description, maxWidth);
      doc.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5;
    }

    yPosition += 8;
  });

  if (notes.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    } else {
      yPosition += 10;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('My Notes', margin, yPosition);
    yPosition += 10;

    notes.forEach((note, index) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const headlineLines = doc.splitTextToSize(`${index + 1}. ${note.headline}`, maxWidth);
      doc.text(headlineLines, margin, yPosition);
      yPosition += headlineLines.length * 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(note.content, maxWidth);
      doc.text(noteLines, margin, yPosition);
      yPosition += noteLines.length * 5;

      doc.setFont('helvetica', 'italic');
      doc.text(`Source: ${note.source} | ${new Date(note.createdAt).toLocaleDateString()}`, margin, yPosition);
      yPosition += 8;
    });
  }

  doc.save(`news-automata-${new Date().toISOString().split('T')[0]}.pdf`);
};