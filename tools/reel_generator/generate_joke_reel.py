import os
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip

# --- CONFIGURATION ---
INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"
OUTPUT_FILENAME = "fuck_you_reel.mp4"

# Hardcoded video paths based on user directory
USER_VIDEO_NAME = "WhatsApp Video 2026-03-23 at 12.19.29.mp4"
APP_VIDEO_NAME = "kling_20260307_VIDEO_Vertical_9_1675_0.mp4"

def make_text_clip(text, duration, position=('center', 'top'), fontsize=70, color='white', bg_color='black'):
    """Creates a standardized text overlay for short-form video."""
    try:
        # Try to use a bold font, fallback to default if not found
        txt_clip = TextClip(text, fontsize=fontsize, color=color, bg_color=bg_color, font='Arial-Bold', method='caption', size=(900, None))
    except:
        txt_clip = TextClip(text, fontsize=fontsize, color=color, bg_color=bg_color, method='caption', size=(900, None))
        
    txt_clip = txt_clip.set_position((position[0], 250)).set_duration(duration)
    # Add a slight drop shadow effect by duplicating the text
    bg_clip = txt_clip.margin(mar=20, color=(0, 0, 0), opacity=0.8)
    return bg_clip.set_position((position[0], 230)).set_duration(duration)

def create_joke_reel():
    print("Starting Custom Joke Reel Generator...")

    user_video_path = os.path.join(INPUT_FOLDER, USER_VIDEO_NAME)
    app_video_path = os.path.join(INPUT_FOLDER, APP_VIDEO_NAME)

    if not os.path.exists(user_video_path):
        print(f"❌ Error: Cannot find {USER_VIDEO_NAME} in input folder.")
        return
    if not os.path.exists(app_video_path):
        print(f"❌ Error: Cannot find {APP_VIDEO_NAME} in input folder.")
        return

    # 1. PROCESS THE USER "FUCK YOU" CLIP
    print("Processing User Video...")
    clip1 = VideoFileClip(user_video_path)
    
    # Auto-resize/crop to 9:16 vertical format (1080x1920)
    target_w, target_h = 1080, 1920
    
    # If the video is horizontal, crop the center
    if clip1.w > clip1.h:
        clip1_cropped = clip1.crop(x1=clip1.w/2 - target_w/2, width=target_w, height=clip1.h)
        clip1_resized = clip1_cropped.resize(height=target_h)
    else:
        # Already vertical, just resize to fit standard dimensions
        clip1_resized = clip1.resize(width=target_w)
        # If height doesn't match perfectly, crop top/bottom
        if clip1_resized.h > target_h:
            clip1_resized = clip1_resized.crop(y1=clip1_resized.h/2 - target_h/2, height=target_h)

    # Let's take the first 4 seconds of the user video to keep it punchy
    duration1 = min(4.0, clip1_resized.duration)
    clip1_final = clip1_resized.subclip(0, duration1)

    # Add text overlay to clip 1
    # text1 = make_text_clip("Me journaling my trades:", duration1, bg_color='transparent') # MoviePy TextClip has transparency issues sometimes
    try:
        txt1 = TextClip("Me journaling my trades:", fontsize=80, color='white', bg_color='black', font='Arial-Bold', size=(900, None), method='caption')
        txt1 = txt1.on_color(size=(1080, txt1.h + 40), color=(0,0,0), col_opacity=0.6).set_position(('center', 250)).set_duration(duration1)
        final_clip1 = CompositeVideoClip([clip1_final, txt1])
    except:
        print("⚠️ Could not generate text clip (might be missing ImageMagick). Dropping text.")
        final_clip1 = clip1_final


    # 2. PROCESS THE MEDYSA APP CLIP
    print("Processing App UI Video...")
    clip2 = VideoFileClip(app_video_path)

    if clip2.w > clip2.h:
        clip2_cropped = clip2.crop(x1=clip2.w/2 - target_w/2, width=target_w, height=clip2.h)
        clip2_resized = clip2_cropped.resize(height=target_h)
    else:
        clip2_resized = clip2.resize(width=target_w)
        if clip2_resized.h > target_h:
            clip2_resized = clip2_resized.crop(y1=clip2_resized.h/2 - target_h/2, height=target_h)

    # Take around 5 seconds of the app
    duration2 = min(5.0, clip2_resized.duration)
    clip2_final = clip2_resized.subclip(0, duration2)

    try:
        txt2 = TextClip("Is this how you journal?\nTry Medysa.", fontsize=90, color='white', bg_color='black', font='Arial-Bold', size=(950, None), method='caption')
        txt2 = txt2.on_color(size=(1080, txt2.h + 60), color=(0,0,0), col_opacity=0.8).set_position(('center', 250)).set_duration(duration2)
        final_clip2 = CompositeVideoClip([clip2_final, txt2])
    except:
        final_clip2 = clip2_final


    # 3. MERGE CLIPS
    print("Merging Clips...")
    # Add a slight fade out/in between clips
    final_clip1 = final_clip1.crossfadein(0).crossfadeout(0.2)
    final_clip2 = final_clip2.crossfadein(0.2)
    
    final_video = concatenate_videoclips([final_clip1, final_clip2], method="compose")

    # 4. EXPORT
    output_path = os.path.join(OUTPUT_FOLDER, OUTPUT_FILENAME)
    print(f"Rendering Export to: {output_path}")
    
    final_video.write_videofile(
        output_path, 
        codec='libx264', 
        audio_codec='aac', 
        fps=30,  # 30fps is standard for IG/TikTok and renders faster
        preset='fast'
    )
    
    print("\n==========================================")
    print("REEL GENERATED SUCCESSFULLY!")
    print(f"Saved to: {output_path}")
    print("\nIMPORTANT FOR AI VOICE:")
    print("We intentionally left out Python-generated AI voice because it sounds robotic.")
    print("For the best algorithm performance, upload this to Instagram Reels or TikTok,")
    print("type 'Is this how you journal? Try Medysa' as a text sticker,")
    print("and use their built-in 'Text-to-Speech' voice feature. It sounds 100x better.")
    print("==========================================\n")

if __name__ == "__main__":
    create_joke_reel()
