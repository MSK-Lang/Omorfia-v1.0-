Omorfia : AI-Driven Precision Beauty Diagnostics
Automated Skin & Hair Analysis for Naturals Salon.

📌 Executive Summary

Omorfia  is a professional-grade diagnostic platform designed for Naturals Salon to bridge the gap between AI technology and personalized retail services. By analyzing 15 unique physiological markers via a standard webcam, Omorfia generates a Consultation Summary that maps specific concerns to professional in-salon treatments and home-care products.

🧠 The AI Diagnostic Pipeline (CV Heuristics)

This project prioritizes Deterministic Computer Vision over black-box models to ensure transparency and salon-grade reliability.

Luminance Normalization: Utilizes CLAHE (Contrast Limited Adaptive Histogram Equalization) in the LAB color space to normalize low-light laptop sensor data.

Texture & Pore Density: Calculated using Canny Edge Detection and the Laplacian Variance method to identify skin irregularities.

Sensitivity Mapping: Isotropic analysis of Red Channel ratios to identify localized inflammation and redness.

Confidence Scoring: A dynamic reliability metric based on the Signal-to-Noise ratio of the input source.

🚀 Key Features

Diagnostic Scan Suite: Real-time face mapping HUD with integrated lighting and blur guardrails for input validation.

Treatment Summary: A 15-point analysis visualized through interactive Radar (Spider) Charts and categorical progress bars.

Longitudinal Tracking: Persistent history tracking with automated delta analysis (e.g., +10.2% improvement) to monitor treatment efficacy over 30 days.

Service Mapping Engine: Automatically triggers appointment recommendations based on severity thresholds (e.g., Pore Density > 65% → Deep Cleansing Facial).

Professional UI: A high-contrast, minimalist interface featuring glassmorphism and midnight gradients, optimized for desktop and mobile.

🛠️ Tech Stack

Frontend

Framework: Next.js 14 (App Router)

Styling: Tailwind CSS

Data Vis: Recharts (Radar & Line Charts)

Motion: Framer Motion

Backend
Framework: FastAPI (Python)

Image Processing: OpenCV & NumPy

Deployment Ready: Pydantic-based request modeling for future LLM (Claude/GPT) integration.

📈 Business Impact

Lead Conversion: Automatically maps physiological concerns to Naturals’ service inventory.

Increased Ticket Size: Scientifically justifies upsells through data-backed recommendations.

Customer Retention: The "Diagnostic Trend" encourages repeat salon visits to track skin and hair evolution.

📄 License

Developed for the Naturals Salon X StartUpTN Beauty Hackathon 2026.
