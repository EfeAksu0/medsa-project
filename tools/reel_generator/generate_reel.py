import os
import random
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips, vfx, CompositeVideoClip, TextClip

# --- CONFIGURATION ---
INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"
MUSIC_FOLDER = "music"
TARGET_DURATION = 15  # seconds
CLIP_DURATION = 2.5   # seconds per clip (approx)
OUTPUT_FILENAME = "medysa_auto_reel.mp4"

def create_reel():
    # 1. Get all video files
    video_files = [f for f in os.listdir(INPUT_FOLDER) if f.endswith(('.mp4', '.mov', '.MOV'))]
    if not video_files:
        print("❌ No video files found in 'input' folder!")
        return

    print(f"📹 Found {len(video_files)} videos. selecting clips...")

    # 2. Select and process clips
    clips = []
    current_duration = 0
    
    # Shuffle files to mix it up
    random.shuffle(video_files)

    for filename in video_files:
        if current_duration >= TARGET_DURATION:
            break

        path = os.path.join(INPUT_FOLDER, filename)
        try:
            video = VideoFileClip(path)
            
            # Resize to vertical 9:16 if needed (basic crop)
            # Assuming already 9:16 vertical from phone, but safety check:
            if video.w > video.h:
                 # It's horizontal, crop center to vertical
                 video = video.crop(x1=video.w/2 - 540, width=1080, height=1920) 
            
            # Random start time
            max_start = max(0, video.duration - CLIP_DURATION)
            start_time = random.uniform(0, max_start)
            
            # Cut clip
            cut = video.subclip(start_time, start_time + CLIP_DURATION)
            
            # Add simple fade in/out for smooth transitions
            cut = cut.crossfadein(0.2)
            
            clips.append(cut)
            current_duration += CLIP_DURATION
            print(f"  ✅ Added clip from {filename}")
            
        except Exception as e:
            print(f"  ⚠️ Error processing {filename}: {e}")

    if not clips:
        print("❌ Could not create clips.")
        return

    # 3. Concatenate
    print("🔄 Merging clips...")
    final_video = concatenate_videoclips(clips, method="compose")

    # 4. Add Music (If available)
    music_files = [f for f in os.listdir(MUSIC_FOLDER) if f.endswith(('.mp3', '.wav'))]
    if music_files:
        music_path = os.path.join(MUSIC_FOLDER, random.choice(music_files))
        print(f"🎵 Adding music: {music_path}")
        audio = AudioFileClip(music_path)
        
        # Loop or trim music to fit video
        if audio.duration < final_video.duration:
             # simple approach: just use what we have, or loop (advanced)
             pass 
        else:
            audio = audio.subclip(0, final_video.duration)
            
        final_video = final_video.set_audio(audio)
    else:
        print("⚠️ No music found in 'music' folder. Reel will be silent (or original audio).")

    # 5. Export
    output_path = os.path.join(OUTPUT_FOLDER, OUTPUT_FILENAME)
    print(f"💾 Render started... saving to {output_path}")
    
    # Use 'libx264' for better compatibility, preset 'ultrafast' for speed
    final_video.write_videofile(
        output_path, 
        codec='libx264', 
        audio_codec='aac', 
        preset='slow',  # Better quality
        fps=60,         # Match input 60fps
        bitrate='50000k' # High bitrate for 4K
    )
    print("✨ DONE! Reel created.")

if __name__ == "__main__":
    create_reel()
