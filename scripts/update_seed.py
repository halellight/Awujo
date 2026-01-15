import json
import os

seed_path = r'c:\Users\danie\.gemini\antigravity\scratch\awujo-ng\src\app\admin\seed\page.tsx'
json_path = r'c:\Users\danie\.gemini\antigravity\scratch\awujo-ng\scripts\reps_with_committees.json'

with open(json_path, 'r', encoding='utf-8') as f:
    reps_data = json.load(f)

with open(seed_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'reps: ['
end_marker = '],'
policies_marker = 'policies: ['

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find start marker")
    exit(1)

# Find the end of the reps array. It ends before policies starts.
policies_idx = content.find(policies_marker)
if policies_idx == -1:
    print("Could not find policies marker")
    exit(1)

# Backtrack from policies_idx to find the last ],
end_idx = content.rfind('],', start_idx, policies_idx)
if end_idx == -1:
    print("Could not find end marker")
    exit(1)

end_idx += 2 # include ],

new_reps_json = json.dumps(reps_data, indent=12)
# Adjust indentation to match the file
new_reps_json = new_reps_json.replace('\n', '\n            ')
replacement = 'reps: ' + new_reps_json + ','

new_content = content[:start_idx] + replacement + content[end_idx:]

with open(seed_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated seed/page.tsx with enriched reps data.")
