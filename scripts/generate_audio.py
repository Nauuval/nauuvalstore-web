import asyncio
import edge_tts
import os
import math
import struct
import wave
import random

VOICE = "id-ID-ArdiNeural"
RATE = "+15%"

TTS_SCENES = [
    {
        "filename": "public/audio/tts-scene1.mp3",
        "text": "Waspada! Hati-hati dengan dua akun penipu ini yang mencuri foto profil dan re-upload video mimin. Jangan pernah transaksi dengan mereka!"
    },
    {
        "filename": "public/audio/tts-scene2.mp3",
        "text": "Akun resmi mimin cuma satu, yaitu at nauuvalstore! Mau order aman dan terpercaya? Langsung klik link di bio profil!"
    },
    {
        "filename": "public/audio/tts-scene3.mp3",
        "text": "Di web resmi, kamu bisa cek katalog lengkap dan stok real-time item Fisch dan Blox Fruit tanpa perlu tanya admin!"
    },
    {
        "filename": "public/audio/tts-scene4.mp3",
        "text": "Kamu bisa pesan banyak item sekaligus lewat keranjang belanja, dan langsung otomatis dibuatkan kode tiket resmi!"
    },
    {
        "filename": "public/audio/tts-scene5.mp3",
        "text": "Tinggal klik kirim pesanan, langsung terhubung ke WhatsApp resmi admin. Seratus persen aman dan anti hackback! Klik link di bio sekarang!"
    }
]

async def generate_tts():
    for item in TTS_SCENES:
        print(f"Generating TTS for {item['filename']}...")
        communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE)
        await communicate.save(item["filename"])
        size = os.path.getsize(item["filename"])
        print(f"Done: {item['filename']} ({size} bytes)")

def create_wave(filename, samples, sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        for s in samples:
            # clamp to 16-bit range
            val = max(-32767, min(32767, int(s * 32767)))
            wav_file.writeframes(struct.pack('<h', val))
    print(f"Generated SFX: {filename}")

def generate_sfx():
    sample_rate = 44100

    # 1. Alert warning buzzer (two pulse beeps)
    alert_samples = []
    duration = 0.4
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        # two beeps: 0-0.18s and 0.22-0.4s
        envelope = 0
        if t < 0.18:
            envelope = math.sin(math.pi * t / 0.18)
        elif t > 0.22 and t < 0.4:
            envelope = math.sin(math.pi * (t - 0.22) / 0.18)
        # square-like pulse for attention
        sig = math.sin(2 * math.pi * 880 * t) + 0.3 * math.sin(2 * math.pi * 1760 * t)
        alert_samples.append(sig * envelope * 0.4)
    create_wave("public/audio/sfx-alert.wav", alert_samples)

    # 2. Stamp / Thud impact
    stamp_samples = []
    duration = 0.35
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        decay = math.exp(-t * 14)
        # pitch drops rapidly from 180Hz to 40Hz
        freq = 40 + 140 * math.exp(-t * 25)
        phase = 2 * math.pi * freq * t
        sub = math.sin(phase)
        # transient click / noise punch
        noise = (random.random() * 2 - 1) * math.exp(-t * 50)
        stamp_samples.append((sub * 0.7 + noise * 0.4) * decay)
    create_wave("public/audio/sfx-stamp.wav", stamp_samples)

    # 3. Whoosh / Swoosh transition
    whoosh_samples = []
    duration = 0.32
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        # peak in the middle
        envelope = math.sin(math.pi * t / duration) ** 2
        # sweep frequency downwards
        freq = 300 + 800 * math.exp(-t * 8)
        noise = (random.random() * 2 - 1) * 0.5
        sig = math.sin(2 * math.pi * freq * t) * 0.5 + noise
        whoosh_samples.append(sig * envelope * 0.35)
    create_wave("public/audio/sfx-whoosh.wav", whoosh_samples)

    # 4. Click / Mobile tap
    click_samples = []
    duration = 0.08
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        decay = math.exp(-t * 80)
        sig = math.sin(2 * math.pi * 2400 * t)
        click_samples.append(sig * decay * 0.5)
    create_wave("public/audio/sfx-click.wav", click_samples)

    # 5. Cash register / Coin chime (Keranjang & Total)
    coin_samples = []
    duration = 0.55
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        # two quick high bell notes (E6 = 1318Hz, B6 = 1975Hz)
        env1 = math.exp(-t * 12) if t < 0.4 else 0
        env2 = math.exp(-(t - 0.09) * 10) if t >= 0.09 else 0
        sig1 = math.sin(2 * math.pi * 1318 * t) * env1
        sig2 = math.sin(2 * math.pi * 1975 * t) * env2
        coin_samples.append((sig1 * 0.4 + sig2 * 0.5) * 0.6)
    create_wave("public/audio/sfx-coin.wav", coin_samples)

    # 6. WhatsApp Sent / Success Ding
    ding_samples = []
    duration = 0.6
    total_frames = int(sample_rate * duration)
    for i in range(total_frames):
        t = i / sample_rate
        # cheerful rising two-tone chime (G5 = 784Hz, C6 = 1046Hz)
        env1 = math.exp(-t * 10) if t < 0.4 else 0
        env2 = math.exp(-(t - 0.12) * 8) if t >= 0.12 else 0
        sig1 = math.sin(2 * math.pi * 784 * t) * env1
        sig2 = math.sin(2 * math.pi * 1046 * t) * env2
        ding_samples.append((sig1 * 0.4 + sig2 * 0.5) * 0.6)
    create_wave("public/audio/sfx-ding.wav", ding_samples)

async def main():
    await generate_tts()
    generate_sfx()
    print("All audio assets generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
