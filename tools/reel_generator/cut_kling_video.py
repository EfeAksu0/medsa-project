import os
from moviepy.editor import VideoFileClip, ColorClip, CompositeVideoClip, concatenate_videoclips, ImageClip
from PIL import Image, ImageDraw, ImageFont

input_file = os.path.join(os.getcwd(), 'input', 'kling_20260307_VIDEO_Vertical_9_1675_0.mp4')
output_file = os.path.join(os.getcwd(), 'output', 'final_launch_reel_with_text.mp4')

def process():
    if not os.path.exists(input_file):
        print(f"Error: Could not find {input_file}")
        return

    print("Loading video...")
    clip = VideoFileClip(input_file)
    
    duration = min(3.0, clip.duration)
    clip = clip.subclip(0, duration)
    
    watermark_cover = ColorClip(size=(clip.w, 120), color=(0,0,0)).set_position(("center", "bottom")).set_duration(clip.duration)
    clean_clip = CompositeVideoClip([clip, watermark_cover])
    
    w, h = clip.size
    img = Image.new('RGB', (w, h), color=(0,0,0))
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("arialbd.ttf", int(w/14))
        font_small = ImageFont.truetype("arial.ttf", int(w/22))
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    text1 = "Stop trading with emotion."
    text3 = "Medysa AI is officially live."
    
    def draw_text_centered(draw, text, font, y_pos, fill):
        try:
            bbox = draw.textbbox((0,0), text, font=font)
            text_w = bbox[2] - bbox[0]
        except AttributeError:
            text_w, _ = draw.textsize(text, font=font)
        x_pos = (w - text_w) / 2
        draw.text((x_pos, y_pos), text, font=font, fill=fill)

    draw_text_centered(draw, text1, font_large, h * 0.3, (255, 255, 255))
    draw_text_centered(draw, text3, font_small, h * 0.7, (150, 150, 150))
    
    if not os.path.exists(os.path.join(os.getcwd(), 'output')):
        os.makedirs(os.path.join(os.getcwd(), 'output'))
        
    outro_img_path = os.path.join(os.getcwd(), 'output', 'outro.png')
    img.save(outro_img_path)
    
    black_screen = ImageClip(outro_img_path).set_duration(2.5)
    
    print("Merging clips...")
    final_video = concatenate_videoclips([clean_clip, black_screen], method="compose")
    
    print(f"Exporting to {output_file}...")
    final_video.write_videofile(output_file, codec='libx264', audio_codec='aac', fps=30)
    print("Done!")

if __name__ == "__main__":
    process()
