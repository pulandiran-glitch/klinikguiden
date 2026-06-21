from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = "tjekliste_tandlaegebesoeg.pdf"


def checkbox_item(text):
    return ["[ ]", Paragraph(text, styles["Body"])]


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleKG",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#2C2C2C"),
        spaceAfter=12,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionKG",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#4E7A62"),
        spaceBefore=16,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#4F4F49"),
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["Body"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#7A7A72"),
    )
)


doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=22 * mm,
    leftMargin=22 * mm,
    topMargin=22 * mm,
    bottomMargin=20 * mm,
)

story = [
    Paragraph("Tjekliste til dit næste tandlægebesøg", styles["TitleKG"]),
    Paragraph(
        "Brug siden før, under og efter besøget, så du får de vigtigste spørgsmål med og bedre kan forstå det, du får at vide.",
        styles["Body"],
    ),
    Spacer(1, 8),
]

sections = [
    (
        "Før besøget",
        [
            "Skriv ned hvad du gerne vil spørge om.",
            "Tag billeder eller noter, hvis du har et bestemt område der gør ondt.",
            "Medbring medicinliste, hvis du tager fast medicin.",
            "Fortæl klinikken på forhånd, hvis du er nervøs eller har tandlægeangst.",
        ],
    ),
    (
        "Spørgsmål du kan stille i stolen",
        [
            "Hvad er problemet, forklaret i almindeligt sprog?",
            "Hvilke behandlingsmuligheder har jeg?",
            "Hvad sker der, hvis jeg venter?",
            "Hvad koster behandlingen cirka, og hvad dækker tilskud?",
            "Er der noget jeg selv kan gøre derhjemme?",
        ],
    ),
    (
        "Efter besøget",
        [
            "Bed om at få behandlingsplan og prisoverslag skriftligt, hvis der er mere end ét trin.",
            "Gem regningen, så du kan tjekke koder og tilskud bagefter.",
            "Skriv ned hvornår du skal kontakte klinikken ved smerter, hævelse eller blødning.",
            "Book næste tid, hvis du allerede ved at du skal følges op.",
        ],
    ),
]

for title, items in sections:
    story.append(Paragraph(title, styles["SectionKG"]))
    table = Table([checkbox_item(item) for item in items], colWidths=[10 * mm, 142 * mm])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#4E7A62")),
                ("FONTSIZE", (0, 0), (0, -1), 13),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(table)

story.extend(
    [
        Spacer(1, 14),
        Table(
            [
                [
                    Paragraph(
                        "<b>Noter:</b><br/><br/><br/><br/><br/><br/>",
                        styles["Body"],
                    )
                ]
            ],
            colWidths=[160 * mm],
        ),
        Spacer(1, 12),
        Paragraph(
            "KlinikGuiden - tandpleje forklaret af dem der kender den.",
            styles["Small"],
        ),
    ]
)

doc.build(story)
