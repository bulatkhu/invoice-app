import {Document, Packer, Paragraph, Table, AlignmentType, HeadingLevel, TableCell, TableRow} from 'docx'
// import {AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun} from 'docx'
// import { saveAs } from 'file-saver'

const customParagraph = new Paragraph({
  text: 'lorem lorem lorem lorem lorem lorem lorem lorem '
})

const table = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [customParagraph],
        }),
        new TableCell({
          children: [customParagraph],
        }),
      ],
    }),
  ],
});

const header = new Paragraph({
  text: 'Lasku',
  heading: HeadingLevel.TITLE,
  alignment: AlignmentType.CENTER,
})


export function docCreator() {
  const doc = new Document()

  doc.addSection({
    // headers: {
    //   default: new Header({
    //     children: [table],
    //   }),
    // },
    children: [
      header,
      table
    ],
  });
  // doc.addSection({
  //   children: [
  //     new Paragraph({
  //       text: "Dolan Miu",
  //       heading: HeadingLevel.TITLE,
  //     }),
  //     new Paragraph({
  //       text: 'Some paragraph',
  //       thematicBreak: true
  //     })
  //   ]
  // })


  return Packer.toBlob(doc)
}
