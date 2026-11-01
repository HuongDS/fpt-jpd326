import os
import sys
import re
import json
import zipfile
import xml.etree.ElementTree as ET
import docx

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(ROOT_DIR, 'web_app')
DATA_DIR = os.path.join(APP_DIR, 'data')
ASSETS_DIR = os.path.join(APP_DIR, 'assets')
SLIDES_IMG_DIR = os.path.join(ASSETS_DIR, 'slides')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SLIDES_IMG_DIR, exist_ok=True)

def parse_kanji():
    kanji_path = os.path.join(ROOT_DIR, 'kanji', 'kanji.docx')
    doc = docx.Document(kanji_path)
    lessons = ['第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課']
    kanji_list = []

    for t_idx, t in enumerate(doc.tables):
        lesson = lessons[t_idx] if t_idx < len(lessons) else f'第 {t_idx+6} 課'
        r_idx = 0
        while r_idx < len(t.rows):
            r1 = [c.text.strip() for c in t.rows[r_idx].cells]
            r2 = [c.text.strip() for c in t.rows[r_idx+1].cells] if r_idx + 1 < len(t.rows) else ['', '', '']
            
            c0 = r1[0].replace('\n', ' ')
            m = re.search(r'([^\(\s]+)\s*\((.*?)\)', c0)
            kanji_char = m.group(1).strip() if m else c0
            han_viet = m.group(2).strip() if m else ''
            
            onyomi = r1[1].replace('音：', '').replace('音:', '').strip() if len(r1) > 1 else ''
            kunyomi = r1[2].replace('訓：', '').replace('訓:', '').strip() if len(r1) > 2 else ''

            # Clean Kunyomi: fix typo in 置 and detect kanji without Kunyomi
            if kanji_char == '置':
                kunyomi = 'おく'
            elif kunyomi.startswith('音') or kunyomi == onyomi or kunyomi.replace('音：', '').strip() == onyomi:
                kunyomi = ''
            
            examples_on = r2[1] if len(r2) > 1 else ''
            examples_kun = r2[2] if len(r2) > 2 else ''
            examples_raw = (examples_on + '\n' + examples_kun).strip()

            # Parse individual compound words
            compounds = []
            for line in re.split(r'[\n\|]+', examples_raw):
                line = line.strip()
                if not line: continue
                # Match pattern: 形成 (けいせい): hình thành
                cm = re.match(r'^(.*?)\s*\((.*?)\)\s*:\s*(.*)$', line)
                if cm:
                    compounds.append({
                        'word': cm.group(1).strip(),
                        'reading': cm.group(2).strip(),
                        'meaning': cm.group(3).strip()
                    })
                else:
                    compounds.append({
                        'word': line,
                        'reading': '',
                        'meaning': ''
                    })
            
            kanji_list.append({
                'id': f'kanji_{len(kanji_list)+1}',
                'lesson': lesson,
                'kanji': kanji_char,
                'han_viet': han_viet,
                'onyomi': onyomi,
                'kunyomi': kunyomi,
                'examples_raw': examples_raw,
                'compounds': compounds
            })
            r_idx += 2

    print(f"Parsed {len(kanji_list)} Kanji items.")
    return kanji_list

def parse_vocab():
    vocab_path = os.path.join(ROOT_DIR, 'tu_vung', 'toan_bo_tu_vung.docx')
    doc = docx.Document(vocab_path)
    current_lesson = '第 6 課'
    current_part = 'Part 1'
    vocab_list = []

    for child in doc.element.body:
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(child, doc)
            txt = p.text.strip()
            if not txt: continue
            if '第' in txt and '課' in txt and 'TỔNG HỢP' not in txt:
                current_lesson = txt
            elif 'Part' in txt or '知って楽しむ' in txt:
                current_part = txt.rstrip(':')
        elif tag == 'tbl':
            t = docx.table.Table(child, doc)
            for r in t.rows:
                c = [cell.text.strip() for cell in r.cells]
                if len(c) >= 3:
                    kanji_word = c[0]
                    kana_reading = c[1]
                    meaning = c[2]
                    if not kanji_word and not kana_reading and not meaning:
                        continue
                    display_word = kanji_word if kanji_word else kana_reading
                    vocab_list.append({
                        'id': f'vocab_{len(vocab_list)+1}',
                        'lesson': current_lesson,
                        'part': current_part,
                        'kanji': kanji_word,
                        'kana': kana_reading,
                        'display': display_word,
                        'meaning': meaning
                    })
    print(f"Parsed {len(vocab_list)} Vocabulary items.")
    return vocab_list

def parse_grammar():
    grammar_path = os.path.join(ROOT_DIR, "ngu_phap", "toan_bo_ngu_phap.docx")
    doc = docx.Document(grammar_path)
    current_lesson = '第 6 課'
    grammar_list = []
    curr_grammar = None
    state = 'title'

    for child in doc.element.body:
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(child, doc)
            txt = p.text.strip()
            if not txt:
                continue
            if '第' in txt and '課' in txt and 'TỔNG HỢP' not in txt:
                current_lesson = txt.strip()
                continue

            # Check if rule title
            is_rule_title = False
            m = re.match(r'^(\d+)\s*[\.\:](.*)', txt)
            if m:
                rest = m.group(2).strip()
                # Dialogue lines like "A: Party..." should not be treated as a new rule
                if not (rest.startswith('A:') or rest.startswith('B:') or rest.startswith('A：') or rest.startswith('B：')):
                    has_vietnamese = bool(re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', rest, re.I))
                    if has_vietnamese or rest.endswith(':') or rest.endswith('：') or '~' in rest or '…' in rest or rest.startswith('～'):
                        is_rule_title = True

            if is_rule_title:
                if curr_grammar:
                    grammar_list.append(curr_grammar)
                curr_grammar = {
                    'id': f'grammar_{len(grammar_list)+1}',
                    'lesson': current_lesson,
                    'title': txt,
                    'formula': '',
                    'points': '',
                    'examples': []
                }
                state = 'formula'
            elif curr_grammar:
                if txt.startswith('例:') or txt.startswith('例：') or txt.startswith('例'):
                    state = 'examples'
                    curr_grammar['examples'].append(txt)
                elif state == 'examples':
                    curr_grammar['examples'].append(txt)
                elif txt.startswith('ポイント') or 'ポイント:' in txt or 'ポイント：' in txt:
                    state = 'points'
                    clean_txt = re.sub(r'^ポイント\s*[\:：]\s*', '', txt)
                    curr_grammar['points'] = (curr_grammar['points'] + '\n' + clean_txt).strip()
                elif state == 'points':
                    curr_grammar['points'] = (curr_grammar['points'] + '\n' + txt).strip()
                else: # state == 'formula'
                    curr_grammar['formula'] = (curr_grammar['formula'] + '\n' + txt).strip()

        elif tag == 'tbl':
            t = docx.table.Table(child, doc)
            tbl_text = '\n'.join(' | '.join(c.text.strip() for c in r.cells) for r in t.rows if any(c.text.strip() for c in r.cells))
            if curr_grammar:
                if not curr_grammar['formula']:
                    curr_grammar['formula'] = tbl_text
                else:
                    curr_grammar['formula'] += '\n' + tbl_text

    if curr_grammar:
        grammar_list.append(curr_grammar)

    # Re-index IDs cleanly
    for idx, g in enumerate(grammar_list):
        g['id'] = f'grammar_{idx + 1}'

    # Manual quality enhancements for edge cases
    manual_adjustments = {
        '1. Được bao quanh bởi N:': {
            'points': 'Diễn tả trạng thái một nơi chốn/sự vật được bao bọc hoặc vây quanh bởi danh từ N.'
        },
        '2. Chiếm…:': {
            'points': 'Biểu thị tỷ lệ, phần trăm hoặc vị trí mà đối tượng chiếm giữ trong một tổng thể.'
        },
        '5. Phòng khi, để chuẩn bị cho…:': {
            'points': 'Hành động chuẩn bị trước để đối phó hoặc phòng bị cho tình huống N (thiên tai, kỳ thi, sự cố...).'
        },
        '5. ～かなと思って:': {
            'formula': 'V普通形 + かなと思って',
            'points': 'Cấu trúc mời rủ một cách ngại ngần, khách khí, thăm dò ý kiến đối phương.'
        },
        '8. ものだ:': {
            'points': 'Diễn tả chân lý tự nhiên (Vる), thói quen trong quá khứ (Vた), hoặc mong muốn tha thiết (Vたい).'
        },
        '9. Thể sai khiến:': {
            'formula': 'V使役形 (～(さ)せる)',
            'points': 'Đi cùng với động từ chỉ cảm xúc (驚く、笑う、怒る、泣く、喜ぶ、悲しむ、安心する、困る、楽しむ、びっくりする…), mang ý nghĩa: Làm ai đó cảm thấy thế nào.'
        },
        '2. Như, theo như…:': {
            'points': 'Dùng để nêu ví dụ, so sánh hoặc trích dẫn: Theo như…, giống như…'
        },
        '5. Có lẽ…, có phải không…:': {
            'points': 'Dùng để diễn tả suy đoán hoặc hỏi ý kiến nhẹ nhàng: Có lẽ…, có phải không…'
        },
        '4. Tôi xin phép được…:': {
            'points': 'Cách nói khiêm nhường xin phép đối phương để mình được thực hiện hành động: Tôi xin phép được…'
        },
        '5. Khiêm nhường ngữ:': {
            'points': 'Mẫu câu khiêm nhường ngữ trang trọng lịch sự, hạ mình để nâng cao sự tôn kính với đối phương.'
        },
        '8. ～ております:': {
            'formula': 'Vて + おります',
            'points': 'Khiêm nhường ngữ lịch sự của ～ています.'
        }
    }

    for g in grammar_list:
        for title_key, adj in manual_adjustments.items():
            if title_key in g['title']:
                if 'formula' in adj and not g['formula']:
                    g['formula'] = adj['formula']
                if 'points' in adj and not g['points']:
                    g['points'] = adj['points']

    print(f"Parsed {len(grammar_list)} Grammar points.")
    return grammar_list

def main():
    print("=== Starting Complete Dataset Extraction ===")
    kanji = parse_kanji()
    vocab = parse_vocab()
    grammar = parse_grammar()

    # Save individual JSON files
    with open(os.path.join(DATA_DIR, 'kanji.json'), 'w', encoding='utf-8') as f:
        json.dump(kanji, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, 'vocabulary.json'), 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, 'grammar.json'), 'w', encoding='utf-8') as f:
        json.dump(grammar, f, ensure_ascii=False, indent=2)

    # Save combined JS file so that index.html can load data via script tag
    # without any CORS restrictions if opened directly as file://
    combined_data = {
        'kanji': kanji,
        'vocabulary': vocab,
        'grammar': grammar
    }
    
    js_content = f"// Auto-generated data for Nihongo Speed Master\nwindow.APP_DATA = {json.dumps(combined_data, ensure_ascii=False, indent=2)};\n"
    with open(os.path.join(DATA_DIR, 'app_data.js'), 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("=== Extraction Finished Successfully! ===")
    print(f"Kanji count: {len(kanji)}")
    print(f"Vocabulary count: {len(vocab)}")
    print(f"Grammar count: {len(grammar)}")

if __name__ == '__main__':
    main()
