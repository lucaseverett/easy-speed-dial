#!/usr/bin/env python3
"""Remove editor metadata from SVG thumbnails while preserving rendering data."""

from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


EDITOR_NAMESPACE_MARKERS = (
    "inkscape",
    "sodipodi",
    "adobe",
    "sketch",
    "serif",
)

DROP_LOCAL_TAGS = {"metadata", "title", "desc", "namedview"}
DROP_ATTR_LOCAL_NAMES = {
    "data-name",
    "enable-background",
    "version",
}
DROP_ROOT_ATTR_LOCAL_NAMES = {"width", "height"}


def strip_preamble(svg: str) -> str:
    svg = re.sub(r"^\s*<\?xml[^>]*>\s*", "", svg)
    svg = re.sub(r"^\s*<!DOCTYPE[^>]*(?:\[[\s\S]*?\]\s*)?>\s*", "", svg)
    svg = re.sub(r"<!--[\s\S]*?-->", "", svg)
    return svg.strip()


def local_name(name: str) -> str:
    return name.rsplit("}", 1)[-1] if name.startswith("{") else name


def namespace_uri(name: str) -> str:
    if not name.startswith("{"):
        return ""
    return name[1:].split("}", 1)[0]


def is_editor_name(name: str) -> bool:
    haystack = f"{namespace_uri(name)} {local_name(name)}".lower()
    return any(marker in haystack for marker in EDITOR_NAMESPACE_MARKERS)


def should_drop_element(element: ET.Element) -> bool:
    return local_name(element.tag).lower() in DROP_LOCAL_TAGS or is_editor_name(element.tag)


def clean_element(element: ET.Element, is_root: bool = False) -> None:
    for child in list(element):
        if should_drop_element(child):
            element.remove(child)
            continue
        clean_element(child)

    for attr_name in list(element.attrib):
        attr_local = local_name(attr_name).lower()
        if is_editor_name(attr_name):
            del element.attrib[attr_name]
            continue
        if attr_local in DROP_ATTR_LOCAL_NAMES:
            del element.attrib[attr_name]
            continue
        if is_root and attr_local in DROP_ROOT_ATTR_LOCAL_NAMES:
            del element.attrib[attr_name]


def remove_unused_namespace_declarations(svg: str) -> str:
    return re.sub(
        r'\s+xmlns:(?:inkscape|sodipodi|adobe|sketch|serif)="[^"]*"',
        "",
        svg,
        flags=re.IGNORECASE,
    )


def clean_svg(path: Path, check: bool) -> bool:
    original = path.read_text(encoding="utf-8")
    stripped = strip_preamble(original)

    try:
        root = ET.fromstring(stripped)
    except ET.ParseError as error:
        raise SystemExit(f"{path}: invalid SVG XML: {error}") from error

    if namespace_uri(root.tag) == "http://www.w3.org/2000/svg":
        ET.register_namespace("", "http://www.w3.org/2000/svg")
    if "http://www.w3.org/1999/xlink" in stripped:
        ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

    clean_element(root, is_root=True)
    cleaned = ET.tostring(root, encoding="unicode", short_empty_elements=True)
    cleaned = remove_unused_namespace_declarations(cleaned)
    cleaned = re.sub(r">\s+<", "><", cleaned).strip() + "\n"

    if cleaned == original:
        return False

    if check:
        return True

    path.write_text(cleaned, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("svg", nargs="+", type=Path)
    parser.add_argument("--check", action="store_true", help="report files that would change")
    args = parser.parse_args()

    changed = False
    for svg_path in args.svg:
        if svg_path.suffix.lower() != ".svg":
            raise SystemExit(f"{svg_path}: expected a .svg file")
        changed_for_file = clean_svg(svg_path, args.check)
        changed = changed or changed_for_file
        if changed_for_file:
            action = "would clean" if args.check else "cleaned"
            print(f"{action}: {svg_path}")

    return 1 if args.check and changed else 0


if __name__ == "__main__":
    sys.exit(main())
