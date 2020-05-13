from pathlib import Path


def combine(root):
    yaml = html = None
    for thing in root.iterdir():
        if thing.is_dir():
            combine(thing)
        elif thing.name == "index.html":
            with open(thing) as f:
                html = f.read()
        elif thing.name == "index.yaml":
            with open(thing) as f:
                yaml = f.read()
            thing.unlink()
    if yaml or html:
        combined = f"---\n{yaml}---\n{html}"
        with open(root / "index.html", "w") as f:
            f.write(combined)
        print(root / "index.html")


combine(Path("content-combined"))
