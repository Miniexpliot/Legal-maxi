import json
from typing import Dict, Any

class ExportService:
    """
    Export generator compiling legal summaries, risk audit tables, and checklists.
    """

    @staticmethod
    def generate_html_report(title: str, content: str, metadata: Dict[str, Any] = None) -> str:
        meta_html = ""
        if metadata:
            meta_items = "".join([f"<li><strong>{k}:</strong> {v}</li>" for k, v in metadata.items()])
            meta_html = f"<div class='metadata'><ul>{meta_items}</ul></div>"

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} — Legal-Max Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 850px;
            margin: 40px auto;
            padding: 0 20px;
        }}
        h1, h2, h3 {{ color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .disclaimer {{
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 12px 16px;
            margin: 20px 0;
            font-size: 0.9em;
            color: #991b1b;
        }}
        .metadata {{ background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ border: 1px solid #cbd5e1; padding: 10px; text-align: left; }}
        th {{ background: #f1f5f9; }}
        @media print {{ body {{ margin: 0; padding: 15mm; }} }}
    </style>
</head>
<body>
    <div class="header">
        <h1>⚖️ Legal-Max Intelligence Report</h1>
        <p><em>{title}</em></p>
    </div>
    <div class="disclaimer">
        <strong>IMPORTANT LEGAL NOTICE:</strong> This report is AI-generated for educational and informational assistance only. It does not constitute formal legal advice. Consult a qualified attorney for specific legal situations.
    </div>
    {meta_html}
    <div class="content">
        <pre style="white-space: pre-wrap; font-family: inherit;">{content}</pre>
    </div>
</body>
</html>"""

export_service = ExportService()
