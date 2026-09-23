from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Templates & Playbooks"])

TEMPLATES = [
    {
        "id": "mutual-nda",
        "title": "Mutual Non-Disclosure Agreement (Standard)",
        "category": "Confidentiality",
        "description": "Bilateral protection for proprietary commercial secrets with 3-year survival and reasonable care standard.",
        "variables": ["DisclosingParty", "ReceivingParty", "Jurisdiction", "TermYears"]
    },
    {
        "id": "freelance-services",
        "title": "Independent Contractor / Freelance Agreement",
        "category": "Employment & Services",
        "description": "Clear intellectual property assignment upon full payment with 30-day cure window and liability cap.",
        "variables": ["ClientName", "ContractorName", "PaymentRate", "PaymentTermDays"]
    },
    {
        "id": "residential-lease",
        "title": "Standard Residential Tenancy Agreement",
        "category": "Real Estate",
        "description": "Standard tenant protections, security deposit escrow obligations, and habitability covenants.",
        "variables": ["LandlordName", "TenantName", "MonthlyRent", "SecurityDeposit", "NoticeDays"]
    },
    {
        "id": "cease-desist",
        "title": "Cease & Desist Notice (IP / Defamation)",
        "category": "Enforcement",
        "description": "Formal pre-litigation demand letter with 10-day cure deadline and preservation of remedies.",
        "variables": ["ClaimantName", "InfringingParty", "InfringingWork", "DemandDeadline"]
    }
]

@router.get("/templates")
def get_templates():
    return {
        "success": True,
        "count": len(TEMPLATES),
        "templates": TEMPLATES
    }
