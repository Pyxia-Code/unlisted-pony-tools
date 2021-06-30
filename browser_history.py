#!/usr/bin/env python3
#Big thanks to anon who improved it a lot and added support for more browsers
import sqlite3
from re import search
from pathlib import Path
from urllib.parse import urlparse
from urllib.parse import parse_qs
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-db", "--database", default="places.sqlite", help="Points to the database that will be used. Default assumes you have places.sqlite placed next to the script")
parser.add_argument("-bu", "--build_urls", action="store_true", help="If passed, build complete YouTube urls")
parser.add_argument("-p", "--print", dest="print_results", action="store_true", help="If passed, print the results")
parser.add_argument("-s", "--save", action="store_true", help="If passed, save the results")
args = parser.parse_args()

def moz_db_url_retrieve(cur_obj):
    """
    If the database is places.sqlite, is a Mozilla Firefox database
    Take it here, pick the entire url column and return the list
    """
    # url and moz_places are static values
    cur_obj.execute("SELECT url FROM moz_places")
    moz_urls = cur_obj.fetchall()
    return moz_urls


def vivaldi_db_url_retrieve(cur_obj):
    """
    If the database is History, it may be a Vivaldi database
    Take it here, pick the entire url column and return the list
    """
    # url and urls are static values
    cur_obj.execute("SELECT url FROM urls")
    vivaldi_urls = cur_obj.fetchall()
    return vivaldi_urls


def fetch_youtube_ids(lou):
    """
    Take the objects returned by vivaldi_db_url_retrieve and moz_db_url_retrieve
    Return a list of youtube ids
    """
    parsed_urls = [urlparse(x[0]) for x in lou]

    video_ids = []
    for x in parsed_urls:
        if search("^(w{3}\.)?youtu\.?be(\.com)?",  x.netloc) and x.path == "/watch":
            parsed_query = parse_qs(x.query)
            video_id = parsed_query.get("v") # [0][:11]
            if video_id != None:
                video_ids.extend(video_id)

    return video_ids


# Init
chk_db = Path(args.database)

if chk_db.is_file():
    db_connection = sqlite3.connect(args.database)
    db_cursor = db_connection.cursor()

    if args.database.endswith(".sqlite"):
        print("The script will attempt to open the database " + args.database + " as a Mozilla Firefox database.")
        db_parse = moz_db_url_retrieve(db_cursor)
        
    elif args.database == "History":
        print("The script will attempt to open the database " + args.database + " as a Vivaldi database.")
        db_parse = vivaldi_db_url_retrieve(db_cursor)
        video_ids = fetch_youtube_ids(db_parse)
    
    video_ids = set(video_ids)
    
    if args.build_urls:
        video_ids = ["https://www.youtube.com/watch?v=" + x for x in video_ids]
    
    if args.print_results:
        for x in video_ids:
            print(x)
    
    if args.save:
        sp = Path(".") / "video_ids.txt"
        sp.write_text("\n".join(video_ids))
        
    db_connection.close()
    
else:
    print("File doesn't exist: " + args.database)
