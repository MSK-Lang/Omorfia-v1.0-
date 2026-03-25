"""
External API integration layer.

Responsibilities:
- Manage YouCam and Claude request helpers.
- Encapsulate authentication from environment variables.
- Return normalized payloads for UI and diagnostics modules.
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

from anthropic import Anthropic


def get_api_keys() -> Dict[str, str]:
    """Load API keys from environment variables."""
    return {
        "youcam_api_key": os.getenv("YOUCAM_API_KEY", ""),
        "claude_api_key": os.getenv("CLAUDE_API_KEY", ""),
    }


def call_youcam_stub(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Placeholder for YouCam API call.

    Replace this with `requests.post(...)` implementation when endpoint details
    are finalized.
    """
    _ = payload
    return {"status": "stub", "provider": "youcam", "result": {}}


def call_claude_stub(prompt: str) -> Dict[str, Any]:
    """
    Placeholder for Claude API call.

    Replace with Anthropic SDK integration once prompt flow is finalized.
    """
    _ = prompt
    return {"status": "stub", "provider": "claude", "response": ""}


NATURALS_SYSTEM_PROMPT = """
You are a Senior Beauty Consultant at Naturals Salon.

You will receive 15 concern scores (0-100; higher means more severe) plus user lifestyle markers.
Create practical, safety-aware recommendations that prioritize skin barrier support and UV care.

Hard constraints:
1) Recommend at least 2 specific services from the Naturals menu below.
2) Explain why each chosen service matches the concern profile.
3) Return a clean "Home-Care Plan" with clear Morning and Evening routines.
4) Keep recommendations concise, realistic, and non-medical.

Naturals service menu:
- Deep Cleansing Facial
- Hydra Hair Spa
- Tan Removal Treatment
- Anti-Ageing Facial
- Keratin Smoothing
- Barrier Repair Facial
- Brightening Facial
- Scalp Detox Therapy
""".strip()

NATURALS_MENU = [
    "Deep Cleansing Facial",
    "Hydra Hair Spa",
    "Tan Removal Treatment",
    "Anti-Ageing Facial",
    "Keratin Smoothing",
    "Barrier Repair Facial",
    "Brightening Facial",
    "Scalp Detox Therapy",
]

FALLBACK_SERVICES = ["Deep Cleansing Facial", "Barrier Repair Facial"]


def _extract_text_from_anthropic_response(response: Any) -> str:
    """Extract text from Anthropic messages API response blocks."""
    chunks: list[str] = []
    for block in getattr(response, "content", []):
        block_text = getattr(block, "text", "")
        if block_text:
            chunks.append(block_text)
    return "\n".join(chunks).strip()


def _ensure_minimum_service_recommendations(plan_text: str) -> str:
    """Ensure output references at least two Naturals services."""
    mentioned = [service for service in NATURALS_MENU if service in plan_text]
    if len(mentioned) >= 2:
        return plan_text

    missing_services = [service for service in FALLBACK_SERVICES if service not in mentioned]
    service_lines = "\n".join(f"- {service}" for service in missing_services)
    enforcement_note = (
        "\n\nRecommended Naturals Services (Guaranteed minimum):\n"
        f"{service_lines}\n"
        "- These are included to ensure at least two concrete in-salon service options."
    )
    return f"{plan_text}{enforcement_note}"


def build_claude_beauty_prompt(
    concern_scores: Dict[str, float],
    lifestyle_markers: Dict[str, Any],
    customer_profile: Dict[str, Any] | None = None,
) -> str:
    """
    Map concern and lifestyle data into a structured Claude user prompt.
    """
    payload = {
        "customer_profile": customer_profile or {},
        "concern_scores": concern_scores,
        "lifestyle_markers": lifestyle_markers,
        "output_format": {
            "title": "Home-Care Plan",
            "sections": [
                "Top Concerns",
                "Recommended Naturals Services (at least 2)",
                "Morning Routine",
                "Evening Routine",
                "Weekly Add-ons",
            ],
        },
    }
    return (
        "Generate a personalized beauty recommendation package.\n"
        "Data payload:\n"
        f"{json.dumps(payload, indent=2)}"
    )


def generate_home_care_plan_with_claude(
    concern_scores: Dict[str, float],
    lifestyle_markers: Dict[str, Any],
    customer_profile: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    Send concern + lifestyle data to Claude and return Home-Care Plan content.
    """
    api_key = get_api_keys().get("claude_api_key", "")
    if not api_key:
        return {
            "status": "missing_api_key",
            "provider": "claude",
            "response": (
                "Home-Care Plan\n\nMorning Routine\n- Cleanser\n- Vitamin C serum\n- "
                "Moisturizer\n- SPF 50\n\nEvening Routine\n- Gentle cleanser\n- "
                "Barrier-support serum\n- Moisturizer\n\nRecommended Naturals Services "
                "(Guaranteed minimum):\n- Deep Cleansing Facial\n- Barrier Repair Facial"
            ),
        }

    user_prompt = build_claude_beauty_prompt(
        concern_scores=concern_scores,
        lifestyle_markers=lifestyle_markers,
        customer_profile=customer_profile,
    )

    client = Anthropic(api_key=api_key)
    response = client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=900,
        system=NATURALS_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    plan_text = _extract_text_from_anthropic_response(response)
    plan_text = _ensure_minimum_service_recommendations(plan_text)

    return {
        "status": "success",
        "provider": "claude",
        "response": plan_text,
        "model": "claude-3-5-sonnet-latest",
    }


DB_PATH = Path(__file__).resolve().parent.parent / "data" / "omorfia_db.sqlite"

SCAN_METRIC_COLUMNS = {
    # Skin
    "pore_density": "REAL",
    "wrinkle_severity": "REAL",
    "dark_spots_hyperpigmentation": "REAL",
    "under_eye_circles": "REAL",
    "skin_tone_unevenness": "REAL",
    # Hair
    "scalp_dryness_oiliness": "REAL",
    "hair_texture": "REAL",
    "frizz_index": "REAL",
    "hair_density": "REAL",
    "split_end_indicator": "REAL",
    # Lifestyle
    "skin_age_estimate": "REAL",
    "uv_damage_score": "REAL",
    "hydration_level": "REAL",
    "sebum_production": "REAL",
    "barrier_health_index": "REAL",
    # Optional category-level snapshots
    "skin_metrics_json": "TEXT",
    "hair_metrics_json": "TEXT",
    "lifestyle_metrics_json": "TEXT",
}


def get_db_connection(db_path: str | Path | None = None) -> sqlite3.Connection:
    """Create SQLite connection with row factory enabled."""
    resolved_path = Path(db_path) if db_path else DB_PATH
    resolved_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(resolved_path)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database_schema(db_path: str | Path | None = None) -> str:
    """
    Create core PRD tables:
    - customers
    - scans
    - recommendations
    """
    schema_sql = """
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        external_customer_id TEXT UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        scan_provider TEXT NOT NULL,
        image_uri TEXT,
        raw_result_json TEXT,
        total_beauty_score REAL,
        concern_scores_json TEXT,
        pore_density REAL,
        wrinkle_severity REAL,
        dark_spots_hyperpigmentation REAL,
        under_eye_circles REAL,
        skin_tone_unevenness REAL,
        scalp_dryness_oiliness REAL,
        hair_texture REAL,
        frizz_index REAL,
        hair_density REAL,
        split_end_indicator REAL,
        skin_age_estimate REAL,
        uv_damage_score REAL,
        hydration_level REAL,
        sebum_production REAL,
        barrier_health_index REAL,
        skin_metrics_json TEXT,
        hair_metrics_json TEXT,
        lifestyle_metrics_json TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        scan_id INTEGER,
        title TEXT NOT NULL,
        category TEXT,
        rationale TEXT,
        priority INTEGER DEFAULT 3,
        recommendation_json TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE SET NULL
    );
    """

    with get_db_connection(db_path) as connection:
        connection.executescript(schema_sql)
        _migrate_scans_table_columns(connection)
        connection.commit()

    return str(Path(db_path) if db_path else DB_PATH)


def _utc_now_iso() -> str:
    """Return UTC timestamp as ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


def _migrate_scans_table_columns(connection: sqlite3.Connection) -> None:
    """
    Add missing scan metric columns without removing or rewriting existing data.
    """
    existing_columns = {
        row["name"] for row in connection.execute("PRAGMA table_info(scans)").fetchall()
    }
    for column_name, sqlite_type in SCAN_METRIC_COLUMNS.items():
        if column_name not in existing_columns:
            connection.execute(
                f"ALTER TABLE scans ADD COLUMN {column_name} {sqlite_type}"
            )
