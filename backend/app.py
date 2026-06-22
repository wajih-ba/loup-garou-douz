from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

API_KEY = "0000000000"
GENERATE_URL = "https://aihorde.net/api/v2/generate/async"
STATUS_URL   = "https://aihorde.net/api/v2/generate/status/{}"

ROLE_PROMPTS = {
    "werewolf":     "werewolf, dark forest, glowing red eyes, cinematic, ultra realistic",
    "blackwolf":    "black wolf, shadowy figure, dark aura, cinematic, ultra realistic",
    "infectedwolf": "infected werewolf, toxic green glow, plague, cinematic, ultra realistic",
    "loup-blanc":   "white wolf, moonlight, ethereal, cinematic, ultra realistic",
    "villager":     "medieval villager, simple clothes, village background, realistic",
    "idiot":        "confused medieval villager, comedic expression, fantasy village",
    "elder":        "old wise elder, medieval village, wrinkled face, realistic",
    "seer":         "mystic seer woman, magical crystal ball, glowing runes, fantasy style",
    "witch":        "witch, potion lab, dark magic, candles, fantasy cinematic",
    "barber":       "medieval barber, scissors, dark medieval shop, moody, realistic",
    "retro":        "mysterious time traveler, retro cloak, magical swirls, fantasy cinematic",
}


def poll_status(job_id: str, timeout: int = 120):
    """Poll AI Horde until the job is done or timeout (seconds) is reached."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        res = requests.get(STATUS_URL.format(job_id), timeout=15)
        result = res.json()
        if result.get("done"):
            gens = result.get("generations", [])
            if not gens:
                raise RuntimeError(f"No generations returned: {result}")
            return gens[0]["img"]
        time.sleep(4)
    raise RuntimeError("Timeout: image generation took too long")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    role = data.get("role", "")
    # Allow a free-form custom prompt or fall back to the role mapping
    prompt = data.get("prompt") or ROLE_PROMPTS.get(role) or role

    if not prompt:
        return jsonify({"error": "Missing 'role' or 'prompt'"}), 400

    payload = {
        "prompt": prompt,
        "params": {
            "steps": 25,
            "width": 512,
            "height": 512,
        },
        "nsfw": False,
        "censor_nsfw": True,
    }
    headers = {
        "apikey": API_KEY,
        "Client-Agent": "loup-garou-generator:1.0",
    }

    try:
        r = requests.post(GENERATE_URL, json=payload, headers=headers, timeout=15)
        r.raise_for_status()
        job_data = r.json()
    except Exception as e:
        return jsonify({"error": f"Horde request failed: {e}"}), 502

    if "id" not in job_data:
        return jsonify({"error": f"API error: {job_data}"}), 502

    try:
        img_url = poll_status(job_data["id"])
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 504

    return jsonify({"image": img_url})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
