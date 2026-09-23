export const LEGAL_GLOSSARY = [
  {
    term: "Arbitration",
    definition: "A method of alternative dispute resolution where a neutral third party (an arbitrator) makes a binding decision outside of court.",
    plainExplanation: "Instead of going to a public judge and court, you present your dispute to a private decision-maker whose choice is final.",
    category: "Dispute Resolution"
  },
  {
    term: "Indemnification",
    definition: "A contractual obligation of one party to compensate the other for losses, damages, or liabilities incurred.",
    plainExplanation: "A promise that 'If someone sues you because of something I did, I will pay your legal fees and damages.'",
    category: "Liability & Risk"
  },
  {
    term: "Liquidated Damages",
    definition: "A predetermined amount of money agreed upon by parties during contract formation to be paid as damages in the event of a breach.",
    plainExplanation: "A pre-agreed fine fixed in the contract if one party breaks a specific rule, avoiding the need to prove exact money lost.",
    category: "Breach & Penalties"
  },
  {
    term: "Force Majeure",
    definition: "A clause freeing both parties from liability or obligation when an extraordinary event beyond control (unforeseen circumstances) occurs.",
    plainExplanation: "An 'Act of God' clause (like natural disasters, war, pandemic) that pauses contract rules when impossible events happen.",
    category: "Contract Terms"
  },
  {
    term: "Non-Disclosure Agreement (NDA)",
    definition: "A legal contract establishing a confidential relationship where parties agree not to disclose specified information.",
    plainExplanation: "A secrecy contract: you share private business details, but neither side can tell anyone else or use it for themselves.",
    category: "Agreements"
  },
  {
    term: "Severability",
    definition: "A clause stating that if any provision of the contract is found unenforceable, the remainder of the contract stays in full effect.",
    plainExplanation: "If a judge decides line #4 of the agreement is illegal, lines #1-3 and #5-10 still remain valid.",
    category: "General Provisions"
  },
  {
    term: "Jurisdiction & Governing Law",
    definition: "Provisions designating which state or court's laws govern contract disputes and where lawsuits must be filed.",
    plainExplanation: "Sets the home state court and local laws that will be used if the contract parties ever sue each other.",
    category: "Legal Framework"
  },
  {
    term: "Waiver of Liability",
    definition: "A legal document or clause where a person surrenders their right to sue another party for damages or injuries.",
    plainExplanation: "Signing away your right to demand money or file a lawsuit if something goes wrong during an activity.",
    category: "Liability & Risk"
  },
  {
    term: "Termination for Convenience",
    definition: "A clause allowing one or both parties to end a contract at any time without giving a specific fault or reason.",
    plainExplanation: "An easy exit door: either side can cancel the contract just by giving advance notice (e.g. 30 days).",
    category: "Contract Terms"
  },
  {
    term: "Intellectual Property (IP) Assignment",
    definition: "The transfer of ownership of intellectual property rights (patents, copyrights, trademarks) from one party to another.",
    plainExplanation: "Handing over complete ownership of ideas, designs, code, or brand names to someone else.",
    category: "Property & Rights"
  }
];

export const CONTRACT_TEMPLATES = [
  {
    id: "nda",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    category: "Business",
    description: "Standard mutual confidentiality contract for protecting business trade secrets.",
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is made on [Date], between [Party A Name] ("Party A") and [Party B Name] ("Party B").

1. PURPOSE: The parties wish to explore a business relationship concerning [Project Description].
2. CONFIDENTIALITY: Each party agrees not to disclose, share, or publish confidential materials.
3. TERM: This agreement remains effective for [Duration, e.g. 2 years] from execution.
4. GOVERNING LAW: Governed by the laws of [State/Country].`
  },
  {
    id: "freelance",
    title: "Independent Contractor / Freelance Agreement",
    category: "Employment & Work",
    description: "Scope of work, payment schedules, and IP ownership for freelancers.",
    content: `INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into by [Client Name] ("Client") and [Contractor Name] ("Contractor").

1. SERVICES: Contractor agrees to perform [Describe Deliverables].
2. COMPENSATION: Client agrees to pay [Rate/Fee] within [Net Days] days of invoice.
3. IP OWNERSHIP: All work product produced by Contractor shall belong exclusively to Client.
4. INDEPENDENT STATUS: Contractor is an independent entity, not an employee.`
  },
  {
    id: "lease",
    title: "Residential Lease Agreement Summary",
    category: "Real Estate",
    description: "Standard terms for tenant rental, security deposit, and landlord rules.",
    content: `RESIDENTIAL LEASE AGREEMENT

Landlord: [Landlord Name]
Tenant: [Tenant Name]
Property Address: [Full Property Address]

1. LEASE TERM: Beginning on [Start Date] and ending on [End Date].
2. RENT AMOUNT: $[Monthly Rent] payable on the 1st of each month. Late fee of $[Late Fee] applies after 5 days.
3. SECURITY DEPOSIT: $[Deposit Amount] held to cover damages.
4. MAINTENANCE: Tenant responsible for keeping premises clean and reporting urgent repairs.`
  }
];

export const DISCLAIMER_TEXT = "Legal-Max provides AI-generated legal information and document analysis for educational and assistance purposes only. It does NOT constitute legal advice or form an attorney-client relationship. Always consult a licensed legal professional for specific advice.";
