import json

# Load the existing JSON data
with open("C:\\Users\\Conor\\Desktop\\oil-comparator-static\\oil_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Sort the list by the 'name' key
sorted_data = sorted(data, key=lambda x: x['name'])

# Save the sorted list to a new file (or overwrite the original)
with open("oil_data_sorted.json", "w", encoding="utf-8") as f:
    json.dump(sorted_data, f, indent=2, ensure_ascii=False)

print("Sorting complete. Output saved to 'oil_data_sorted.json'")
