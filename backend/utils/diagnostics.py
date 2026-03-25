"""
Diagnostics engine for beauty scoring and interpretation logic.
"""

from __future__ import annotations

import random
from typing import Any, Dict, Mapping

# 15-metric model grouped by requested category.
SKIN_METRICS = (
    "pore_density",
    "wrinkle_severity",
    "dark_spots_hyperpigmentation",
    "under_eye_circles",
    "skin_tone_unevenness",
)

HAIR_METRICS = (
    "scalp_dryness_oiliness",
    "hair_texture",
    "frizz_index",
    "hair_density",
    "split_end_indicator",
)

LIFESTYLE_METRICS = (
    "skin_age_estimate",
    "uv_damage_score",
    "hydration_level",
    "sebum_production",
    "barrier_health_index",
)

CONCERN_KEYS = SKIN_METRICS + HAIR_METRICS + LIFESTYLE_METRICS

CATEGORY_METRICS = {
    "skin": SKIN_METRICS,
    "hair": HAIR_METRICS,
    "lifestyle": LIFESTYLE_METRICS,
}

# Backward compatibility for pre-existing payloads and UI fields.
LEGACY_KEY_ALIASES = {
    "high_pore_density": "pore_density",
    "hyperpigmentation": "dark_spots_hyperpigmentation",
    "dark_circles": "under_eye_circles",
    "texture_irregularity": "skin_tone_unevenness",
    "scalp_dryness": "scalp_dryness_oiliness",
    "hair_frizz_index": "frizz_index",
    "uv_damage": "uv_damage_score",
    "hydration_loss": "hydration_level",
    "oil_imbalance": "sebum_production",
    "barrier_health": "barrier_health_index",
}

DEFAULT_CATEGORY_WEIGHTS: Dict[str, float] = {
    "skin": 1.0 / 3.0,
    "hair": 1.0 / 3.0,
    "lifestyle": 1.0 / 3.0,
}

# Derived metric weights for Total Beauty Score = sum(w_i * C_i).
DEFAULT_CONCERN_WEIGHTS: Dict[str, float] = {
    metric: DEFAULT_CATEGORY_WEIGHTS[category] / len(metrics)
    for category, metrics in CATEGORY_METRICS.items()
    for metric in metrics
}

NAMEPLATE_RULES = {
    "pore_density": {
        "display_name": "High pore density",
        "severity_threshold": 65.0,
        "recommended_service": "Deep Cleansing Facial",
        "home_care_product": "Salicylic acid toner",
    },
    "scalp_dryness_oiliness": {
        "display_name": "Scalp dryness",
        "severity_threshold": 70.0,
        "recommended_service": "Hydra Hair Spa",
        "home_care_product": "Argan oil serum",
    },
    "dark_spots_hyperpigmentation": {
        "display_name": "Hyperpigmentation",
        "severity_threshold": 60.0,
        "recommended_service": "Tan Removal Treatment",
        "home_care_product": "Vitamin C serum",
    },
    "wrinkle_severity": {
        "display_name": "Wrinkle severity",
        "severity_threshold": 55.0,
        "recommended_service": "Anti-Ageing Facial",
        "home_care_product": "Retinol night cream",
    },
    "frizz_index": {
        "display_name": "Hair frizz index",
        "severity_threshold": 60.0,
        "recommended_service": "Keratin Smoothing",
        "home_care_product": "Leave-in conditioner",
    },
}


def _normalize_scores(concern_scores: Mapping[str, float]) -> Dict[str, float]:
    """Map legacy keys into the new 15-metric vocabulary."""
    normalized: Dict[str, float] = {}
    for key, value in concern_scores.items():
        mapped_key = LEGACY_KEY_ALIASES.get(key, key)
        if mapped_key in CONCERN_KEYS:
            normalized[mapped_key] = float(value)
    return normalized


def _normalized_weights(weights: Mapping[str, float] | None = None) -> Dict[str, float]:
    """Return positive normalized weights for all 15 concerns."""
    base = dict(DEFAULT_CONCERN_WEIGHTS)
    if weights:
        base.update(weights)

    clean_weights = {key: max(0.0, float(base.get(key, 0.0))) for key in CONCERN_KEYS}
    total_weight = sum(clean_weights.values())
    if total_weight <= 0:
        fallback = 1.0 / len(CONCERN_KEYS)
        return {key: fallback for key in CONCERN_KEYS}
    return {key: value / total_weight for key, value in clean_weights.items()}


def compute_total_beauty_score(
    concern_scores: Mapping[str, float],
    weights: Mapping[str, float] | None = None,
) -> float:
    """
    Compute weighted beauty score using:
    Total Beauty Score = sum(w_i * C_i)

    Missing concerns default to 0.0.
    """
    normalized_scores = _normalize_scores(concern_scores)
    normalized_weights = _normalized_weights(weights)
    weighted_total = sum(
        normalized_weights[concern] * float(normalized_scores.get(concern, 0.0))
        for concern in CONCERN_KEYS
    )
    return round(weighted_total, 2)


def calculate_total_score(
    concern_scores: Mapping[str, float],
    category_weights: Mapping[str, float] | None = None,
) -> float:
    """
    Calculate Total Beauty Score using category-aware metric weights:
    Total Beauty Score = sum(w_i * C_i)
    """
    if category_weights:
        metric_weights: Dict[str, float] = {}
        positive_categories = {
            name: max(0.0, float(category_weights.get(name, 0.0)))
            for name in CATEGORY_METRICS
        }
        total = sum(positive_categories.values())
        if total <= 0:
            positive_categories = dict(DEFAULT_CATEGORY_WEIGHTS)
            total = sum(positive_categories.values())
        normalized_category_weights = {
            name: value / total for name, value in positive_categories.items()
        }
        for category, metrics in CATEGORY_METRICS.items():
            per_metric_weight = normalized_category_weights[category] / len(metrics)
            for metric in metrics:
                metric_weights[metric] = per_metric_weight
        return compute_total_beauty_score(concern_scores, weights=metric_weights)
    return compute_total_beauty_score(concern_scores)


def generate_mock_scan_result(seed: int | None = None) -> Dict[str, Any]:
    """
    Build randomized mock scan payload for UI testing without YouCam credentials.
    """
    rng = random.Random(seed)
    concern_scores = {
        concern: round(rng.uniform(35.0, 95.0), 2) for concern in CONCERN_KEYS
    }
    total_score = calculate_total_score(concern_scores)
    return {
        "scan_type": "mock",
        "source": "mock-generator",
        "concerns": concern_scores,
        "categories": {
            "skin": {metric: concern_scores[metric] for metric in SKIN_METRICS},
            "hair": {metric: concern_scores[metric] for metric in HAIR_METRICS},
            "lifestyle": {metric: concern_scores[metric] for metric in LIFESTYLE_METRICS},
        },
        "category_weights": DEFAULT_CATEGORY_WEIGHTS,
        "weights": _normalized_weights(),
        "total_beauty_score": total_score,
        "nameplate_recommendations": derive_nameplate_recommendations(concern_scores),
    }


def derive_nameplate_recommendations(
    concern_scores: Mapping[str, float],
) -> list[Dict[str, Any]]:
    """
    Build recommendation rows aligned with the nameplate table.
    """
    recommendations: list[Dict[str, Any]] = []
    for concern_key, rule in NAMEPLATE_RULES.items():
        score = float(concern_scores.get(concern_key, 0.0))
        if score > float(rule["severity_threshold"]):
            recommendations.append(
                {
                    "concern_detected": rule["display_name"],
                    "severity_threshold": f"> {int(rule['severity_threshold'])}",
                    "score": round(score, 2),
                    "recommended_service": rule["recommended_service"],
                    "home_care_product": rule["home_care_product"],
                }
            )
    return recommendations


def compute_overall_score(metrics: Dict[str, float]) -> float:
    """
    Backward-compatible wrapper using weighted concern model.
    """
    if not metrics:
        return 0.0
    return calculate_total_score(metrics)
