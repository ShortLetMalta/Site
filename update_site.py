import os
import re

directory = "/Users/michael/Desktop/Malta Short Let"
replacements = {
    r"2025 Eleva Malta": "2026/2027 Eleva Malta",
    r"Market Report 2025": "Market Report 2026/2027",
    r"in 2025\?": "in 2026/2027?",
    r"compliant in 2025": "compliant in 2026/2027",
    r"2025 Analysis": "2026/2027 Analysis",
    r"March 12, 2025": "March 12, 2026",
    r"February 28, 2025": "February 28, 2026",
    r"February 15, 2025": "February 15, 2026",
    r"\(2024 data\)": "(2026 Forecast Data)",
    r"2025\. MTA License": "2026. MTA License"
}

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        path = os.path.join(directory, filename)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements.items():
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")

# Also sharpen focus in Services.html (since the user is currently looking at it)
# We want to change generic "Management Solutions" to "Short-Let Management Solutions" if not already there.
services_path = os.path.join(directory, "services.html")
if os.path.exists(services_path):
    with open(services_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Sharpening title and headings
    content = content.replace("Management Solutions", "Short-Let Management Solutions")
    content = content.replace("Our Management Solutions", "Our Short-Let Management Solutions")
    
    with open(services_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Sharpened focus in services.html")
