import difflib
from typing import List, Dict, Any

class RedlineEngine:
    """
    Computes text diffs, track-changes style comparisons, and redline matrices.
    """

    @staticmethod
    def compute_diff(doc_a: str, doc_b: str) -> Dict[str, Any]:
        lines_a = [line.strip() for line in (doc_a or "").splitlines() if line.strip()]
        lines_b = [line.strip() for line in (doc_b or "").splitlines() if line.strip()]

        differ = difflib.Differ()
        diff = list(differ.compare(lines_a, lines_b))

        additions = 0
        deletions = 0
        unchanged = 0
        diff_entries: List[Dict[str, str]] = []

        for item in diff:
            code = item[:2]
            content = item[2:]
            if code == "+ ":
                additions += 1
                diff_entries.append({"type": "addition", "text": content})
            elif code == "- ":
                deletions += 1
                diff_entries.append({"type": "deletion", "text": content})
            elif code == "  ":
                unchanged += 1
                diff_entries.append({"type": "unchanged", "text": content})

        similarity_ratio = difflib.SequenceMatcher(None, doc_a, doc_b).ratio()

        return {
            "similarity_percentage": round(similarity_ratio * 100, 1),
            "stats": {
                "additions": additions,
                "deletions": deletions,
                "unchanged": unchanged
            },
            "diff_entries": diff_entries[:100]  # Cap for responsive payloads
        }

redline_engine = RedlineEngine()
