# -*- coding: utf-8 -*-
"""ギャラクシーラボの銀河カード（自作のイラスト）を作る：python3 tools/make_galaxy_cards.py
本物の望遠鏡の写真ではなく、形の特ちょうを学ぶための絵。cards.js に答え（種類と特ちょう）も書き出す。"""
import os, math, random, json
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "apps", "galaxy", "img")
SPACE = (14, 12, 34)

def stars(im, n, seed=1):
    random.seed(seed * 7 + 1); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = random.randint(0, im.width - 1), random.randint(0, im.height - 1); b = random.randint(80, 220)
        d.point((x, y), fill=(b, b, min(255, b + 20)))

def galaxy(kind, size=360, seed=3, rot=0.0, scale=1.0, tilt=0.75, arms_n=2, wind=3.4):
    random.seed(seed)
    big = Image.new("RGB", (size, size), (0, 0, 0)); g = ImageDraw.Draw(big); c = size / 2
    if kind == "elliptical":
        asp = 0.65 + 0.3 * random.random()
        for r in range(int(size * 0.34), 0, -2):
            t = 1 - r / (size * 0.34); col = (int(120 + 135 * t), int(90 + 140 * t), int(60 + 120 * t))
            g.ellipse((c - r * 1.2, c - r * 1.2 * asp, c + r * 1.2, c + r * 1.2 * asp), fill=col)
    elif kind == "edgeon":
        for r in range(int(size * 0.40), 0, -2):
            t = 1 - r / (size * 0.40); col = (int(110 + 140 * t), int(110 + 130 * t), int(150 + 100 * t))
            g.ellipse((c - r, c - r * 0.16, c + r, c + r * 0.16), fill=col)
        g.line((c - size * 0.33, c, c + size * 0.33, c), fill=(60, 40, 40), width=3)
    else:
        pts = 1800
        for a in range(arms_n):
            for i in range(pts):
                t = i / pts; ang = rot + a * 2 * math.pi / arms_n + t * wind * math.pi
                rr = size * (0.04 + 0.36 * t)
                if kind == "barred":
                    if t < 0.25:
                        x = c + (t / 0.25) * size * 0.16 * (1 if a == 0 else -1) * math.cos(rot); y = c + (t / 0.25) * size * 0.16 * (1 if a == 0 else -1) * math.sin(rot) * tilt + random.gauss(0, 5)
                        g.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(240, 220, 170)); continue
                    ang = rot + a * math.pi + (t - 0.25) * 3.0 * math.pi; rr = size * (0.16 + 0.26 * (t - 0.25) / 0.75)
                if kind == "irregular":
                    x = c + random.gauss(0, size * 0.14) + size * 0.05 * math.sin(i); y = c + random.gauss(0, size * 0.10)
                else:
                    x = c + rr * math.cos(ang) + random.gauss(0, 6); y = c + rr * math.sin(ang) * tilt + random.gauss(0, 6)
                b = int(160 + 90 * (1 - t)); col = (int(b * 0.75), int(b * 0.8), 255) if t > 0.3 else (255, int(b * 0.9), int(b * 0.6))
                rad = 3 if kind != "irregular" else 4
                g.ellipse((x - rad, y - rad, x + rad, y + rad), fill=col)
        if kind != "irregular":
            for r in range(int(size * 0.09), 0, -2):
                t = 1 - r / (size * 0.09); g.ellipse((c - r, c - r * 0.8, c + r, c + r * 0.8), fill=(255, int(220 + 30 * t), int(170 + 70 * t)))
    big = big.filter(ImageFilter.GaussianBlur(3))
    if scale != 1.0:
        s = int(size * scale); small = big.resize((s, s), Image.LANCZOS); big = Image.new("RGB", (size, size), (0, 0, 0)); big.paste(small, ((size - s) // 2, (size - s) // 2))
    im = Image.new("RGB", (size, size), SPACE); stars(im, 70, seed)
    mask = big.convert("L").point(lambda v: 255 if v > 8 else int(v * 30))
    return Image.composite(big, im, mask)

# 種類ごとの特ちょう（質問の木で使う「本当の答え」）
FEAT = {
    "だ円銀河":   {"smooth": 1, "bar": 0, "arms": 0, "irregular": 0, "bright": 1, "blue": 0},
    "渦巻銀河":   {"smooth": 0, "bar": 0, "arms": 1, "irregular": 0, "bright": 1, "blue": 1},
    "棒渦巻銀河": {"smooth": 0, "bar": 1, "arms": 1, "irregular": 0, "bright": 1, "blue": 1},
    "不規則銀河": {"smooth": 0, "bar": 0, "arms": 0, "irregular": 1, "bright": 0, "blue": 1},
}
KIND = {"だ円銀河": "elliptical", "渦巻銀河": "spiral", "棒渦巻銀河": "barred", "不規則銀河": "irregular"}

def main():
    os.makedirs(OUT, exist_ok=True)
    plan = (["だ円銀河"] * 6) + (["渦巻銀河"] * 6) + (["棒渦巻銀河"] * 4) + (["不規則銀河"] * 4)
    random.seed(2027); random.shuffle(plan)
    cards = []
    for i, t in enumerate(plan, 1):
        r = random.Random(i * 13)
        im = galaxy(KIND[t], 300, seed=100 + i, rot=r.random() * 6.28, scale=0.65 + 0.35 * r.random(), tilt=0.5 + 0.45 * r.random(),
                    arms_n=2 if r.random() < 0.8 else 3, wind=2.6 + 1.4 * r.random())
        im = im.rotate(r.random() * 360, resample=Image.BICUBIC, fillcolor=SPACE)
        im.save(os.path.join(OUT, "card%02d.jpg" % i), quality=85)
        f = dict(FEAT[t]); cards.append({"id": i, "img": "img/card%02d.jpg" % i, "type": t, "f": f})
    # みんなで分類する5つ（1つは横から見た円ばんで、意見が分かれやすい）
    vote = [("elliptical", {}), ("spiral", {"tilt": 0.8}), ("edgeon", {}), ("barred", {"rot": 0.6, "tilt": 0.7}), ("irregular", {})]
    for i, (k, kw) in enumerate(vote, 1):
        galaxy(k, 360, seed=500 + i, **kw).save(os.path.join(OUT, "vote%d.png" % i))
    with open(os.path.join(ROOT, "apps", "galaxy", "cards.js"), "w", encoding="utf-8") as fp:
        fp.write("/* 銀河カード20枚の答え（tools/make_galaxy_cards.py が作る） */\nwindow.GALAXY_CARDS = " + json.dumps(cards, ensure_ascii=False, indent=1) + ";\n")
    print(len(cards), "cards")

if __name__ == "__main__":
    main()
