import json
import re

# Raw input data for committees
committees_raw = """
Agriculture Colleges & Institutions | Sen. Ayodele Adegbonmire | Sen. Titus Zam
Agriculture Production Services & Rural Development | Sen. Mustapha Saliu | Sen. Aniekan Bassey Etim
Air Force | Sen. Godiya Akwashiki | Sen. Binkap Napoleon Bali
Army | Sen. Abdulaziz Musa Yaradua | Sen. Olusegun Oluwole Fasuyi
Anti-Corruption & Financial Crimes | Sen. Emmanuel Udende | Sen. Tony Okechukwu Nwoye
Appropriations | Sen. Olamilekan Solomon Adeola | Sen. Mohammed Ali Ndume
Aviation | Sen. Abdulfatai Buhari | Sen. Peter Ndalikali Jiya
Banking, Insurance & Other Financial Institutions | Sen. Tokunbo Mukhail Abiru | Sen. Lawal Adamu Usman
Capital Market | Sen. Osita Bonaventure Izunaso | Sen. Peter Ndalikali Jiya
Communications | Sen. Ikra Aliyu Bilbis | Sen. Olubiyi Oluwole Fadeyi
Constitution Review | Sen. Jibrin Barau | Sen. Michael Opeyemi Bamidele
Cooperation & Integration in Africa/NEPAD | Sen. Yau Sahabi | Sen. Okechukwu Ezea
Culture & Tourism | Sen. Elijah Ishaku Abbo | Sen. Nasiru Sani Zangon Daura
Customs, Excise & Tariff | Sen. Isah Jibrin | Sen. Sharafadeen Abiodun Alli
Defence | Sen. Ahmad Ibrahim Lawan | Sen. Michael Opeyemi Bamidele
Diaspora & NGOs | Sen. Victor Umeh | Sen. Anthony Yaro Siyako
Downstream Petroleum | Sen. Emmanuel Olajide Ipinsangba | Sen. Abba Patrick Moro
Drugs & Narcotics | Sen. Ibrahim Hassan Dankwambo | Sen. Osita Ngwu
Ecology & Climate Change | Sen. Seriake Dickson | Sen. Sunday Marshall Katung
Education (Basic & Secondary) | Sen. Lawal Adamu Usman | Sen. Samson Akpan Ekong
Employment, Labour & Productivity | Sen. Diket Satso Plang | Sen. Thomas Joel-Onawakpo
Environment | Sen. Akintunde Abiodun Yunusa | Sen. Chinedu Nwoko
Establishment & Public Services | Sen. Olusegun Oluwole Fasuyi | Vacant
Ethics, Code of Conduct & Public Petitions | Sen. Bernard Neda Imasuen | Sen. Ibrahim Mustapha Khalid
FCT | Sen. Ibrahim Bomai | Sen. Samson Akpan Ekong
Federal Character & Governmental Affairs | Sen. Allwell Heacho Onyesoh | Sen. Diket Satso Plang
FERMA | Sen. Hussaini Babaginda Uba | Sen. Tokunbu Mukhail Abiru
Finance | Sen. Mohammed Sani Musa | Sen. Kamorudeen Olalere Oyewumi
Foreign Affairs | Sen. Abubakar Sani Bello | Sen. Seriake Dickson
Gas | Sen. Jarigbe Agom Jarigbe | Sen. Jimoh Folorunsho Ibrahim
Health | Sen. Ipalibo Harry-Banigo | Sen. Sumaila Abdulrahman Kawu
Housing & Urban Development | Sen. Aminu Waziri Tambuwal | Sen. Okechukwu Ezea
ICT & Cybercrimes | Sen. Salisu Afolabi Shuaibu | Sen. Sumaila Abdulrahman Kawu
INEC | Sen. Sharafadeen Abiodun Alli | Sen. Abdulaziz Musa Yar’adua
Information & National Orientation | Sen. Kenneth Emeka Eze | Sen. Musa Garba Maidoki
Interior | Sen. Adams Oshiomole | Vacant
Power | Sen. Enyinnaya Harcourt Abaribe | Sen. Oyelola Yisa Ashiru
Public Accounts | Sen. Ahmed Aliyu Wadada | Sen. Peter Onyeka Nwebonyi
Public Procurement | Sen. Monday Okpebholo | Vacant
Primary Healthcare, Development & Disease Control | Sen. Ibrahim Lamido | Sen. Tony Okechukwu Nwoye
Privatization | Sen. Orji Uzor Kalu | Sen. Emmanuel Udende
Rules & Business | Sen. Titus Zam | Sen. Michael Opeyemi Bamidele
Science & Technology | Sen. Aminu Iya Abbas | Sen. Kelvin Chukwu
"""

senators_json = """
[
    { "name": "Austin Akobundu", "role": "Senator", "constituency": "Abia Central", "state": "Abia", "party": "PDP" },
    { "name": "Orji Uzor Kalu", "role": "Senator", "constituency": "Abia North", "state": "Abia", "party": "APC" },
    { "name": "Enyinnaya Abaribe", "role": "Senator", "constituency": "Abia South", "state": "Abia", "party": "APGA" },
    { "name": "Abbas Aminu Iya", "role": "Senator", "constituency": "Adamawa Central", "state": "Adamawa", "party": "PDP" },
    { "name": "Amos Yohanna", "role": "Senator", "constituency": "Adamawa North", "state": "Adamawa", "party": "PDP" },
    { "name": "Binos Dauda Yaroe", "role": "Senator", "constituency": "Adamawa South", "state": "Adamawa", "party": "PDP" },
    { "name": "Bassey Aniekan Etim", "role": "Senator", "constituency": "Akwa Ibom North-East", "state": "Akwa Ibom", "party": "PDP" },
    { "name": "Godswill Akpabio", "role": "Senator", "constituency": "Akwa Ibom North-West", "state": "Akwa Ibom", "party": "APC" },
    { "name": "Akpan Ekong Sampson", "role": "Senator", "constituency": "Akwa Ibom South", "state": "Akwa Ibom", "party": "PDP" },
    { "name": "Umeh Victor Chukwunonyelu", "role": "Senator", "constituency": "Anambra Central", "state": "Anambra", "party": "LP" },
    { "name": "Tony Nwoye", "role": "Senator", "constituency": "Anambra North", "state": "Anambra", "party": "LP" },
    { "name": "Ifeanyi Ubah", "role": "Senator", "constituency": "Anambra South", "state": "Anambra", "party": "YPP" },
    { "name": "Ahmed Abdul Ningi", "role": "Senator", "constituency": "Bauchi Central", "state": "Bauchi", "party": "PDP" },
    { "name": "Samaila Dahuwa Kaila", "role": "Senator", "constituency": "Bauchi North", "state": "Bauchi", "party": "PDP" },
    { "name": "Umar Shehu Buba", "role": "Senator", "constituency": "Bauchi South", "state": "Bauchi", "party": "APC" },
    { "name": "Benson Friday Konbowei", "role": "Senator", "constituency": "Bayelsa Central", "state": "Bayelsa", "party": "PDP" },
    { "name": "Agadaga Benson Sunday", "role": "Senator", "constituency": "Bayelsa East", "state": "Bayelsa", "party": "PDP" },
    { "name": "Henry Seriake Dickson", "role": "Senator", "constituency": "Bayelsa West", "state": "Bayelsa", "party": "PDP" },
    { "name": "Udende Memsa Emmanuel", "role": "Senator", "constituency": "Benue North-East", "state": "Benue", "party": "APC" },
    { "name": "Titus Tartengar Zam", "role": "Senator", "constituency": "Benue North-West", "state": "Benue", "party": "APC" },
    { "name": "Patrick Abba Moro", "role": "Senator", "constituency": "Benue South", "state": "Benue", "party": "PDP" },
    { "name": "Kaka Shehu Lawan", "role": "Senator", "constituency": "Borno Central", "state": "Borno", "party": "APC" },
    { "name": "Mohammed Tahir Monguno", "role": "Senator", "constituency": "Borno North", "state": "Borno", "party": "APC" },
    { "name": "Mohammed Ali Ndume", "role": "Senator", "constituency": "Borno South", "state": "Borno", "party": "APC" },
    { "name": "Williams Eteng Jonah", "role": "Senator", "constituency": "Cross River Central", "state": "Cross River", "party": "PDP" },
    { "name": "Agom Jarigbe", "role": "Senator", "constituency": "Cross River North", "state": "Cross River", "party": "PDP" },
    { "name": "Ekpeyong Asuquo", "role": "Senator", "constituency": "Cross River South", "state": "Cross River", "party": "APC" },
    { "name": "Dafinone Edeh Omueya", "role": "Senator", "constituency": "Delta Central", "state": "Delta", "party": "APC" },
    { "name": "Nwoko Chinedu Munir", "role": "Senator", "constituency": "Delta North", "state": "Delta", "party": "PDP" },
    { "name": "Joel-Onowakpo Thomas", "role": "Senator", "constituency": "Delta South", "state": "Delta", "party": "APC" },
    { "name": "Eze Kenneth Emeka", "role": "Senator", "constituency": "Ebonyi Central", "state": "Ebonyi", "party": "APC" },
    { "name": "Nwebonyi Onyeka Peter", "role": "Senator", "constituency": "Ebonyi North", "state": "Ebonyi", "party": "APC" },
    { "name": "Okorie Anthony Ani", "role": "Senator", "constituency": "Ebonyi South", "state": "Ebonyi", "party": "APC" },
    { "name": "Okphebolo Monday", "role": "Senator", "constituency": "Edo Central", "state": "Edo", "party": "APC" },
    { "name": "Adams Aliyu Oshiomole", "role": "Senator", "constituency": "Edo North", "state": "Edo", "party": "APC" },
    { "name": "Imasuen Neda Bernards", "role": "Senator", "constituency": "Edo South", "state": "Edo", "party": "APC" },
    { "name": "Michael Opeyemi Bamidele", "role": "Senator", "constituency": "Ekiti Central", "state": "Ekiti", "party": "APC" },
    { "name": "Fasuyi Cyril Oluwole", "role": "Senator", "constituency": "Ekiti North", "state": "Ekiti", "party": "APC" },
    { "name": "Adaramodu Adeyemi Raphael", "role": "Senator", "constituency": "Ekiti South", "state": "Ekiti", "party": "APC" },
    { "name": "Kelvin Chukwu", "role": "Senator", "constituency": "Enugu East", "state": "Enugu", "party": "LP" },
    { "name": "Okechukwu Ezea", "role": "Senator", "constituency": "Enugu North", "state": "Enugu", "party": "LP" },
    { "name": "Ngwu Osita", "role": "Senator", "constituency": "Enugu West", "state": "Enugu", "party": "PDP" },
    { "name": "Ireti Kingibe", "role": "Senator", "constituency": "FCT FCT", "state": "FCT", "party": "LP" },
    { "name": "Mohammed Danjuma Goje", "role": "Senator", "constituency": "Gombe Central", "state": "Gombe", "party": "APC" },
    { "name": "Ibrahim Hassan Dankwambo", "role": "Senator", "constituency": "Gombe North", "state": "Gombe", "party": "PDP" },
    { "name": "Anthony Siyako Yaro", "role": "Senator", "constituency": "Gombe South", "state": "Gombe", "party": "PDP" },
    { "name": "Ezenwa Francis Onyewuchi", "role": "Senator", "constituency": "Imo East", "state": "Imo", "party": "LP" },
    { "name": "Patrick Ndubueze", "role": "Senator", "constituency": "Imo North", "state": "Imo", "party": "APC" },
    { "name": "Osita Izunaso", "role": "Senator", "constituency": "Imo West", "state": "Imo", "party": "APC" },
    { "name": "Ahmad Abdulhamid Malam Madori", "role": "Senator", "constituency": "Jigawa North-East", "state": "Jigawa", "party": "APC" },
    { "name": "Babangida Hussaini", "role": "Senator", "constituency": "Jigawa North-West", "state": "Jigawa", "party": "APC" },
    { "name": "Mustapha Khabeeb", "role": "Senator", "constituency": "Jigawa South-West", "state": "Jigawa", "party": "PDP" },
    { "name": "Lawal Adamu Usman", "role": "Senator", "constituency": "Kaduna Central", "state": "Kaduna", "party": "PDP" },
    { "name": "Ibrahim Khalid Mustapha", "role": "Senator", "constituency": "Kaduna North", "state": "Kaduna", "party": "PDP" },
    { "name": "Sunday Marshall Katung", "role": "Senator", "constituency": "Kaduna South", "state": "Kaduna", "party": "PDP" },
    { "name": "Rufai Hanga", "role": "Senator", "constituency": "Kano Central", "state": "Kano", "party": "NNPP" },
    { "name": "Barau Jibrin", "role": "Senator", "constituency": "Kano North", "state": "Kano", "party": "APC" },
    { "name": "Suleiman Abdurrahman Kawu Sumaila", "role": "Senator", "constituency": "Kano South", "state": "Kano", "party": "APC" },
    { "name": "Abdul\u2019aziz Musa Yar\u2019adua", "role": "Senator", "constituency": "Katsina Central", "state": "Katsina", "party": "APC" },
    { "name": "Sani Daura", "role": "Senator", "constituency": "Katsina North", "state": "Katsina", "party": "APC" },
    { "name": "Mohammed Muntari Dandutse", "role": "Senator", "constituency": "Katsina South", "state": "Katsina", "party": "APC" },
    { "name": "Adamu Aliero", "role": "Senator", "constituency": "Kebbi Central", "state": "Kebbi", "party": "PDP" },
    { "name": "Yahaya Abubakar Abdullahi", "role": "Senator", "constituency": "Kebbi North", "state": "Kebbi", "party": "PDP" },
    { "name": "Natasha Akpoti", "role": "Senator", "constituency": "Kogi Central", "state": "Kogi", "party": "PDP" },
    { "name": "Jibrin Isah", "role": "Senator", "constituency": "Kogi East", "state": "Kogi", "party": "APC" },
    { "name": "Sunday Karimi", "role": "Senator", "constituency": "Kogi West", "state": "Kogi", "party": "APC" },
    { "name": "Saliu Mustapha", "role": "Senator", "constituency": "Kwara Central", "state": "Kwara", "party": "APC" },
    { "name": "Suleiman Sadiq Umar", "role": "Senator", "constituency": "Kwara North", "state": "Kwara", "party": "APC" },
    { "name": "Lola Ashiru", "role": "Senator", "constituency": "Kwara South", "state": "Kwara", "party": "APC" },
    { "name": "Wasiu Eshinlokun-Sanni", "role": "Senator", "constituency": "Lagos Central", "state": "Lagos", "party": "APC" },
    { "name": "Tokunbo Abiru", "role": "Senator", "constituency": "Lagos East", "state": "Lagos", "party": "APC" },
    { "name": "Oluranti Adebule", "role": "Senator", "constituency": "Lagos West", "state": "Lagos", "party": "APC" },
    { "name": "Godiya Akwashiki", "role": "Senator", "constituency": "Nasarawa North", "state": "Nasarawa", "party": "SDP" },
    { "name": "Mohammed Ogoshi Onawo", "role": "Senator", "constituency": "Nasarawa South", "state": "Nasarawa", "party": "PDP" },
    { "name": "Ahmed Aliyu Wadada", "role": "Senator", "constituency": "Nasarawa West", "state": "Nasarawa", "party": "SDP" },
    { "name": "Sani Musa", "role": "Senator", "constituency": "Niger East", "state": "Niger", "party": "APC" },
    { "name": "Abubakar Sani Bello", "role": "Senator", "constituency": "Niger North", "state": "Niger", "party": "APC" },
    { "name": "Peter Ndalikali Jiya", "role": "Senator", "constituency": "Niger South", "state": "Niger", "party": "PDP" },
    { "name": "Shuaibu Salisu", "role": "Senator", "constituency": "Ogun Central", "state": "Ogun", "party": "APC" },
    { "name": "Gbenga Daniel", "role": "Senator", "constituency": "Ogun East", "state": "Ogun", "party": "APC" },
    { "name": "Solomon Olamilekan Adeola", "role": "Senator", "constituency": "Ogun West", "state": "Ogun", "party": "APC" },
    { "name": "Adeniyi Adegbonmire", "role": "Senator", "constituency": "Ondo Central", "state": "Ondo", "party": "APC" },
    { "name": "Jide Ipinsagba", "role": "Senator", "constituency": "Ondo North", "state": "Ondo", "party": "APC" },
    { "name": "Jimoh Ibrahim", "role": "Senator", "constituency": "Ondo South", "state": "Ondo", "party": "APC" },
    { "name": "Olubiyi Fadeyi", "role": "Senator", "constituency": "Osun Central", "state": "Osun", "party": "PDP" },
    { "name": "Fadahunsi Francis Adenigba", "role": "Senator", "constituency": "Osun East", "state": "Osun", "party": "PDP" },
    { "name": "Lere Oyewumi", "role": "Senator", "constituency": "Osun West", "state": "Osun", "party": "PDP" },
    { "name": "Yunus Akintunde", "role": "Senator", "constituency": "Oyo Central", "state": "Oyo", "party": "APC" },
    { "name": "Abdulfatai Buhari", "role": "Senator", "constituency": "Oyo North", "state": "Oyo", "party": "APC" },
    { "name": "Sharafadeen Alli", "role": "Senator", "constituency": "Oyo South", "state": "Oyo", "party": "APC" },
    { "name": "Diket Plang", "role": "Senator", "constituency": "Plateau Central", "state": "Plateau", "party": "APC" },
    { "name": "Pam Dachungyang", "role": "Senator", "constituency": "Plateau North", "state": "Plateau", "party": "ADP" },
    { "name": "Simon Lalong", "role": "Senator", "constituency": "Plateau South", "state": "Plateau", "party": "APC" },
    { "name": "Allwell Onyeso", "role": "Senator", "constituency": "Rivers East", "state": "Rivers", "party": "PDP" },
    { "name": "Barry Mpigi", "role": "Senator", "constituency": "Rivers South-East", "state": "Rivers", "party": "PDP" },
    { "name": "Ipalibo Banigo", "role": "Senator", "constituency": "Rivers West", "state": "Rivers", "party": "PDP" },
    { "name": "Ibrahim Gobir", "role": "Senator", "constituency": "Sokoto East", "state": "Sokoto", "party": "APC" },
    { "name": "Aliyu Wamakko", "role": "Senator", "constituency": "Sokoto North", "state": "Sokoto", "party": "APC" },
    { "name": "Aminu Tambuwal", "role": "Senator", "constituency": "Sokoto South", "state": "Sokoto", "party": "PDP" },
    { "name": "Haruna Manu", "role": "Senator", "constituency": "Taraba Central", "state": "Taraba", "party": "PDP" },
    { "name": "Shuaibu Isa Lau", "role": "Senator", "constituency": "Taraba North", "state": "Taraba", "party": "PDP" },
    { "name": "David Jimkuta", "role": "Senator", "constituency": "Taraba South", "state": "Taraba", "party": "APC" },
    { "name": "Ibrahim Gaidam", "role": "Senator", "constituency": "Yobe East", "state": "Yobe", "party": "APC" },
    { "name": "Ahmed Lawan", "role": "Senator", "constituency": "Yobe North", "state": "Yobe", "party": "APC" },
    { "name": "Ibrahim Mohammed Bomai", "role": "Senator", "constituency": "Yobe South", "state": "Yobe", "party": "APC" },
    { "name": "Ikra Aliyu Bilbis", "role": "Senator", "constituency": "Zamfara Central", "state": "Zamfara", "party": "PDP" },
    { "name": "Sahabi Alhaji Yaú", "role": "Senator", "constituency": "Zamfara North", "state": "Zamfara", "party": "APC" },
    { "name": "Abdul\u2019aziz Abubakar Yari", "role": "Senator", "constituency": "Zamfara West", "state": "Zamfara", "party": "APC" }
]
"""

senators = json.loads(senators_json)
for s in senators:
    s["committees"] = []

def normalize_name(name):
    name = re.sub(r"^(Sen\.|Hon\.|Mr\.|Mrs\.)\s*", "", name, flags=re.IGNORECASE)
    name = name.strip()
    return name

manual_maps = {
    "Ayodele Adegbonmire": "Adeniyi Adegbonmire",
    "Aniekan Bassey Etim": "Bassey Aniekan Etim",
    "Abdulaziz Musa Yaradua": "Abdul’aziz Musa Yar’adua",
    "Olusegun Oluwole Fasuyi": "Fasuyi Cyril Oluwole",
    "Emmanuel Udende": "Udende Memsa Emmanuel",
    "Tony Okechukwu Nwoye": "Tony Nwoye",
    "Olamilekan Solomon Adeola": "Solomon Olamilekan Adeola",
    "Tokunbo Mukhail Abiru": "Tokunbo Abiru",
    "Osita Bonaventure Izunaso": "Osita Izunaso",
    "Olubiyi Oluwole Fadeyi": "Olubiyi Fadeyi",
    "Yau Sahabi": "Sahabi Alhaji Yaú",
    "Nasiru Sani Zangon Daura": "Sani Daura",
    "Isah Jibrin": "Jibrin Isah",
    "Sharafadeen Abiodun Alli": "Sharafadeen Alli",
    "Anthony Yaro Siyako": "Anthony Siyako Yaro",
    "Emmanuel Olajide Ipinsangba": "Jide Ipinsagba",
    "Akintunde Abiodun Yunusa": "Yunus Akintunde",
    "Chinedu Nwoko": "Nwoko Chinedu Munir",
    "Bernard Neda Imasuen": "Imasuen Neda Bernards",
    "Ibrahim Mustapha Khalid": "Ibrahim Khalid Mustapha",
    "Ibrahim Bomai": "Ibrahim Mohammed Bomai",
    "Allwell Heacho Onyesoh": "Allwell Onyeso",
    "Hussaini Babaginda Uba": "Babangida Hussaini",
    "Kamorudeen Olalere Oyewumi": "Lere Oyewumi",
    "Ipalibo Harry-Banigo": "Ipalibo Banigo",
    "Sumaila Abdulrahman Kawu": "Suleiman Abdurrahman Kawu Sumaila",
    "Salisu Afolabi Shuaibu": "Shuaibu Salisu",
    "Oyelola Yisa Ashiru": "Lola Ashiru",
    "Peter Onyeka Nwebonyi": "Nwebonyi Onyeka Peter",
    "Monday Okpebholo": "Okphebolo Monday",
    "Titus Zam": "Titus Tartengar Zam"  # ADDED MISSING MAP
}

def find_senator(name):
    norm_name = normalize_name(name)
    if norm_name in manual_maps:
        norm_name = manual_maps[norm_name]
        
    for s in senators:
        if normalize_name(s["name"]) == norm_name:
            return s
            
    # Try partial match if no exact match
    parts = norm_name.split()
    for s in senators:
        s_parts = normalize_name(s["name"]).split()
        if len(parts) >= 2 and all(p in s_parts for p in parts):
            return s
            
    return None

lines = [l.strip() for l in committees_raw.strip().split("\n") if "|" in l]
for line in lines:
    parts = [p.strip() for p in line.split("|")]
    if len(parts) == 3:
        comm, chair, vice = parts
        
        c_sen = find_senator(chair)
        if c_sen:
            c_sen["committees"].append({"name": comm, "role": "Chairman"})
            
        v_sen = find_senator(vice)
        if v_sen and vice != "Vacant":
            v_sen["committees"].append({"name": comm, "role": "Vice-Chairman"})

# Leadership roles for the 2 special ones
sen_pres = next(s for s in senators if s["name"] == "Godswill Akpabio")
sen_pres["role"] = "Senate President"

# Add contact emails
for s in senators:
    s["contact_email"] = f"{s['name'][0].lower()}.{s['name'].split()[-1].lower()}@nass.gov.ng"

with open("scripts/reps_with_committees.json", "w", encoding="utf-8") as f:
    json.dump(senators, f, indent=4)
print("Updated reps_with_committees.json successfully")
