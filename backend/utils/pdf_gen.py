"""
PDF report generation utilities for Omorfia beauty passport exports.
"""

from __future__ import annotations

from datetime import datetime
from typing import Dict, Iterable

from fpdf import FPDF

BRAND_PURPLE = (91, 45, 142)
BRAND_ORANGE = (232, 97, 26)


def create_placeholder_report(output_path: str) -> None:
    """Generate a minimal PDF report scaffold."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=12)
    pdf.cell(0, 10, "Omorfia Beauty Passport (Placeholder)", new_x="LMARGIN", new_y="NEXT")
    pdf.output(output_path)


def _add_header(pdf: FPDF, customer_name: str) -> None:
    pdf.set_fill_color(*BRAND_PURPLE)
    pdf.rect(0, 0, 210, 30, style="F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", style="B", size=16)
    pdf.set_xy(10, 10)
    pdf.cell(0, 8, "Omorfia Beauty Roadmap", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", size=10)
    pdf.cell(0, 6, f"Customer: {customer_name}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_text_color(0, 0, 0)


def _add_section_title(pdf: FPDF, title: str) -> None:
    pdf.set_text_color(*BRAND_PURPLE)
    pdf.set_font("Helvetica", style="B", size=12)
    pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", size=10)


def _add_concern_table(pdf: FPDF, concern_scores: Dict[str, float]) -> None:
    sorted_items = sorted(concern_scores.items(), key=lambda item: item[1], reverse=True)
    pdf.set_fill_color(245, 235, 253)
    for concern, score in sorted_items:
        label = concern.replace("_", " ").title()
        pdf.cell(120, 7, label, border=1, fill=True)
        pdf.cell(30, 7, f"{float(score):.2f}", border=1, new_x="LMARGIN", new_y="NEXT")


def _add_multiline_lines(pdf: FPDF, lines: Iterable[str]) -> None:
    for line in lines:
        clean = line.strip()
        if not clean:
            pdf.ln(2)
            continue
        pdf.multi_cell(0, 6, clean)


def generate_beauty_roadmap_pdf(
    customer_name: str,
    total_beauty_score: float,
    concern_scores: Dict[str, float],
    home_care_plan_text: str,
    visit_date: str | None = None,
) -> bytes:
    """
    Generate branded Beauty Roadmap PDF and return bytes for download.
    """
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()

    _add_header(pdf, customer_name=customer_name or "Guest")
    _add_section_title(pdf, "Scan Snapshot")
    pdf.cell(
        0,
        6,
        f"Visit Date: {visit_date or datetime.now().strftime('%Y-%m-%d')}",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_text_color(*BRAND_ORANGE)
    pdf.set_font("Helvetica", style="B", size=12)
    pdf.cell(
        0,
        8,
        f"Total Beauty Score: {float(total_beauty_score):.2f}",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", size=10)
    pdf.ln(2)

    _add_section_title(pdf, "Concern Metrics")
    _add_concern_table(pdf, concern_scores=concern_scores)
    pdf.ln(3)

    _add_section_title(pdf, "Claude Home-Care Plan")
    _add_multiline_lines(pdf, home_care_plan_text.splitlines())

    return bytes(pdf.output(dest="S"))
