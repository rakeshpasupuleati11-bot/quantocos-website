"""Generate original brand visuals with SD-Turbo on CPU (no GPU on this machine).

Output: assets/img/gen/*.png — 512x768, three abstract panels. No text, no logos,
no faces: these are texture/form grounds that sit behind typography.
"""
import os, sys, time
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img", "gen")
os.makedirs(OUT, exist_ok=True)

print("installing deps...", flush=True)
os.system(f'"{sys.executable}" -m pip install --quiet diffusers transformers accelerate safetensors')

import torch
from diffusers import AutoPipelineForText2Image

print("loading sd-turbo...", flush=True)
pipe = AutoPipelineForText2Image.from_pretrained(
    "stabilityai/sd-turbo", torch_dtype=torch.float32, safety_checker=None
)
pipe.set_progress_bar_config(disable=True)
pipe.to("cpu")

NEG = "text, letters, watermark, logo, person, face, hands, clutter, neon pink, purple, illustration of people"
JOBS = [
    ("hero-panel-form",
     "abstract dark navy architectural form, thin brushed gold filament arcs, deep shadow, "
     "editorial minimal, matte surface, soft rim light, no text, high detail"),
    ("chapter-divider",
     "minimal abstract topography of fine gold contour lines on near-black, single soft light source, "
     "quiet, premium, generous negative space, no text"),
    ("industry-ground",
     "abstract geometric grid of thin lines, faint warm gold highlights on charcoal navy, "
     "architectural blueprint feeling, subtle depth, no text"),
]

for name, prompt in JOBS:
    t0 = time.time()
    img = pipe(
        prompt=prompt,
        negative_prompt=NEG,
        num_inference_steps=4,
        guidance_scale=0.0,
        width=512,
        height=768,
    ).images[0]
    path = os.path.join(OUT, name + ".png")
    img.save(path, optimize=True)
    print(f"SAVED {path} in {time.time()-t0:.1f}s", flush=True)

print("GEN_COMPLETE", flush=True)
