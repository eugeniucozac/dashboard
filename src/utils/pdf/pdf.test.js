import utilsPDF from './pdf';
import * as jsPDF from 'jspdf';

jest.mock('jspdf');

describe('UTILS › pdf', () => {
  // describe('createPdf', () => {
  //   it('should create an instance of jsPDF with default params', () => {
  //     // act
  //     utilsPDF.createPdf();

  //     //assert
  //     expect(jsPDF).toHaveBeenCalledWith('p', 'mm', 'a4');
  //   });

  //   it('should create an instance of jsPDF with custom params', () => {
  //     // act
  //     utilsPDF.createPdf('foo', 'inches', 'a1');

  //     //assert
  //     expect(jsPDF).toHaveBeenCalledWith('foo', 'inches', 'a1');
  //   });
  // });

  describe('elementPosition', () => {
    it('return element position object', () => {
      //assert
      expect(utilsPDF.elementPosition(100)).toHaveProperty(['current']);
      expect(utilsPDF.elementPosition(100)).toHaveProperty(['move']);
    });

    it('return element position current value', () => {
      //assert
      expect(utilsPDF.elementPosition(100).current()).toBe(100);
    });

    it('return element position move value', () => {
      //assert
      expect(utilsPDF.elementPosition(100).move()).toBe(105);
      expect(utilsPDF.elementPosition(100).move(20)).toBe(120);
    });
  });

  describe('addTable', () => {
    it('calls the pdf object autoTable() method', () => {
      // arrange
      const pdfObj = {
        autoTable: jest.fn(),
      };

      // act
      utilsPDF.addTable(pdfObj, { foo: 1, bar: 2 });

      //assert
      expect(pdfObj.autoTable).toHaveBeenCalledWith({
        headStyles: {
          fillColor: '#334762',
          valign: 'middle',
          halign: 'center',
        },
        bodyStyles: {
          lineColor: '#e0e0e0',
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: '#fff',
        },
        foo: 1,
        bar: 2,
      });
    });
  });

  describe('cellAlignCenter', () => {
    it('update the styles to align the cell content', () => {
      // arrange
      const data = {
        cell: {
          styles: {
            halign: '1',
            valign: '2',
          },
        },
      };

      // act
      utilsPDF.cellAlignCenter(data);

      //assert
      expect(data).toHaveProperty('cell.styles.halign', 'center');
      expect(data).toHaveProperty('cell.styles.valign', 'middle');
    });
  });

  describe('cellSubHeader', () => {
    it('update the styles to be a subheader', () => {
      // arrange
      const data = {
        cell: {
          styles: {
            fillColor: '1',
            fontStyle: '2',
          },
        },
      };

      // act
      utilsPDF.cellSubHeader(data);

      //assert
      expect(data).toHaveProperty('cell.styles.fillColor', '#e0e0e0');
      expect(data).toHaveProperty('cell.styles.fontStyle', 'bold');
    });
  });

  describe('cellBold', () => {
    it('update the styles to be bold', () => {
      // arrange
      const data = {
        cell: {
          styles: {
            fontStyle: '1',
          },
        },
      };

      // act
      utilsPDF.cellBold(data);

      //assert
      expect(data).toHaveProperty('cell.styles.fontStyle', 'bold');
    });
  });
});
