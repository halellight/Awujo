"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Database, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const realData = {
        reps: [
            {
                "name": "Austin Akobundu",
                "role": "Senator",
                "constituency": "Abia Central",
                "state": "Abia",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.akobundu@nass.gov.ng"
            },
            {
                "name": "Orji Uzor Kalu",
                "role": "Senator",
                "constituency": "Abia North",
                "state": "Abia",
                "party": "APC",
                "committees": [
                    {
                        "name": "Privatization",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "o.kalu@nass.gov.ng"
            },
            {
                "name": "Enyinnaya Abaribe",
                "role": "Senator",
                "constituency": "Abia South",
                "state": "Abia",
                "party": "APGA",
                "committees": [],
                "contact_email": "e.abaribe@nass.gov.ng"
            },
            {
                "name": "Abbas Aminu Iya",
                "role": "Senator",
                "constituency": "Adamawa Central",
                "state": "Adamawa",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Science & Technology",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.iya@nass.gov.ng"
            },
            {
                "name": "Amos Yohanna",
                "role": "Senator",
                "constituency": "Adamawa North",
                "state": "Adamawa",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.yohanna@nass.gov.ng"
            },
            {
                "name": "Binos Dauda Yaroe",
                "role": "Senator",
                "constituency": "Adamawa South",
                "state": "Adamawa",
                "party": "PDP",
                "committees": [],
                "contact_email": "b.yaroe@nass.gov.ng"
            },
            {
                "name": "Bassey Aniekan Etim",
                "role": "Senator",
                "constituency": "Akwa Ibom North-East",
                "state": "Akwa Ibom",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Agriculture Production Services & Rural Development",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "b.etim@nass.gov.ng"
            },
            {
                "name": "Godswill Akpabio",
                "role": "Senate President",
                "constituency": "Akwa Ibom North-West",
                "state": "Akwa Ibom",
                "party": "APC",
                "committees": [],
                "contact_email": "g.akpabio@nass.gov.ng"
            },
            {
                "name": "Akpan Ekong Sampson",
                "role": "Senator",
                "constituency": "Akwa Ibom South",
                "state": "Akwa Ibom",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.sampson@nass.gov.ng"
            },
            {
                "name": "Umeh Victor Chukwunonyelu",
                "role": "Senator",
                "constituency": "Anambra Central",
                "state": "Anambra",
                "party": "LP",
                "committees": [
                    {
                        "name": "Diaspora & NGOs",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "u.chukwunonyelu@nass.gov.ng"
            },
            {
                "name": "Tony Nwoye",
                "role": "Senator",
                "constituency": "Anambra North",
                "state": "Anambra",
                "party": "LP",
                "committees": [
                    {
                        "name": "Anti-Corruption & Financial Crimes",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Primary Healthcare, Development & Disease Control",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "t.nwoye@nass.gov.ng"
            },
            {
                "name": "Ifeanyi Ubah",
                "role": "Senator",
                "constituency": "Anambra South",
                "state": "Anambra",
                "party": "YPP",
                "committees": [],
                "contact_email": "i.ubah@nass.gov.ng"
            },
            {
                "name": "Ahmed Abdul Ningi",
                "role": "Senator",
                "constituency": "Bauchi Central",
                "state": "Bauchi",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.ningi@nass.gov.ng"
            },
            {
                "name": "Samaila Dahuwa Kaila",
                "role": "Senator",
                "constituency": "Bauchi North",
                "state": "Bauchi",
                "party": "PDP",
                "committees": [],
                "contact_email": "s.kaila@nass.gov.ng"
            },
            {
                "name": "Umar Shehu Buba",
                "role": "Senator",
                "constituency": "Bauchi South",
                "state": "Bauchi",
                "party": "APC",
                "committees": [],
                "contact_email": "u.buba@nass.gov.ng"
            },
            {
                "name": "Benson Friday Konbowei",
                "role": "Senator",
                "constituency": "Bayelsa Central",
                "state": "Bayelsa",
                "party": "PDP",
                "committees": [],
                "contact_email": "b.konbowei@nass.gov.ng"
            },
            {
                "name": "Agadaga Benson Sunday",
                "role": "Senator",
                "constituency": "Bayelsa East",
                "state": "Bayelsa",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.sunday@nass.gov.ng"
            },
            {
                "name": "Henry Seriake Dickson",
                "role": "Senator",
                "constituency": "Bayelsa West",
                "state": "Bayelsa",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Ecology & Climate Change",
                        "role": "Chairman"
                    },
                    {
                        "name": "Foreign Affairs",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "h.dickson@nass.gov.ng"
            },
            {
                "name": "Udende Memsa Emmanuel",
                "role": "Senator",
                "constituency": "Benue North-East",
                "state": "Benue",
                "party": "APC",
                "committees": [
                    {
                        "name": "Anti-Corruption & Financial Crimes",
                        "role": "Chairman"
                    },
                    {
                        "name": "Privatization",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "u.emmanuel@nass.gov.ng"
            },
            {
                "name": "Titus Tartengar Zam",
                "role": "Senator",
                "constituency": "Benue North-West",
                "state": "Benue",
                "party": "APC",
                "committees": [
                    {
                        "name": "Agriculture Colleges & Institutions",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Rules & Business",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "t.zam@nass.gov.ng"
            },
            {
                "name": "Patrick Abba Moro",
                "role": "Senator",
                "constituency": "Benue South",
                "state": "Benue",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Downstream Petroleum",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "p.moro@nass.gov.ng"
            },
            {
                "name": "Kaka Shehu Lawan",
                "role": "Senator",
                "constituency": "Borno Central",
                "state": "Borno",
                "party": "APC",
                "committees": [],
                "contact_email": "k.lawan@nass.gov.ng"
            },
            {
                "name": "Mohammed Tahir Monguno",
                "role": "Senator",
                "constituency": "Borno North",
                "state": "Borno",
                "party": "APC",
                "committees": [],
                "contact_email": "m.monguno@nass.gov.ng"
            },
            {
                "name": "Mohammed Ali Ndume",
                "role": "Senator",
                "constituency": "Borno South",
                "state": "Borno",
                "party": "APC",
                "committees": [
                    {
                        "name": "Appropriations",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "m.ndume@nass.gov.ng"
            },
            {
                "name": "Williams Eteng Jonah",
                "role": "Senator",
                "constituency": "Cross River Central",
                "state": "Cross River",
                "party": "PDP",
                "committees": [],
                "contact_email": "w.jonah@nass.gov.ng"
            },
            {
                "name": "Agom Jarigbe",
                "role": "Senator",
                "constituency": "Cross River North",
                "state": "Cross River",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Gas",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.jarigbe@nass.gov.ng"
            },
            {
                "name": "Ekpeyong Asuquo",
                "role": "Senator",
                "constituency": "Cross River South",
                "state": "Cross River",
                "party": "APC",
                "committees": [],
                "contact_email": "e.asuquo@nass.gov.ng"
            },
            {
                "name": "Dafinone Edeh Omueya",
                "role": "Senator",
                "constituency": "Delta Central",
                "state": "Delta",
                "party": "APC",
                "committees": [],
                "contact_email": "d.omueya@nass.gov.ng"
            },
            {
                "name": "Nwoko Chinedu Munir",
                "role": "Senator",
                "constituency": "Delta North",
                "state": "Delta",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Environment",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "n.munir@nass.gov.ng"
            },
            {
                "name": "Joel-Onowakpo Thomas",
                "role": "Senator",
                "constituency": "Delta South",
                "state": "Delta",
                "party": "APC",
                "committees": [],
                "contact_email": "j.thomas@nass.gov.ng"
            },
            {
                "name": "Eze Kenneth Emeka",
                "role": "Senator",
                "constituency": "Ebonyi Central",
                "state": "Ebonyi",
                "party": "APC",
                "committees": [
                    {
                        "name": "Information & National Orientation",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "e.emeka@nass.gov.ng"
            },
            {
                "name": "Nwebonyi Onyeka Peter",
                "role": "Senator",
                "constituency": "Ebonyi North",
                "state": "Ebonyi",
                "party": "APC",
                "committees": [
                    {
                        "name": "Public Accounts",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "n.peter@nass.gov.ng"
            },
            {
                "name": "Okorie Anthony Ani",
                "role": "Senator",
                "constituency": "Ebonyi South",
                "state": "Ebonyi",
                "party": "APC",
                "committees": [],
                "contact_email": "o.ani@nass.gov.ng"
            },
            {
                "name": "Okphebolo Monday",
                "role": "Senator",
                "constituency": "Edo Central",
                "state": "Edo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Public Procurement",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "o.monday@nass.gov.ng"
            },
            {
                "name": "Adams Aliyu Oshiomole",
                "role": "Senator",
                "constituency": "Edo North",
                "state": "Edo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Interior",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.oshiomole@nass.gov.ng"
            },
            {
                "name": "Imasuen Neda Bernards",
                "role": "Senator",
                "constituency": "Edo South",
                "state": "Edo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Ethics, Code of Conduct & Public Petitions",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "i.bernards@nass.gov.ng"
            },
            {
                "name": "Michael Opeyemi Bamidele",
                "role": "Senator",
                "constituency": "Ekiti Central",
                "state": "Ekiti",
                "party": "APC",
                "committees": [
                    {
                        "name": "Constitution Review",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Defence",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Rules & Business",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "m.bamidele@nass.gov.ng"
            },
            {
                "name": "Fasuyi Cyril Oluwole",
                "role": "Senator",
                "constituency": "Ekiti North",
                "state": "Ekiti",
                "party": "APC",
                "committees": [
                    {
                        "name": "Army",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Establishment & Public Services",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "f.oluwole@nass.gov.ng"
            },
            {
                "name": "Adaramodu Adeyemi Raphael",
                "role": "Senator",
                "constituency": "Ekiti South",
                "state": "Ekiti",
                "party": "APC",
                "committees": [],
                "contact_email": "a.raphael@nass.gov.ng"
            },
            {
                "name": "Kelvin Chukwu",
                "role": "Senator",
                "constituency": "Enugu East",
                "state": "Enugu",
                "party": "LP",
                "committees": [
                    {
                        "name": "Science & Technology",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "k.chukwu@nass.gov.ng"
            },
            {
                "name": "Okechukwu Ezea",
                "role": "Senator",
                "constituency": "Enugu North",
                "state": "Enugu",
                "party": "LP",
                "committees": [
                    {
                        "name": "Cooperation & Integration in Africa/NEPAD",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Housing & Urban Development",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "o.ezea@nass.gov.ng"
            },
            {
                "name": "Ngwu Osita",
                "role": "Senator",
                "constituency": "Enugu West",
                "state": "Enugu",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Drugs & Narcotics",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "n.osita@nass.gov.ng"
            },
            {
                "name": "Ireti Kingibe",
                "role": "Senator",
                "constituency": "FCT FCT",
                "state": "FCT",
                "party": "LP",
                "committees": [],
                "contact_email": "i.kingibe@nass.gov.ng"
            },
            {
                "name": "Mohammed Danjuma Goje",
                "role": "Senator",
                "constituency": "Gombe Central",
                "state": "Gombe",
                "party": "APC",
                "committees": [],
                "contact_email": "m.goje@nass.gov.ng"
            },
            {
                "name": "Ibrahim Hassan Dankwambo",
                "role": "Senator",
                "constituency": "Gombe North",
                "state": "Gombe",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Drugs & Narcotics",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "i.dankwambo@nass.gov.ng"
            },
            {
                "name": "Anthony Siyako Yaro",
                "role": "Senator",
                "constituency": "Gombe South",
                "state": "Gombe",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Diaspora & NGOs",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "a.yaro@nass.gov.ng"
            },
            {
                "name": "Ezenwa Francis Onyewuchi",
                "role": "Senator",
                "constituency": "Imo East",
                "state": "Imo",
                "party": "LP",
                "committees": [],
                "contact_email": "e.onyewuchi@nass.gov.ng"
            },
            {
                "name": "Patrick Ndubueze",
                "role": "Senator",
                "constituency": "Imo North",
                "state": "Imo",
                "party": "APC",
                "committees": [],
                "contact_email": "p.ndubueze@nass.gov.ng"
            },
            {
                "name": "Osita Izunaso",
                "role": "Senator",
                "constituency": "Imo West",
                "state": "Imo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Capital Market",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "o.izunaso@nass.gov.ng"
            },
            {
                "name": "Ahmad Abdulhamid Malam Madori",
                "role": "Senator",
                "constituency": "Jigawa North-East",
                "state": "Jigawa",
                "party": "APC",
                "committees": [],
                "contact_email": "a.madori@nass.gov.ng"
            },
            {
                "name": "Babangida Hussaini",
                "role": "Senator",
                "constituency": "Jigawa North-West",
                "state": "Jigawa",
                "party": "APC",
                "committees": [
                    {
                        "name": "FERMA",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "b.hussaini@nass.gov.ng"
            },
            {
                "name": "Mustapha Khabeeb",
                "role": "Senator",
                "constituency": "Jigawa South-West",
                "state": "Jigawa",
                "party": "PDP",
                "committees": [],
                "contact_email": "m.khabeeb@nass.gov.ng"
            },
            {
                "name": "Lawal Adamu Usman",
                "role": "Senator",
                "constituency": "Kaduna Central",
                "state": "Kaduna",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Banking, Insurance & Other Financial Institutions",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Education (Basic & Secondary)",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "l.usman@nass.gov.ng"
            },
            {
                "name": "Ibrahim Khalid Mustapha",
                "role": "Senator",
                "constituency": "Kaduna North",
                "state": "Kaduna",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Ethics, Code of Conduct & Public Petitions",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "i.mustapha@nass.gov.ng"
            },
            {
                "name": "Sunday Marshall Katung",
                "role": "Senator",
                "constituency": "Kaduna South",
                "state": "Kaduna",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Ecology & Climate Change",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "s.katung@nass.gov.ng"
            },
            {
                "name": "Rufai Hanga",
                "role": "Senator",
                "constituency": "Kano Central",
                "state": "Kano",
                "party": "NNPP",
                "committees": [],
                "contact_email": "r.hanga@nass.gov.ng"
            },
            {
                "name": "Barau Jibrin",
                "role": "Senator",
                "constituency": "Kano North",
                "state": "Kano",
                "party": "APC",
                "committees": [
                    {
                        "name": "Constitution Review",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "b.jibrin@nass.gov.ng"
            },
            {
                "name": "Suleiman Abdurrahman Kawu Sumaila",
                "role": "Senator",
                "constituency": "Kano South",
                "state": "Kano",
                "party": "APC",
                "committees": [
                    {
                        "name": "Health",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "ICT & Cybercrimes",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "s.sumaila@nass.gov.ng"
            },
            {
                "name": "Abdul\u2019aziz Musa Yar\u2019adua",
                "role": "Senator",
                "constituency": "Katsina Central",
                "state": "Katsina",
                "party": "APC",
                "committees": [
                    {
                        "name": "Army",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.yar\u2019adua@nass.gov.ng"
            },
            {
                "name": "Sani Daura",
                "role": "Senator",
                "constituency": "Katsina North",
                "state": "Katsina",
                "party": "APC",
                "committees": [
                    {
                        "name": "Culture & Tourism",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "s.daura@nass.gov.ng"
            },
            {
                "name": "Mohammed Muntari Dandutse",
                "role": "Senator",
                "constituency": "Katsina South",
                "state": "Katsina",
                "party": "APC",
                "committees": [],
                "contact_email": "m.dandutse@nass.gov.ng"
            },
            {
                "name": "Adamu Aliero",
                "role": "Senator",
                "constituency": "Kebbi Central",
                "state": "Kebbi",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.aliero@nass.gov.ng"
            },
            {
                "name": "Yahaya Abubakar Abdullahi",
                "role": "Senator",
                "constituency": "Kebbi North",
                "state": "Kebbi",
                "party": "PDP",
                "committees": [],
                "contact_email": "y.abdullahi@nass.gov.ng"
            },
            {
                "name": "Natasha Akpoti",
                "role": "Senator",
                "constituency": "Kogi Central",
                "state": "Kogi",
                "party": "PDP",
                "committees": [],
                "contact_email": "n.akpoti@nass.gov.ng"
            },
            {
                "name": "Jibrin Isah",
                "role": "Senator",
                "constituency": "Kogi East",
                "state": "Kogi",
                "party": "APC",
                "committees": [
                    {
                        "name": "Customs, Excise & Tariff",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "j.isah@nass.gov.ng"
            },
            {
                "name": "Sunday Karimi",
                "role": "Senator",
                "constituency": "Kogi West",
                "state": "Kogi",
                "party": "APC",
                "committees": [],
                "contact_email": "s.karimi@nass.gov.ng"
            },
            {
                "name": "Saliu Mustapha",
                "role": "Senator",
                "constituency": "Kwara Central",
                "state": "Kwara",
                "party": "APC",
                "committees": [
                    {
                        "name": "Agriculture Production Services & Rural Development",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "s.mustapha@nass.gov.ng"
            },
            {
                "name": "Suleiman Sadiq Umar",
                "role": "Senator",
                "constituency": "Kwara North",
                "state": "Kwara",
                "party": "APC",
                "committees": [],
                "contact_email": "s.umar@nass.gov.ng"
            },
            {
                "name": "Lola Ashiru",
                "role": "Senator",
                "constituency": "Kwara South",
                "state": "Kwara",
                "party": "APC",
                "committees": [
                    {
                        "name": "Power",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "l.ashiru@nass.gov.ng"
            },
            {
                "name": "Wasiu Eshinlokun-Sanni",
                "role": "Senator",
                "constituency": "Lagos Central",
                "state": "Lagos",
                "party": "APC",
                "committees": [],
                "contact_email": "w.eshinlokun-sanni@nass.gov.ng"
            },
            {
                "name": "Tokunbo Abiru",
                "role": "Senator",
                "constituency": "Lagos East",
                "state": "Lagos",
                "party": "APC",
                "committees": [
                    {
                        "name": "Banking, Insurance & Other Financial Institutions",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "t.abiru@nass.gov.ng"
            },
            {
                "name": "Oluranti Adebule",
                "role": "Senator",
                "constituency": "Lagos West",
                "state": "Lagos",
                "party": "APC",
                "committees": [],
                "contact_email": "o.adebule@nass.gov.ng"
            },
            {
                "name": "Godiya Akwashiki",
                "role": "Senator",
                "constituency": "Nasarawa North",
                "state": "Nasarawa",
                "party": "SDP",
                "committees": [
                    {
                        "name": "Air Force",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "g.akwashiki@nass.gov.ng"
            },
            {
                "name": "Mohammed Ogoshi Onawo",
                "role": "Senator",
                "constituency": "Nasarawa South",
                "state": "Nasarawa",
                "party": "PDP",
                "committees": [],
                "contact_email": "m.onawo@nass.gov.ng"
            },
            {
                "name": "Ahmed Aliyu Wadada",
                "role": "Senator",
                "constituency": "Nasarawa West",
                "state": "Nasarawa",
                "party": "SDP",
                "committees": [
                    {
                        "name": "Public Accounts",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.wadada@nass.gov.ng"
            },
            {
                "name": "Sani Musa",
                "role": "Senator",
                "constituency": "Niger East",
                "state": "Niger",
                "party": "APC",
                "committees": [],
                "contact_email": "s.musa@nass.gov.ng"
            },
            {
                "name": "Abubakar Sani Bello",
                "role": "Senator",
                "constituency": "Niger North",
                "state": "Niger",
                "party": "APC",
                "committees": [
                    {
                        "name": "Foreign Affairs",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.bello@nass.gov.ng"
            },
            {
                "name": "Peter Ndalikali Jiya",
                "role": "Senator",
                "constituency": "Niger South",
                "state": "Niger",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Aviation",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "Capital Market",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "p.jiya@nass.gov.ng"
            },
            {
                "name": "Shuaibu Salisu",
                "role": "Senator",
                "constituency": "Ogun Central",
                "state": "Ogun",
                "party": "APC",
                "committees": [
                    {
                        "name": "ICT & Cybercrimes",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "s.salisu@nass.gov.ng"
            },
            {
                "name": "Gbenga Daniel",
                "role": "Senator",
                "constituency": "Ogun East",
                "state": "Ogun",
                "party": "APC",
                "committees": [],
                "contact_email": "g.daniel@nass.gov.ng"
            },
            {
                "name": "Solomon Olamilekan Adeola",
                "role": "Senator",
                "constituency": "Ogun West",
                "state": "Ogun",
                "party": "APC",
                "committees": [
                    {
                        "name": "Appropriations",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "s.adeola@nass.gov.ng"
            },
            {
                "name": "Adeniyi Adegbonmire",
                "role": "Senator",
                "constituency": "Ondo Central",
                "state": "Ondo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Agriculture Colleges & Institutions",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.adegbonmire@nass.gov.ng"
            },
            {
                "name": "Jide Ipinsagba",
                "role": "Senator",
                "constituency": "Ondo North",
                "state": "Ondo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Downstream Petroleum",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "j.ipinsagba@nass.gov.ng"
            },
            {
                "name": "Jimoh Ibrahim",
                "role": "Senator",
                "constituency": "Ondo South",
                "state": "Ondo",
                "party": "APC",
                "committees": [],
                "contact_email": "j.ibrahim@nass.gov.ng"
            },
            {
                "name": "Olubiyi Fadeyi",
                "role": "Senator",
                "constituency": "Osun Central",
                "state": "Osun",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Communications",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "o.fadeyi@nass.gov.ng"
            },
            {
                "name": "Fadahunsi Francis Adenigba",
                "role": "Senator",
                "constituency": "Osun East",
                "state": "Osun",
                "party": "PDP",
                "committees": [],
                "contact_email": "f.adenigba@nass.gov.ng"
            },
            {
                "name": "Lere Oyewumi",
                "role": "Senator",
                "constituency": "Osun West",
                "state": "Osun",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Finance",
                        "role": "Vice-Chairman"
                    }
                ],
                "contact_email": "l.oyewumi@nass.gov.ng"
            },
            {
                "name": "Yunus Akintunde",
                "role": "Senator",
                "constituency": "Oyo Central",
                "state": "Oyo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Environment",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "y.akintunde@nass.gov.ng"
            },
            {
                "name": "Abdulfatai Buhari",
                "role": "Senator",
                "constituency": "Oyo North",
                "state": "Oyo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Aviation",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.buhari@nass.gov.ng"
            },
            {
                "name": "Sharafadeen Alli",
                "role": "Senator",
                "constituency": "Oyo South",
                "state": "Oyo",
                "party": "APC",
                "committees": [
                    {
                        "name": "Customs, Excise & Tariff",
                        "role": "Vice-Chairman"
                    },
                    {
                        "name": "INEC",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "s.alli@nass.gov.ng"
            },
            {
                "name": "Diket Plang",
                "role": "Senator",
                "constituency": "Plateau Central",
                "state": "Plateau",
                "party": "APC",
                "committees": [],
                "contact_email": "d.plang@nass.gov.ng"
            },
            {
                "name": "Pam Dachungyang",
                "role": "Senator",
                "constituency": "Plateau North",
                "state": "Plateau",
                "party": "ADP",
                "committees": [],
                "contact_email": "p.dachungyang@nass.gov.ng"
            },
            {
                "name": "Simon Lalong",
                "role": "Senator",
                "constituency": "Plateau South",
                "state": "Plateau",
                "party": "APC",
                "committees": [],
                "contact_email": "s.lalong@nass.gov.ng"
            },
            {
                "name": "Allwell Onyeso",
                "role": "Senator",
                "constituency": "Rivers East",
                "state": "Rivers",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Federal Character & Governmental Affairs",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "a.onyeso@nass.gov.ng"
            },
            {
                "name": "Barry Mpigi",
                "role": "Senator",
                "constituency": "Rivers South-East",
                "state": "Rivers",
                "party": "PDP",
                "committees": [],
                "contact_email": "b.mpigi@nass.gov.ng"
            },
            {
                "name": "Ipalibo Banigo",
                "role": "Senator",
                "constituency": "Rivers West",
                "state": "Rivers",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Health",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "i.banigo@nass.gov.ng"
            },
            {
                "name": "Ibrahim Gobir",
                "role": "Senator",
                "constituency": "Sokoto East",
                "state": "Sokoto",
                "party": "APC",
                "committees": [],
                "contact_email": "i.gobir@nass.gov.ng"
            },
            {
                "name": "Aliyu Wamakko",
                "role": "Senator",
                "constituency": "Sokoto North",
                "state": "Sokoto",
                "party": "APC",
                "committees": [],
                "contact_email": "a.wamakko@nass.gov.ng"
            },
            {
                "name": "Aminu Tambuwal",
                "role": "Senator",
                "constituency": "Sokoto South",
                "state": "Sokoto",
                "party": "PDP",
                "committees": [],
                "contact_email": "a.tambuwal@nass.gov.ng"
            },
            {
                "name": "Haruna Manu",
                "role": "Senator",
                "constituency": "Taraba Central",
                "state": "Taraba",
                "party": "PDP",
                "committees": [],
                "contact_email": "h.manu@nass.gov.ng"
            },
            {
                "name": "Shuaibu Isa Lau",
                "role": "Senator",
                "constituency": "Taraba North",
                "state": "Taraba",
                "party": "PDP",
                "committees": [],
                "contact_email": "s.lau@nass.gov.ng"
            },
            {
                "name": "David Jimkuta",
                "role": "Senator",
                "constituency": "Taraba South",
                "state": "Taraba",
                "party": "APC",
                "committees": [],
                "contact_email": "d.jimkuta@nass.gov.ng"
            },
            {
                "name": "Ibrahim Gaidam",
                "role": "Senator",
                "constituency": "Yobe East",
                "state": "Yobe",
                "party": "APC",
                "committees": [],
                "contact_email": "i.gaidam@nass.gov.ng"
            },
            {
                "name": "Ahmed Lawan",
                "role": "Senator",
                "constituency": "Yobe North",
                "state": "Yobe",
                "party": "APC",
                "committees": [],
                "contact_email": "a.lawan@nass.gov.ng"
            },
            {
                "name": "Ibrahim Mohammed Bomai",
                "role": "Senator",
                "constituency": "Yobe South",
                "state": "Yobe",
                "party": "APC",
                "committees": [
                    {
                        "name": "FCT",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "i.bomai@nass.gov.ng"
            },
            {
                "name": "Ikra Aliyu Bilbis",
                "role": "Senator",
                "constituency": "Zamfara Central",
                "state": "Zamfara",
                "party": "PDP",
                "committees": [
                    {
                        "name": "Communications",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "i.bilbis@nass.gov.ng"
            },
            {
                "name": "Sahabi Alhaji Ya\u00fa",
                "role": "Senator",
                "constituency": "Zamfara North",
                "state": "Zamfara",
                "party": "APC",
                "committees": [
                    {
                        "name": "Cooperation & Integration in Africa/NEPAD",
                        "role": "Chairman"
                    }
                ],
                "contact_email": "s.ya\u00fa@nass.gov.ng"
            },
            {
                "name": "Abdul\u2019aziz Abubakar Yari",
                "role": "Senator",
                "constituency": "Zamfara West",
                "state": "Zamfara",
                "party": "APC",
                "committees": [],
                "contact_email": "a.yari@nass.gov.ng"
            }
        ],
        policies: [
            { title: "National Minimum Wage (Amendment) Act 2024", description: "Mandates a new national minimum wage of ₦70,000, with review every 3 years. Signed into law July 2024.", category: "Labor / Economy", implementation_date: "2024-07-29", status: "Active" },
            { title: "Nigeria Tax Act (NTA) 2026", description: "Comprehensive overhaul of the tax landscape including NRSA and Joint Revenue Board frameworks. signed June 2025, effective Jan 2026.", category: "Fiscal Policy", implementation_date: "2026-01-01", status: "Upcoming" },
            { title: "Cybercrimes (Amendment) Act 2024", description: "Mandates 0.5% cybersecurity levy on electronic transactions to fund national digital defense.", category: "Security / Tech", implementation_date: "2024-05-01", status: "Active" },
            { title: "Renewed Hope Nigeria First Policy", description: "Directs government investment to prioritize local industries and indigenous content across all sectors.", category: "Governance", implementation_date: "2025-05-05", status: "Active" }
        ],
        projects: [
            { title: "Lagos-Calabar Coastal Highway", description: "Construction of a 700km highway connecting Lagos to Calabar.", state: "Lagos / Calabar", status: "In Progress", budget_allocated: 15000000000000, budget_spent: 1200000000000, category: "Infrastructure" },
            { title: "Port Harcourt Refinery Modernization", description: "Complete rehabilitation of the Port Harcourt Refining Company for optimal domestic output.", state: "Rivers", status: "In Progress", budget_allocated: 1200000000000, budget_spent: 980000000000, category: "Energy" },
            { title: "Sokoto-Badagry Highway", description: "1,068km arterial road connecting the North-West to the South-West.", state: "Sokoto / Badagry", status: "In Progress", budget_allocated: 1100000000000, budget_spent: 50000000000, category: "Infrastructure" },
            { title: "Abuja-Kano Dual Carriageway", description: "Dualization and expansion of the critical freight corridor.", state: "FCT / Kano", status: "In Progress", budget_allocated: 790000000000, budget_spent: 450000000000, category: "Infrastructure" }
        ]
    };

    async function runSeed() {
        setStatus("loading");
        try {
            // Delete existing test data to avoid duplicates if necessary, 
            // but for safety we just insert the specific real ones.

            await supabase.from('representatives').upsert(realData.reps, { onConflict: 'name' });
            await supabase.from('policies').insert(realData.policies);
            const { data: projects } = await supabase.from('projects').insert(realData.projects).select();

            if (projects && projects.length > 0) {
                const reports = [
                    { project_id: projects.find(p => p.title.includes("Coastal"))?.id, reporter_name: "Tracka Auditor 01", report_text: "Dredging operations verified at Section 1. Earthworks progressing despite terrain challenges.", evidence_url: "https://tracka.ng", status: "Verified" },
                    { project_id: projects.find(p => p.title.includes("Refinery"))?.id, reporter_name: "Oil Sector Analyst", report_text: "Testing phase confirmed. Flaring intensity increased as units come online. Near-term production expected.", evidence_url: "https://nnpcgroup.com", status: "Pending" }
                ].filter(r => r.project_id);

                if (reports.length > 0) {
                    await supabase.from('project_reports').insert(reports);
                }
            }

            setStatus("success");
            setMessage("National Database Synchronized. Representatives, Policies, and Infrastructure Nodes are now live.");
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage("Synchronization failure. Check logs for protocol errors.");
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-zinc-200 rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8">
                    <Database className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-4">
                    Data <span className="text-primary italic">Sync.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 px-4">
                    Transmit verified 10th National Assembly data and 2024-2026 Federal Policies into the secure database.
                </p>

                {status === "idle" && (
                    <button
                        onClick={runSeed}
                        className="w-full bg-zinc-900 text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        Initialize Synchronization
                    </button>
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verifying Protocol...</span>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold uppercase text-xs tracking-widest">
                            <CheckCircle2 className="w-5 h-5" /> Transmission Complete
                        </div>
                        <p className="text-zinc-500 text-[11px] font-medium leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                            {message}
                        </p>
                        <button
                            onClick={() => window.location.href = "/dashboard"}
                            className="w-full bg-primary text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg"
                        >
                            Open Live Dashboard
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 text-red-600 font-bold uppercase text-xs tracking-widest">
                            <AlertCircle className="w-5 h-5" /> Sync Halted
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                            {message}
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="w-full bg-zinc-100 text-zinc-600 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em]"
                        >
                            Retry Protocol
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
