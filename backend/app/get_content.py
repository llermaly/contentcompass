
from dotenv import load_dotenv
load_dotenv()

from llama_hub.youtube_transcript import YoutubeTranscriptReader, is_youtube_video
from yt_dlp import YoutubeDL
import base64
import os 
import json


def is_short(url=None):
    if(url.startswith("https://www.youtube.com/shorts/")):
        return True
    return False

def is_youtube_or_shorts(url=None):
    if(is_youtube_video(url) or is_short(url)):
        return True
    return False

def parse_short_url(url=None):
    video_id = url.split('/')[-1]
    full_url = f"https://www.youtube.com/watch?v={video_id}"
    return full_url


def get_content(content=None):
    if(is_youtube_or_shorts(content)):
        if(is_short(content)):
            content = parse_short_url(content)
        loader = YoutubeTranscriptReader()
        documents = loader.load_data(ytlinks=[content])
        content = documents[0].text
    return content

def get_content_comparison(youtube_url=None, video_name="mivideo"):
    if(is_youtube_or_shorts(youtube_url)):
        URLS = [youtube_url]
        file_name = f"{video_name}.mp4"
        b64 = ""
        ydl_opts = {
            'skip_download': False,    # Don't download the video, only extract the info
            #'writesubtitles': False,   # Enable writing subtitles to a file
            #'listsubtitles': False,    # Include subtitles in the info dump
            #'subtitleslangs': ['en'], # Download only English subtitles
            #'writeautomaticsub': True, # Write the automatically generated subtitle file
            'keepvideo': False,       # Don't keep the video file after postprocessing
            # need to revisit post processing to reduce size/save in supported format
            #'download_ranges': download_range_func(None, [(0, 120)]),    # Download only the first 2 minutes
            'outtmpl': video_name + '.%(ext)s',    # Name the video file the ID of the video
            #'subtitlesformat': 'vtt',   # Format of the subtitle file
            'format': 'bestvideo[ext=mp4]+bestvideo[filesize<7M]', #'134'
            'writethumbnail': True,
            'writedescription': True,
            'writeinfojson': True,
            # Include any other options you need here
        }
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download(URLS)
        with open(file_name, "rb") as videoFile:
            b64 = base64.b64encode(videoFile.read())
        # delete video
        os.remove(file_name)
        return b64
    return None

def get_video_metadata(youtube_url=None, video_name="mivideo"):
    if(is_youtube_or_shorts(youtube_url)):
        URLS = [youtube_url]
        metadata_file = f"{video_name}.info.json"
        metadata = {}
        ydl_opts = {
            'skip_download': True,    # Don't download the video, only extract the info
            'outtmpl': video_name + '.%(ext)s',    # Name the video file the ID of the video
            'writethumbnail': True,
            'writeinfojson': True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download(URLS)
        with open(metadata_file, "rb") as infoFile:
            data = json.load(infoFile)
            metadata["thumbnail"] = data.get("thumbnail", "")
            metadata["title"] = data.get("title", "")
            metadata["duration"] = data.get("duration", "")
            metadata["channel"] = data.get("channel", "")
            metadata["uploader_url"] = data.get("uploader_url", "")
            metadata["channel_follower_count"] = data.get("channel_follower_count", "")
            metadata["view_count"] = data.get("view_count", "")
            metadata["webpage_url"] = data.get("webpage_url", "")
        # delete metadata file
        os.remove(metadata_file)
        return metadata
    return None