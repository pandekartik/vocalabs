// Shared mock data for admin flows

export const MOCK_ORGS = [
    { id: "ORG-001847", name: "Acme Corporation", domain: "acme.example.com", plan: "Professional", status: "Active", users: "12 / 50", calls30d: 1247, usage: 84, created: "Oct 15, 2023", admin: "john@acme.com" },
    { id: "ORG-002312", name: "TechStart Inc", domain: "techstart.io", plan: "Starter", status: "Trial", users: "4 / 10", calls30d: 234, usage: 23, created: "Jan 8, 2025", admin: "admin@techstart.io" },
    { id: "ORG-003901", name: "Global Services", domain: "globalservices.com", plan: "Enterprise", status: "Active", users: "87 / 200", calls30d: 9102, usage: 91, created: "Mar 22, 2022", admin: "ops@globalservices.com" },
    { id: "ORG-004120", name: "Retail Solutions", domain: "retailsol.com", plan: "Professional", status: "Suspended", users: "23 / 50", calls30d: 0, usage: 0, created: "Jun 5, 2023", admin: "billing@retailsol.com" },
    { id: "ORG-005678", name: "HealthPlus", domain: "healthplus.org", plan: "Enterprise", status: "Active", users: "45 / 200", calls30d: 3890, usage: 39, created: "Sep 1, 2022", admin: "admin@healthplus.org" },
    { id: "ORG-006234", name: "FinanceCo", domain: "financeco.net", plan: "Custom", status: "Active", users: "31 / 100", calls30d: 2100, usage: 55, created: "Nov 14, 2022", admin: "it@financeco.net" },
];

export const MOCK_USERS = [
    { id: "u1", name: "John Doe", email: "john@acme.com", role: "Agent", team: "Sales", status: "Active", lastActive: "2 min ago", calls7d: 45, created: "Oct 15, 2023" },
    { id: "u2", name: "Sarah Johnson", email: "sarah@acme.com", role: "Supervisor", team: "Support", status: "Active", lastActive: "5 min ago", calls7d: 12, created: "Oct 15, 2023" },
    { id: "u3", name: "Mike Chen", email: "mike@acme.com", role: "Agent", team: "Sales", status: "Active", lastActive: "1 hour ago", calls7d: 38, created: "Nov 1, 2023" },
    { id: "u4", name: "Priya Sharma", email: "priya@acme.com", role: "Agent", team: "Support", status: "Inactive", lastActive: "3 days ago", calls7d: 0, created: "Dec 5, 2023" },
    { id: "u5", name: "Carlos Ruiz", email: "carlos@acme.com", role: "Supervisor", team: "Sales", status: "Active", lastActive: "Just now", calls7d: 8, created: "Jan 10, 2024" },
    { id: "u6", name: "Emma Wilson", email: "emma@acme.com", role: "Agent", team: "Support", status: "Pending", lastActive: "Never", calls7d: 0, created: "Jan 20, 2025" },
];

export const MOCK_CALLS = [
    { id: "C789012", timestamp: "2025-01-15 14:32", agent: "John Doe", phone: "+1-555-0456", duration: "4m 32s", outcome: "Completed", recording: "Available" },
    { id: "C789013", timestamp: "2025-01-15 14:15", agent: "Sarah Johnson", phone: "+1-555-0789", duration: "2m 10s", outcome: "Missed", recording: "None" },
    { id: "C789014", timestamp: "2025-01-15 13:48", agent: "Mike Chen", phone: "+44-20-7946-0958", duration: "8m 05s", outcome: "Completed", recording: "Available" },
    { id: "C789015", timestamp: "2025-01-15 13:20", agent: "Priya Sharma", phone: "+91-98765-43210", duration: "1m 45s", outcome: "Voicemail", recording: "Processing" },
];

export const MOCK_ACTIVITY = [
    { time: "2:34:15 PM", event: "High call volume detected", org: "Acme Corp", severity: "warning" },
    { time: "2:33:42 PM", event: "New organization onboarded", org: "TechStart Inc", severity: "info" },
    { time: "2:32:10 PM", event: "AI transcription delay", org: "Global Services", severity: "warning" },
    { time: "2:30:05 PM", event: "User login failure spike", org: "Retail Solutions", severity: "error" },
    { time: "2:28:00 PM", event: "Recording storage usage 90%", org: "HealthPlus", severity: "warning" },
];

export const MOCK_COMPONENTS = [
    { name: "Web Servers", status: "Healthy", load: 67, lastIncident: "3 days ago" },
    { name: "Database (Primary)", status: "Healthy", load: 45, lastIncident: "7 days ago" },
    { name: "Database (Replica)", status: "Healthy", load: 42, lastIncident: "7 days ago" },
    { name: "Redis Cache", status: "Healthy", load: 78, lastIncident: "12 days ago" },
    { name: "AI Transcription", status: "Degraded", load: 89, lastIncident: "2 hours ago" },
    { name: "WebRTC Servers", status: "Healthy", load: 56, lastIncident: "5 days ago" },
    { name: "Object Storage", status: "Healthy", load: 34, lastIncident: "15 days ago" },
];
