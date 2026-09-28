#!/usr/bin/env python3
"""レジメ（Markdown）を PDF に変換する。

使い方:
  python tools/md2pdf.py "レジメ/第17回_JavaScriptの基本2（データ型・演算子・文字列）.md"   # 指定したファイルを変換
  python tools/md2pdf.py --all                               # レジメ/ 内のすべて（第16〜30回）を変換
  python tools/md2pdf.py --hook                              # Claude Code のフック用（stdin の JSON を読む）

出力: リポジトリ直下の pdf/ に、.md と同じ名前の .pdf を作る（レジメ/*.md が正本、pdf/*.pdf は生成物）。
仕組み: Markdown → HTML（markdown ライブラリ）→ Edge/Chrome のヘッドレス印刷で PDF。
必要なもの: pip install markdown、Microsoft Edge または Google Chrome

レイアウト:
  - A4 縦。各ページの下に、教材タイトルと「ページ番号 / 総ページ数」を入れる（CSS の @page）。
  - コードは 1 行ずつ <span class="ln"> に分け、ページは必ず行の境目で変わるようにする。
    長い行は折り返し、折り返した行は元のインデントより少し右から始める。
  - 短いコード（KEEP_LINES 行以下）は、できるだけ 1 ページに収める。長いコードはページをまたいでよい。
  - コードの直前の説明（段落・見出し）だけが、ページの最後に残らないようにする。
  - 画像は <base> でレジメのフォルダを基準にして読み込む（images/lessonNN/...）。
"""
import html as html_lib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
HANDOUT_DIR = "レジメ"
PDF_DIR = ROOT / "pdf"

# この行数以下のコードは、途中でページを変えない（A4 1 ページには、コードが約 55 行入る）
KEEP_LINES = 30
# この行数以下の表は、途中でページを変えない
KEEP_TABLE_ROWS = 8
# この文字数以下の表のセルは、折り返さない（「第 21・22 回」などが 2 行に割れるのを防ぐ）
NOWRAP_CELL_CHARS = 12

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]

# コードは MS ゴシック（日本語がちょうど英数字 2 文字分の幅なので、← のコメントの位置がそろう）。
# ただし、MS ゴシックの " ' ` は斜めの形で「“ ”」と見まちがえやすいので、この 3 文字だけ Consolas で表示する。
CODE_FONT = '"CodeQuote", "MS Gothic", Consolas, monospace'

CSS = """
@font-face { font-family: "CodeQuote"; src: local("Consolas"); unicode-range: U+0022, U+0027, U+0060; }
@page {
  size: A4 portrait;
  margin: 15mm 15mm 17mm;
  @bottom-left {
    content: "__TITLE__";
    font-family: "Yu Gothic", "Meiryo", sans-serif; font-weight: 500; font-size: 8pt; color: #666;
  }
  @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: "Yu Gothic", "Meiryo", sans-serif; font-weight: 500; font-size: 8pt; color: #666;
  }
}
html { font-size: 10.5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "Yu Gothic", "Meiryo", sans-serif; font-weight: 500; color: #222; line-height: 1.7;
       overflow-wrap: break-word; }
strong, b, th { font-weight: 700; }
h1 { font-size: 20pt; color: #1f4e79; margin: 0 0 12pt; padding-bottom: 4pt; border-bottom: 2px solid #1f4e79; }
h2 { font-size: 15pt; color: #1f4e79; margin: 20pt 0 8pt; padding-bottom: 2pt; border-bottom: 1px solid #9db7d0; }
h3 { font-size: 12.5pt; margin: 16pt 0 6pt; }
h4 { font-size: 11pt; margin: 12pt 0 4pt; }
h1, h2, h3, h4 { break-after: avoid; break-inside: avoid; }
p { margin: 4pt 0 6pt; orphans: 2; widows: 2; }
ul, ol { margin: 4pt 0 8pt; padding-left: 20pt; }
li { margin: 1pt 0; orphans: 2; widows: 2; }
li > ul, li > ol { margin: 1pt 0 2pt; }
hr { border: none; border-top: 1px solid #bbb; margin: 12pt 0; }

/* コードの直前の説明（「sample/main.js に書く」など）だけがページの最後に残らないようにする */
p:has(+ pre), ul:has(+ pre), ol:has(+ pre) { break-after: avoid; }
/* 図・表の直前の説明も、図・表と同じページに置く */
p:has(+ p > img), p:has(+ table) { break-after: avoid; }
/* 「演習」の見出しと 1 行の説明だけが、ページの最後に残らないようにする */
h2 + p:has(+ h3) { break-after: avoid; }

code { font-family: __CODE_FONT__; font-size: 9.5pt; background: #f0f0f0; padding: 0 2px; border-radius: 2px; }
pre { font-family: __CODE_FONT__; font-size: 9pt; line-height: 1.45; background: #f4f4f4;
      border: 1px solid #ddd; border-radius: 3px; padding: 6pt 8pt; margin: 6pt 0 10pt;
      white-space: pre-wrap; overflow-wrap: anywhere; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
pre code { display: block; background: none; padding: 0; border-radius: 0; font-size: inherit; }
pre.keep { break-inside: avoid; }
/* 1 行ずつのブロック。ページは行の境目で変わる。折り返した続きは、元のインデント + 2 文字の位置から始める */
.ln { display: block; min-height: 1.45em; break-inside: avoid;
      padding-left: calc((var(--i, 0) + 2) * 1ch); text-indent: calc((var(--i, 0) + 2) * -1ch); }
/* 長いコードがページをまたぐときも、最初と最後の 2 行だけが別のページに離れないようにする */
.ln.head { break-after: avoid; }
.ln.tail { break-before: avoid; }

table { border-collapse: collapse; margin: 6pt 0 10pt; width: 100%; }
table.keep { break-inside: avoid; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th, td { border: 1px solid #bbb; padding: 3pt 6pt; text-align: left; vertical-align: top; }
th { background: #1f4e79; color: #fff; }
td.nowrap, th.nowrap { white-space: nowrap; }
td code, th code { overflow-wrap: anywhere; }
th code { background: rgba(255, 255, 255, 0.2); color: inherit; }

p:has(> img) { break-inside: avoid; text-align: center; }
img { display: block; max-width: 100%; max-height: 210mm; height: auto; margin: 6pt auto 10pt; break-inside: avoid; }
"""


def find_browser():
    for path in BROWSERS:
        if Path(path).exists():
            return path
    return None


def fix_list_indent(text: str) -> str:
    """レジメは入れ子の箇条書きを 2 文字の字下げで書いている。
    markdown ライブラリは 4 文字を 1 段として扱うので、コードブロックの外の字下げだけを 2 倍にする。"""
    out = []
    in_fence = False
    for line in text.split("\n"):
        if line.startswith("```"):
            in_fence = not in_fence
        elif not in_fence:
            m = re.match(r"^( +)(?=[-*+] |\d+\. )", line)
            if m:
                line = " " * (len(m.group(1)) * 2) + line[len(m.group(1)):]
        out.append(line)
    return "\n".join(out)


def split_code_lines(match) -> str:
    """<pre><code> の中身を 1 行ずつの <span class="ln"> に分ける。"""
    attrs, body = match.group(1), match.group(2)
    lines = body.rstrip("\n").split("\n")
    count = len(lines)
    spans = []
    for n, line in enumerate(lines):
        indent = len(line) - len(line.lstrip(" "))
        classes = ["ln"]
        if count > KEEP_LINES:
            if n < 2:
                classes.append("head")
            if n >= count - 2:
                classes.append("tail")
        spans.append(f'<span class="{" ".join(classes)}" style="--i:{indent}">{line}</span>')
    pre_class = ' class="keep"' if count <= KEEP_LINES else ""
    return f"<pre{pre_class}><code{attrs}>{''.join(spans)}</code></pre>"


def mark_table(match) -> str:
    """短い表は 1 ページに収め、短いセルは折り返さない。"""
    table = match.group(0)
    rows = table.count("<tr")

    def cell(m):
        text = html_lib.unescape(re.sub(r"<[^>]+>", "", m.group(3))).strip()
        if len(text) <= NOWRAP_CELL_CHARS:
            return f'<{m.group(1)}{m.group(2)} class="nowrap">{m.group(3)}</{m.group(1)}>'
        return m.group(0)

    table = re.sub(r"<(td|th)([^>]*)>(.*?)</\1>", cell, table, flags=re.DOTALL)
    if rows <= KEEP_TABLE_ROWS:
        table = table.replace("<table>", '<table class="keep">', 1)
    return table


def build_html(md_path: Path) -> str:
    text = md_path.read_text(encoding="utf-8")
    body = markdown.markdown(
        fix_list_indent(text),
        extensions=["tables", "fenced_code", "sane_lists"],
    )
    body = re.sub(r"<pre><code([^>]*)>(.*?)</code></pre>", split_code_lines, body, flags=re.DOTALL)
    body = re.sub(r"<table>.*?</table>", mark_table, body, flags=re.DOTALL)

    m = re.search(r"^# (.+)$", text, flags=re.MULTILINE)
    title = m.group(1).strip() if m else md_path.stem
    css = (
        CSS.replace("__TITLE__", title.replace("\\", "\\\\").replace('"', '\\"'))
        .replace("__CODE_FONT__", CODE_FONT)
    )
    # 変換用の HTML は一時フォルダに作るので、<base> でレジメのフォルダを基準にし、
    # レジメから相対パスで参照している画像（images/lessonNN/...）を読み込めるようにする
    base = md_path.resolve().parent.as_uri() + "/"
    return (
        '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">'
        f'<base href="{base}">'
        f"<title>{html_lib.escape(md_path.stem)}</title><style>{css}</style></head><body>{body}</body></html>"
    )


def md_to_pdf(md_path: Path) -> Path:
    browser = find_browser()
    if browser is None:
        raise RuntimeError("Edge または Chrome が見つかりません")

    html = build_html(md_path)
    PDF_DIR.mkdir(exist_ok=True)
    pdf_path = PDF_DIR / (md_path.stem + ".pdf")
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
