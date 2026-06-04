import os
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip

INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"
OUTPUT_FILENAME = "medysa_reel_final.mp4"

USER_VIDEO_NAME = "notebook.mp4.mp4"
APP_VIDEO_NAME = "medysa.mp4.mp4"

def make_text_clip(text, duration, position=('center', 250), fontsize=70, font='Arial-Bold'):
    try:
        txt = TextClip(text, fontsize=fontsize, color='white', bg_color='black', font=font, size=(950, None), method='caption')
        txt = txt.on_color(size=(1080, txt.h + 60), color=(0,0,0), col_opacity=0.8).set_position(position).set_duration(duration)
        return txt
    except:
        return None

def create_joke_reel():
    print("Starting Custom Joke Reel Generator...")

    user_video_path = os.path.join(INPUT_FOLDER, USER_VIDEO_NAME)
    app_video_path = os.path.join(INPUT_FOLDER, APP_VIDEO_NAME)

    if not os.path.exists(user_video_path):
        print(f"Error: Cannot find {USER_VIDEO_NAME}")
        return
    if not os.path.exists(app_video_path):
        print(f"Error: Cannot find {APP_VIDEO_NAME}")
        return

    # 1. PROCESS NOTEBOOK CLIP
    print("Processing Notebook Video...")
    clip1 = VideoFileClip(user_video_path)
    
    target_w, target_h = 1080, 1920
    
    clip1_resized = clip1.resize(width=target_w)
    if clip1_resized.h < target_h:
        clip1_resized = clip1_resized.on_color(size=(target_w, target_h), color=(0, 0, 0), pos='center')
    elif clip1_resized.h > target_h:
        clip1_resized = clip1_resized.crop(y1=clip1_resized.h/2 - target_h/2, height=target_h)

    # First 3 seconds
    duration1 = min(3.0, clip1_resized.duration)
    clip1_final = clip1_resized.subclip(0, duration1)

    txt1 = make_text_clip("Me journaling my\nrevenge trades at 3AM:", duration1, position=('center', 200), fontsize=75)
    if txt1:
        final_clip1 = CompositeVideoClip([clip1_final, txt1])
    else:
        final_clip1 = clip1_final


    # 2. PROCESS MEDYSA APP CLIP
    print("Processing Medysa App Video...")
    clip2 = VideoFileClip(app_video_path)

    clip2_resized = clip2.resize(width=target_w)
    if clip2_resized.h < target_h:
        clip2_resized = clip2_resized.on_color(size=(target_w, target_h), color=(0, 0, 0), pos='center')
    elif clip2_resized.h > target_h:
        clip2_resized = clip2_resized.crop(y1=clip2_resized.h/2 - target_h/2, height=target_h)

    # 2a. Shot 2: First 3 seconds of the app
    duration2a = min(3.0, clip2_resized.duration)
    clip2a_final = clip2_resized.subclip(0, duration2a)
    
    txt2a = make_text_clip("Try Medysa", duration2a, position=('center', 200), fontsize=90)
    if txt2a:
        final_clip2a = CompositeVideoClip([clip2a_final, txt2a])
    else:
        final_clip2a = clip2a_final

    # 2b. Shot 3: Next 2 seconds of the app (zoomed in slightly)
    # If the app clip is long enough, take the next 2. If not, just use what's left.
    if clip2_resized.duration > duration2a:
        duration2b = min(2.5, clip2_resized.duration - duration2a)
        start_time = duration2a
        end_time = duration2a + duration2b
        clip2b = clip2_resized.subclip(start_time, end_time)
        
        zoomed = clip2b.resize(1.15)
        zoomed = zoomed.crop(x_center=zoomed.w/2, y_center=zoomed.h/2, width=target_w, height=target_h)
        
        txt2b = make_text_clip("Start tracking like a pro.", duration2b, position=('center', 200), fontsize=80)
        if txt2b:
            final_clip2b = CompositeVideoClip([zoomed, txt2b])
        else:
            final_clip2b = zoomed
            
        merge_clips = [final_clip1.crossfadein(0).crossfadeout(0.2), final_clip2a.crossfadein(0.2), final_clip2b]
    else:
        merge_clips = [final_clip1.crossfadein(0).crossfadeout(0.2), final_clip2a.crossfadein(0.2)]

    # 3. MERGE CLIPS
    print("Merging Clips...")
    final_video = concatenate_videoclips(merge_clips, method="compose")

    # 4. EXPORT
    output_path = os.path.join(OUTPUT_FOLDER, OUTPUT_FILENAME)
    print(f"Rendering Export to: {output_path}")
    
    # Strip any broken audio from the inputs (which often causes moviepy exit code 1)
    final_video = final_video.without_audio()
    
    final_video.write_videofile(
        output_path, 
        codec='libx264', 
        audio_codec=None, 
        fps=30,
        preset='fast'
    )
    
    print("REEL GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    create_joke_reel()
