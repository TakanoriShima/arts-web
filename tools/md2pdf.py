#!/usr/bin/env python3
"""レジメ（Markdown）を PDF に変換する。

使い方:
  python tools/md2pdf.py "レジメ/第17回_JavaScriptの基本2（データ型・演算子・文字列）.md"   # 指定したファイルを変換
  python tools/md2pdf.py --all                               # レジメ/ 内のすべてを変換
  python tools/md2pdf.py --hook                              # Claude Code のフック用（stdin の JSON を読む）

出力: 元の .md と同じフォルダに、同名の .pdf を作る。
仕組み: Markdown → HTML（markdown ライブラリ）→ Edge/Chrome のヘッドレス印刷で PDF。
必要なもの: pip install markdown、Microsoft Edge または Google Chrome
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
HANDOUT_DIR = "レジメ"

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]

CSS = """
@page { size: A4; margin: 16mm 15mm; }
html { font-size: 10.5pt; }
body { font-family: "Yu Gothic", "Meiryo", sans-serif; color: #222; line-height: 1.7; }
h1 { font-size: 20pt; color: #1f4e79; margin: 0 0 12pt; padding-bottom: 4pt; border-bottom: 2px solid #1f4e79; }
h2 { font-size: 15pt; color: #1f4e79; margin: 20pt 0 8pt; padding-bottom: 2pt; border-bottom: 1px solid #9db7d0; }
h3 { font-size: 12.5pt; margin: 16pt 0 6pt; }
h4 { font-size: 11pt; margin: 12pt 0 4pt; }
h1, h2, h3, h4 { break-after: avoid; }
p { margin: 4pt 0 6pt; }
ul, ol { margin: 4pt 0 8pt; padding-left: 20pt; }
li { margin: 1pt 0; }
code { font-family: "MS Gothic", Consolas, monospace; font-size: 9.5pt; background: #f0f0f0; padding: 0 2px; border-radius: 2px; }
pre { font-family: "MS Gothic", Consolas, monospace; font-size: 9pt; line-height: 1.45; background: #f4f4f4;
      border: 1px solid #ddd; border-radius: 3px; padding: 6pt 8pt; margin: 6pt 0 10pt;
      white-space: pre-wrap; word-break: break-all; break-inside: avoid; }
pre code { background: none; padding: 0; font-size: inherit; }
table { border-collapse: collapse; margin: 6pt 0 10pt; width: 100%; break-inside: avoid; }
th, td { border: 1px solid #bbb; padding: 3pt 6pt; text-align: left; vertical-align: top; }
th { background: #1f4e79; color: #fff; }
img { display: block; max-width: 100%; margin: 6pt auto 10pt; break-inside: avoid; }
"""


def find_browser():
    for path in BROWSERS:
        if Path(path).exists():
            return path
    return None


def md_to_pdf(md_path: Path) -> Path:
    browser = find_browser()
    if browser is None:
        raise RuntimeError("Edge または Chrome が見つかりません")

    body = markdown.markdown(
        md_path.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code"],
    )
    # 変換用の HTML は一時フォルダに作るので、<base> でレジメのフォルダを基準にし、
    # レジメから相対パスで参照している画像（images/lessonNN/...）を読み込めるようにする
    base = md_path.resolve().parent.as_uri() + "/"
    html = (
        '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">'
        f'<base href="{base}">'
        f"<title>{md_path.stem}</title><style>{CSS}</style></head><body>{body}</body></html>"
    )

    pdf_path = md_path.with_suffix(".pdf")
    with tempfile.TemporaryDirectory() as tmp:
        html_path = Path(tmp) / "handout.html"
        html_path.write_text(html, encoding="utf-8")
        tmp_pdf = Path(tmp) / "handout.pdf"
        subprocess.run(
            [
                browser,
                "--headless=new",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--user-data-dir={Path(tmp) / 'profile'}",
                f"--print-to-pdf={tmp_pdf}",
                html_path.as_uri(),
            ],
            check=True,
            capture_output=True,
            timeout=90,
        )
        if not tmp_pdf.exists() or tmp_pdf.stat().st_size == 0:
            raise RuntimeError("PDF が生成されませんでした")
        pdf_path.write_bytes(tmp_pdf.read_bytes())
    return pdf_path


def is_handout(path: Path) -> bool:
    return path.suffix.lower() == ".md" and path.parent.name == HANDOUT_DIR


def paths_from_hook() -> list:
    try:
        # Windows では sys.stdin が UTF-8 でないことがあるため、バイト列を UTF-8 で読む
        data = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    except Exception as e:
        print(f"フックの入力（JSON）を読めませんでした: {e}", file=sys.stderr)
        return []
    tool_input = data.get("tool_input") or {}
    tool_response = data.get("tool_response") or {}
    raw = tool_input.get("file_path") or (
        tool_response.get("filePath") if isinstance(tool_response, dict) else None
    )
    return [Path(raw)] if raw else []


def main(argv: list) -> int:
    hook = "--hook" in argv
    if hook:
        targets = paths_from_hook()
    elif "--all" in argv:
        targets = sorted((ROOT / HANDOUT_DIR).glob("*.md"))
    else:
        targets = [Path(a) for a in argv if not a.startswith("--")]

    targets = [t for t in targets if is_handout(t)]
    if not targets:
        if not hook:
            print("変換する Markdown（レジメ/*.md）がありません", file=sys.stderr)
            return 1
        return 0  # フックでは、対象外のファイルは何もしない

    status = 0
    for md_path in targets:
        try:
            out = md_to_pdf(md_path)
            print(f"PDF を作成しました: {out}")
        except Exception as e:  # フックは失敗しても作業を止めない
            print(f"PDF の作成に失敗しました（{md_path.name}）: {e}", file=sys.stderr)
            status = 1
    return 0 if hook else status


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:
            pass
    sys.exit(main(sys.argv[1:]))
