export const MOCK_CALLS = [
    {
        id: "C123456",
        timestamp: "2026-02-21 10:00 AM",
        agent: "Sarah J.",
        phone: "+1 (555) 123-4567",
        duration: "5m 23s",
        outcome: "Completed",
        recording: "Available"
    },
    {
        id: "C123457",
        timestamp: "2026-02-21 09:15 AM",
        agent: "Mike C.",
        phone: "+1 (555) 987-6543",
        duration: "0s",
        outcome: "Missed",
        recording: "Unavailable"
    }
];

export const MOCK_USERS = [
    {
        id: "U88231",
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        role: "Supervisor",
        team: "Sales",
        status: "Active",
        lastActive: "10 mins ago",
        calls7d: 145,
        created: "Oct 12, 2025"
    },
    {
        id: "U88232",
        name: "Mike Chen",
        email: "mike.c@example.com",
        role: "Agent",
        team: "Support",
        status: "Pending",
        lastActive: "1 day ago",
        calls7d: 132,
        created: "Nov 05, 2025"
    }
];

export const MOCK_COMPONENTS = [
    { name: "API Gateway", status: "Healthy", load: 45 },
    { name: "PostgreSQL DB", status: "Healthy", load: 70 },
    { name: "Redis Cache", status: "Healthy", load: 30 },
    { name: "Twilio Integration", status: "Degraded", load: 85 },
];

export const MOCK_ACTIVITY = [
    { time: "10:05", event: "User login failure", org: "Acme Corp", severity: "warning" },
    { time: "09:59", event: "DB Migration completed", org: "System", severity: "info" },
    { time: "09:45", event: "Twilio token expired", org: "Global Tech", severity: "error" },
];

export const MOCK_ORGS = [
    {
        id: "ORG-001",
        name: "Acme Corporation",
        domain: "acme.com",
        plan: "Enterprise",
        status: "Active",
        users: 150,
        calls30d: 45000,
        usage: 75,
        created: "Jan 10, 2025",
        admin: "admin@acme.com"
    },
    {
        id: "ORG-002",
        name: "Global Tech",
        domain: "globaltech.io",
        plan: "Professional",
        status: "Suspended",
        users: 12,
        calls30d: 1200,
        usage: 95,
        created: "Feb 05, 2025",
        admin: "it@globaltech.io"
    },
    {
        id: "ORG-003",
        name: "StartUp Inc",
        domain: "startup.io",
        plan: "Starter",
        status: "Trial",
        users: 5,
        calls30d: 300,
        usage: 20,
        created: "Feb 15, 2025",
        admin: "founder@startup.io"
    }
];
