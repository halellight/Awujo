import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env from .env.local
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => {
            const [key, ...valueParts] = line.split('=');
            let value = valueParts.join('=').trim();
            // Strip leading/trailing quotes
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            return [key.trim(), value];
        })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const realData = {
    reps: [
        { name: "Godswill Akpabio", role: "Senate President", constituency: "Akwa Ibom North-West", state: "Akwa Ibom", party: "APC", contact_email: "president.senate@nass.gov.ng" },
        { name: "Tajudeen Abbas", role: "Speaker of the House", constituency: "Zaria Federal", state: "Kaduna", party: "APC", contact_email: "speaker@nass.gov.ng" },
        { name: "Akpoti-uduaghan Natasha", role: "Senator", constituency: "Kogi Central", state: "Kogi", party: "PDP", contact_email: "n.akpoti@nass.gov.ng" },
        { name: "Abba Patrick Moro", role: "Senator", constituency: "Benue South", state: "Benue", party: "PDP", contact_email: "p.moro@nass.gov.ng" },
        { name: "Adeola Solomon Olamilekan", role: "Senator", constituency: "Ogun West", state: "Ogun", party: "APC", contact_email: "s.adeola@nass.gov.ng" },
        { name: "Ahmad Ibrahim Lawan", role: "Senator", constituency: "Yobe North", state: "Yobe", party: "APC", contact_email: "a.lawan@nass.gov.ng" },
        { name: "Omosede Gabriella Igbinedion", role: "House Member", constituency: "Ovia Federal", state: "Edo", party: "APC", contact_email: "g.igbinedion@nass.gov.ng" }
    ],
    policies: [
        { title: "National Minimum Wage (Amendment) Act 2024", description: "Mandates a new national minimum wage of ₦70,000, with review every 3 years. Signed into law July 2024.", category: "Labor / Economy", published_date: "2024-07-29", official_url: "https://placng.org/i/wp-content/uploads/2024/07/National-Minimum-Wage-Amendment-Act-2024.pdf" },
        { title: "Nigeria Tax Act (NTA) 2026", description: "Comprehensive overhaul of the tax landscape including NRSA and Joint Revenue Board frameworks. signed June 2025, effective Jan 2026.", category: "Fiscal Policy", published_date: "2025-06-12", official_url: "https://statehouse.gov.ng" },
        { title: "Cybercrimes (Amendment) Act 2024", description: "Mandates 0.5% cybersecurity levy on electronic transactions to fund national digital defense.", category: "Security / Tech", published_date: "2024-05-01", official_url: "https://cert.gov.ng" },
        { title: "Renewed Hope Nigeria First Policy", description: "Directs government investment to prioritize local industries and indigenous content across all sectors.", category: "Governance", published_date: "2025-05-05", official_url: "https://statehouse.gov.ng" },
        { title: "Petroleum Industry Act (PIA) Implementation Phase 2", description: "Full deregulation of the downstream sector and operationalization of host community funds.", category: "Energy / Oil", published_date: "2024-09-15", official_url: "https://nuprc.gov.ng" }
    ],
    projects: [
        { title: "Lagos-Calabar Coastal Highway", description: "Construction of a 700km highway connecting Lagos to Calabar.", location: "Lagos / Calabar", status: "In Progress", budget_allocated: 15000000000000, budget_spent: 1200000000000, start_date: "2024-03-01" },
        { title: "Port Harcourt Refinery Modernization", description: "Complete rehabilitation of the Port Harcourt Refining Company for optimal domestic output.", location: "Rivers", status: "In Progress", budget_allocated: 1200000000000, budget_spent: 980000000000, start_date: "2021-04-15" },
        { title: "Sokoto-Badagry Highway", description: "1,068km arterial road connecting the North-West to the South-West.", location: "Sokoto / Badagry", status: "In Progress", budget_allocated: 1100000000000, budget_spent: 50000000000, start_date: "2024-10-10" },
        { title: "Abuja-Kano Dual Carriageway", description: "Dualization and expansion of the critical freight corridor.", location: "FCT / Kano", status: "In Progress", budget_allocated: 790000000000, budget_spent: 450000000000, start_date: "2018-12-01" },
        { title: "Second Niger Bridge (Maintenance Phase)", description: "Ongoing maintenance and completion of ancillary access roads for the 1.6km bridge.", location: "Anambra / Delta", status: "Completed", budget_allocated: 336000000000, budget_spent: 336000000000, start_date: "2016-09-01" },
        { title: "Mambilla Hydroelectric Power Project", description: "Development of 3,050MW hydroelectric power station in Taraba state.", location: "Taraba", status: "Stalled", budget_allocated: 5000000000000, budget_spent: 20000000000, start_date: "2017-08-01" }
    ],
    petitions: [
        { title: "End Excess Project Spillage", description: "Demand for strict adherence to project timelines and cessation of unapproved budget rollovers.", target_authority: "Ministry of Finance", expected_signatures: 5000, current_signatures: 1240, status: "Open" },
        { title: "Lagos Fourth Mainland Bridge Audit", description: "Request for a full forensic audit of the proposed Fourth Mainland Bridge funding and environmental impact.", target_authority: "Lagos State Gov / Ministry of Works", expected_signatures: 2500, current_signatures: 850, status: "Under Review" },
        { title: "Constituency Fund Open Portal", description: "Legislate for real-time tracking of Zonal Intervention Projects (Constituency Projects) on a public map.", target_authority: "National Assembly", expected_signatures: 10000, current_signatures: 2100, status: "Open" }
    ]
};

async function seed() {
    console.log("🚀 Starting data synchronization protocol...");

    // Clear existing to avoid duplicates if re-running
    await supabase.from('project_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('policies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('representatives').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('petitions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('project_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('project_comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error: repError } = await supabase.from('representatives').insert(realData.reps);
    if (repError) console.error("Error seeding reps:", repError);
    else console.log("✅ Representatives synchronized.");

    const { error: polError } = await supabase.from('policies').insert(realData.policies);
    if (polError) console.error("Error seeding policies:", polError);
    else console.log("✅ Policies synchronized.");

    const { error: petError } = await supabase.from('petitions').insert(realData.petitions);
    if (petError) console.error("Error seeding petitions:", petError);
    else console.log("✅ Petitions synchronized.");

    const { data: projects, error: projError } = await supabase.from('projects').insert(realData.projects).select();
    if (projError) console.error("Error seeding projects:", projError);
    else {
        console.log("✅ Infrastructure nodes synchronized.");

        const projectIds = {
            coastal: projects.find(p => p.title.includes("Coastal"))?.id,
            refinery: projects.find(p => p.title.includes("Refinery"))?.id,
            sokoto: projects.find(p => p.title.includes("Sokoto"))?.id,
        };

        const updates = [
            { project_id: projectIds.coastal, update_text: "Dredging operations at Section 1 completed. Sand filling in progress.", image_url: "/projects/lagos_calabar.png", update_date: "2024-11-20" },
            { project_id: projectIds.refinery, update_text: "Final mechanical completion of the distillation unit verified.", image_url: "/projects/ph_refinery.png", update_date: "2024-12-05" },
            { project_id: projectIds.sokoto, update_text: "Earthworks starting at the Badagry axis. Site clearing 80% complete.", image_url: "/projects/sokoto_badagry.png", update_date: "2025-01-02" }
        ].filter(u => u.project_id);

        const comments = [
            { project_id: projectIds.coastal, user_name: "Chidi Okafor", comment_text: "This highway will change the face of commerce in the South-East and South-South. Hope the maintenance plan is solid!" },
            { project_id: projectIds.coastal, user_name: "Aisha Yusuf", comment_text: "Great to see progress, but what happens to the coastal ecosystem?" },
            { project_id: projectIds.refinery, user_name: "Tobi Ade", comment_text: "Finally! Can't wait for fuel prices to drop when this comes fully online." }
        ].filter(c => c.project_id);

        if (updates.length > 0) {
            const { error: updateError } = await supabase.from('project_updates').insert(updates);
            if (updateError) console.error("Error seeding updates:", updateError);
            else console.log("✅ Visual project updates synchronized.");
        }

        if (comments.length > 0) {
            const { error: commentError } = await supabase.from('project_comments').insert(comments);
            if (commentError) console.error("Error seeding comments:", commentError);
            else console.log("✅ Citizen feedback nodes synchronized.");
        }

        const reports = [
            {
                project_id: projectIds.coastal,
                submitter_name: "Tracka Auditor 01",
                submitter_email: "verify@tracka.ng",
                report_content: "Dredging operations verified at Section 1. Earthworks progressing despite terrain challenges.",
                evidence_url: "https://tracka.ng",
                status: "Published"
            },
            {
                project_id: projectIds.refinery,
                submitter_name: "Oil Sector Analyst",
                submitter_email: "intel@oilwatch.org",
                report_content: "Testing phase confirmed. Flaring intensity increased as units come online. Near-term production expected.",
                evidence_url: "https://nnpcgroup.com",
                status: "Pending"
            }
        ].filter(r => r.project_id);

        if (reports.length > 0) {
            const { error: reportError } = await supabase.from('project_reports').insert(reports);
            if (reportError) console.error("Error seeding reports:", reportError);
            else console.log("✅ Citizen intelligence reports synchronized.");
        }
    }

    console.log("🏁 Synchronization complete.");
}

seed();

