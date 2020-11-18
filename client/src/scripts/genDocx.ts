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


const cellSettings = {
  margins: {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100,
  },
  columnSpan: 1,
}

const sideTableSettings = {
  float: {
    relativeHorizontalPosition: RelativeHorizontalPosition.RIGHT
  },
  width: {
    size: 50,
    type: WidthType.PERCENTAGE,
  },
  columnWidths: [500, 500, 500, 500],
}


function createCellForTable(data) {
  return data.map(parag => new TableCell({
    children: parag.map(text => new Paragraph(text)),
    ...cellSettings
  }))
}


export class docCreator {
  nimi: any;
  sukunimi: any;
  puhelin: any;
  lähiosoite: any;
  postinumero: any;
  postitoimipaikka: any;
  eräpäivä: any;
  sähköposti: any;
  tilinumero: any;
  viitenumero: any;
  laskunviesti: any;
  sum: any

  constructor({sum, nimi, sukunimi, puhelin, lähiosoite, postinumero, postitoimipaikka, sähköposti, eräpäivä, tilinumero, laskunviesti, viitenumero}) {
    this.nimi = nimi
    this.sukunimi = sukunimi
    this.puhelin = puhelin
    this.lähiosoite = lähiosoite
    this.postinumero = postinumero
    this.postitoimipaikka = postitoimipaikka
    this.sähköposti = sähköposti
    this.eräpäivä = eräpäivä
    this.tilinumero = tilinumero
    this.laskunviesti = laskunviesti
    this.viitenumero = viitenumero
    this.sum = sum


    // this.

  }

  createDoc() {

    const doc = new Document()

    doc.addSection({
      children: [
        this.pageTitle('Lasku faktura'),
        this.aboutCompany('Espoon seudun koulutuskuntayhtymä Omnia'),
        this.customerData(this.nimi, this.sukunimi),
        this.sideTable(),
        this.bottomTable()
      ],
    });


    return Packer.toBlob(doc)

  }


  public pageTitle = text => new Paragraph({
    children: [
      new TextRun({
        text, allCaps: true,
        bold: true
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  public aboutCompany = (text = 'Yrityksen nimi ja osoite OY') =>  new Paragraph({
    children: [
      new TextRun({
        text
      }),
    ],
    tabStops: [
      {
        type: TabStopType.CENTER,
        position: 2268,
      },
    ],
  });

  public customerData = (nimi, sukunimi) => new Paragraph({
    children: [
      new TextRun({
        text: `${nimi} ${sukunimi}`,
      }),
    ],
    tabStops: [
      {
        type: TabStopType.CENTER,
        position: 2268,
      },
    ],
  });

  public bottomTable = () => new Table({
    rows: [
      new TableRow({
        children: [
          ...createCellForTable([
            ['IBAN:', 'FI2131023001230213'],
            ['BIC/SWIFT:', 'OKOYFIHH'],
            ['Eräpäivä:', this.eräpäivä]
          ])
        ]
      }),
      new TableRow({
        children: [
          ...createCellForTable([
            ['Viitenumero:', this.viitenumero],
          ]),
          new TableCell({
            children: [
              new Paragraph('Yhteensä EUR:'),
              new Paragraph(this.sum.toString()),
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
              }),
              new Paragraph({
                children: [
                  new TextRun('Puhelin:'),
                  new TextRun(' - '),
                  new TextRun('puhelinnumero'),
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
                  new TextRun(this.sähköposti),
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

  public sideTable = () => new Table({
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
              new Paragraph(this.viitenumero)
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
              new Paragraph(this.sukunimi)
            ],
            ...cellSettings
          }),
          new TableCell({
            children: [
              new Paragraph('Etunimi:'),
              new Paragraph(this.nimi)
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
              new Paragraph(this.lähiosoite)
            ],
            ...cellSettings
          }),
          new TableCell({
            children: [
              new Paragraph('Postinumero:'),
              new Paragraph(this.postinumero)
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
              new Paragraph(this.laskunviesti),
            ],
            ...cellSettings,
            columnSpan: 2
          })
        ]
      })
    ],
    ...sideTableSettings
  });

}
