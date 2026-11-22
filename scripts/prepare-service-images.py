"""Copy original generated hero assets and produce responsive WebP derivatives."""
from pathlib import Path
from PIL import Image
import json
import shutil

ROOT = Path(__file__).resolve().parent.parent
sources = json.loads((ROOT/'scripts/service-image-sources.json').read_text())
originals = ROOT/'output/service-images/originals'
public = ROOT/'public/assets/images/services'
originals.mkdir(parents=True, exist_ok=True)
public.mkdir(parents=True, exist_ok=True)
metadata = {}
for slug, source in sources.items():
    source = Path(source)
    if not source.is_file():
        raise FileNotFoundError(f'{slug}: {source}')
    shutil.copy2(source, originals/f'{slug}.png')
    with Image.open(source) as original:
        im = original.convert('RGB')
        width, height = im.size
        im.save(public/f'{slug}.webp', 'WEBP', quality=86, method=6)
        variants = []
        for target in [960, 1600]:
            target_width = min(target, width)
            resized = im.resize((target_width, round(height*target_width/width)), Image.Resampling.LANCZOS)
            resized.save(public/f'{slug}-{target}.webp', 'WEBP', quality=82, method=6)
            variants.append({'width': target_width, 'url': f'/assets/images/services/{slug}-{target}.webp'})
        variants.append({'width': width, 'url': f'/assets/images/services/{slug}.webp'})
        metadata[slug] = {'width': width, 'height': height, 'sources': variants}
        print(f'{slug}: {width}×{height}')
(ROOT/'src/data/service-media.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(f'Prepared {len(metadata)} original images and responsive derivatives.')
