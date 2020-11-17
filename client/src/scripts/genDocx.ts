// eslint-disable-next-line
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  RelativeHorizontalPosition,
  RelativeVerticalPosition,
  Table,
  TableCell,
  TableRow,
  TabStopType,
  TextRun,
  WidthType
} from 'docx'
// import {AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun} from 'docx'
// import { saveAs } from 'file-saver'

const mockText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, cum.'


const cellSettings = {
  margins: {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100,
  },
  columnSpan: 1,
}


const table = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Laskun päiväys:'),
            new Paragraph(new Date().toLocaleDateString()),
          ],
          ...cellSettings
        }),
        new TableCell({
          width: {
            size: '50%'
          },
          children: [
            new Paragraph('Viivästyskorko:'),
            new Paragraph('8 %'),
          ],
          ...cellSettings
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Laskun numero:'),
            new Paragraph('LASKUN NUMERO'),
          ],
          ...cellSettings
        }),
        new TableCell({
          children: [
            new Paragraph('Viitenumero:'),
            new Paragraph('1 15235')
          ],
          ...cellSettings
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Sukunimi:'),
            new Paragraph('Asiakkaan sukunimi')
          ],
          ...cellSettings
        }),
        new TableCell({
          children: [
            new Paragraph('Etunimi:'),
            new Paragraph('Asiakkaan etunimi')
          ],
          ...cellSettings,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Lähiosoite:'),
            new Paragraph('Asiakkaan lähiosoite')
          ],
          ...cellSettings
        }),
        new TableCell({
          children: [
            new Paragraph('Postinumero:'),
            new Paragraph('Asiakkaan postinumero')
          ],
          ...cellSettings
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Laskun viesti:'),
            new Paragraph(mockText),
          ],
          ...cellSettings,
          columnSpan: 2
        })
      ]
    })
  ],
  float: {
    relativeHorizontalPosition: RelativeHorizontalPosition.RIGHT
  },
  width: {
    size: 50,
    type: WidthType.PERCENTAGE,
  },
  columnWidths: [500, 500, 500, 500],
});

const bottomTable = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('IBAN:'),
            new Paragraph('FI2131023001230213'),
          ],
          ...cellSettings,
        }),
        new TableCell({
          children: [
            new Paragraph('BIC/SWIFT:'),
            new Paragraph('OKOYFIHH'),
          ],
          ...cellSettings,
        }),
        new TableCell({
          children: [
            new Paragraph('Eräpäivä:'),
            new Paragraph('17.11.20'),
          ],
          ...cellSettings,
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Viitenumero:'),
            new Paragraph('100 02123'),
          ],
          ...cellSettings,
        }),
        new TableCell({
          children: [
            new Paragraph('Yhteensä EUR:'),
            new Paragraph('266,80'),
          ],
          ...cellSettings,
          columnSpan: 2
        })
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph('Laskuttava Yritys Oy:'),
            new Paragraph('Laskuttajantie 10'),
            new Paragraph('123456 Laskuttajankaupunki'),
          ],
          ...cellSettings,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun('Y-tunnus:'),
                new TextRun(' - '),
                new TextRun('1234567-8:'),
              ],
              tabStops: [
                {
                  type: TabStopType.CENTER,
                  position: 2268,
                },
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Puhelin:'),
                new TextRun(' - '),
                new TextRun('040123456'),
              ],
              tabStops: [
                {
                  type: TabStopType.CENTER,
                  position: 2268,
                },
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Sähköposti:'),
                new TextRun(' - '),
                new TextRun('sähköposti@osoite.com'),
              ],
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: 2268,
                },
              ],
            }),
          ],
          ...cellSettings,
          columnSpan: 2
        })
      ],
    })
  ],
  float: {
    relativeHorizontalPosition: RelativeHorizontalPosition.CENTER,
    relativeVerticalPosition: RelativeVerticalPosition.BOTTOM
  },
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },
  columnWidths: [500, 500, 500],
})

const paragraph = new Paragraph({
  children: [
    new TextRun({
      text: 'Lasku faktura',
      allCaps: true,
      bold: true
    }),
  ],
  alignment: AlignmentType.CENTER,
});

const paragraph2 = new Paragraph({
  children: [
    new TextRun({
      text: 'Yrityksen nimi ja osoite OY',
    }),
  ],
  tabStops: [
    {
      type: TabStopType.CENTER,
      position: 2268,
    },
  ],
});

const paragraph3 = new Paragraph({
  children: [
    new TextRun({
      text: 'Sukunimi ja etunimi',
    }),
  ],
  tabStops: [
    {
      type: TabStopType.CENTER,
      position: 2268,
    },
  ],
});


export function docCreator() {
  const doc = new Document()

  doc.addSection({
    children: [
      // header, header,
      paragraph,
      paragraph2,
      paragraph3,
      table,
      bottomTable
    ],
  });


  return Packer.toBlob(doc)
}
