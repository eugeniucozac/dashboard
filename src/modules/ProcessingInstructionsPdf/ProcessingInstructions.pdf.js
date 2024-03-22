// app
import { getData } from './ProcessingInstructions.pdf.helpers';
import * as utils from 'utils';

const downloadPDF = ({ ...props }) => {
  const { processingInstruction } = props;
  const pid = processingInstruction?.id || '';
  const pdf = createPDF(props);

  pdf.save(`Processing Instruction - PI${pid}.pdf`);
};

const savePDF = ({ ...props }) => {
  const pdf = createPDF(props);
  return pdf.output();
};

const createPDF = (props) => {
  const { labels, tableHeader, summaryBody, checklistBody, instructionBody, specialBody, approvalBody, attachedDocumentBody } =
    getData(props);
  const { processingInstruction } = props;
  const pid = processingInstruction?.id || '';
  const xPos = 15;

  // --- PAGE 1 ---
  let pdf = utils.pdf.createPdf();
  let yPosPage1 = utils.pdf.elementPosition(20);

  // --- SUMMARY SECTION ---
  pdf.setFontSize(12);
  pdf.text(`Processing Instruction - PI${pid}`, xPos, yPosPage1.current());
  pdf.setFontSize(8);

  utils.pdf.addTable(pdf, {
    body: summaryBody,
    startY: yPosPage1.move(),
    styles: { cellPadding: 0.3, fontSize: 10 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        utils.pdf.cellBold(data);
        data.cell.styles.cellWidth = 60;
      }
      if (data.cell.text[0] === '') {
        data.cell.styles.fontSize = 4;
      }
    },
  });

  // --- CHECKLIST SECTION ---
  pdf.setFontSize(6);
  utils.pdf.addTable(pdf, {
    head: tableHeader,
    body: checklistBody,
    didParseCell: (data) => {
      data.cell.styles.fontSize = 9;

      if (data.section === 'body') {
        if ([1, 2].includes(data.column.index)) {
          utils.pdf.cellAlignCenter(data);
        }
        if (data.section === 'body' && data.row.raw[1] === labels.na && data.column.index === 2) {
          data.cell.text = labels.na;
        }
        if ([0, 8, 16].includes(data.row.index)) {
          utils.pdf.cellSubHeader(data);
        }
      }
    },
  });

  // --- PAGE 2 ---

  // --- INSTRUCTION CHECKLIST ---
  pdf.setFontSize(10);

  utils.pdf.addTable(pdf, {
    head: tableHeader,
    body: instructionBody,
    didParseCell: (data) => {
      data.cell.styles.fontSize = 9;

      if ([1, 2].includes(data.column.index)) {
        utils.pdf.cellAlignCenter(data);
      }
      if (data.section === 'body' && data.row.raw[1] === labels.na && data.column.index === 2) {
        data.cell.text = labels.na;
      }
      if (data.section === 'body' && data.row.index === 0) {
        utils.pdf.cellSubHeader(data);
      }
      if (data.section === 'body' && [3, 4, 5, 13, 14, 15, 16, 17, 18].includes(data.row.index) && data.column.index === 0) {
        utils.pdf.cellBold(data);
      }
    },
  });
  // --- ATTACHED DOCUMENT SECTION ---
  pdf.setFontSize(12);
  pdf.text(labels.instructionToProcessing, xPos, pdf.autoTable.previous.finalY - 168);
  pdf.setFontSize(10);
  utils.pdf.addTable(pdf, {
    theme: 'grid',
    head: [[{ colSpan: 2, content: labels.attachedDocumentSectionHeader }]],
    body: attachedDocumentBody,
    didParseCell: (data) => {
      data.cell.styles.fontSize = 9;
      if (data.section === 'body' && data.row.index === 0) {
        utils.pdf.cellSubHeader(data);

        if (data.column.index === 1) {
          utils.pdf.cellAlignCenter(data);
        }
      }
    },
  });
  // --- SPECIAL INSTRUCTIONS ---
  pdf.setFontSize(10);
  utils.pdf.addTable(pdf, {
    head: [[{ colSpan: 2, content: labels.specialInstructionsHeader }]],
    body: specialBody,
    didParseCell: (data) => {
      data.cell.styles.fontSize = 9;

      if (data.section === 'body' && data.row.index > 1 && data.column.index === 0) {
        utils.pdf.cellBold(data);
      }
    },
  });

  // --- APPROVAL SECTION ---
  utils.pdf.addTable(pdf, {
    head: [['frontEndContactLabel', 'authorisedSignatory'].map((key) => labels[key])],
    body: approvalBody,
    didParseCell: (data) => {
      data.cell.styles.fontSize = 9;

      if (data.section === 'body' && data.row.index === 0) {
        utils.pdf.cellBold(data);
      }
    },
  });

  // --- RETURN PDF ---
  return pdf;
};

export { downloadPDF, savePDF };
