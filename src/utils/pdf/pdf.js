import jsPDF from 'jspdf';
import 'jspdf-autotable';

// app
import theme from 'theme';

const utilsPdf = {
  createPdf: (orientation = 'p', unit = 'mm', format = 'a4') => new jsPDF(orientation, unit, format),

  elementPosition: (initialPosition, spacing = 5) => {
    let _y = initialPosition;
    return {
      current: () => _y,
      move: (spacingOverride) => {
        _y += spacingOverride || spacing;
        return _y;
      },
    };
  },

  addTable: (pdfObj, options) => {
    pdfObj.autoTable({
      headStyles: { fillColor: theme.palette.primary.main, valign: 'middle', halign: 'center' },
      bodyStyles: {
        lineColor: theme.palette.grey[300],
        lineWidth: 0.1,
      },
      alternateRowStyles: { fillColor: '#fff' },
      ...options,
    });
  },

  cellAlignCenter: (data) => {
    data.cell.styles.halign = 'center';
    data.cell.styles.valign = 'middle';
  },

  cellSubHeader: (data) => {
    data.cell.styles.fillColor = theme.palette.grey[300];
    data.cell.styles.fontStyle = 'bold';
  },

  cellBold: (data) => {
    data.cell.styles.fontStyle = 'bold';
  },

  cellWrap: (data) => {
    data.cell.styles.cellWidth = 'wrap';
  },
};

export default utilsPdf;
