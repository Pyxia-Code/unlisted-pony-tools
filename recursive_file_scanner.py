#!/usr/bin/env python3
import pony_rewatch
import traceback
import argparse
import json
import re

def main():
	parser = argparse.ArgumentParser(description="Recursively find text files and scan them for youtube links")
	parser.add_argument("--in", "-i", dest="input_dir", help="This directory is recursively searched for text files", required=True)
	parser.add_argument("--out", "-o", dest="output_fl", help="Output file", required=True)
	args = parser.parse_args()


	vids = set()
	playlists = set()
	channel_ids = set()

	#Scan text files
	to_scan = pony_rewatch.search_for_extension(args.input_dir, (".txt", ".phtml", ".html", ".htm", ".php", ".js", ".css", ".description", ".json", ".xml"))
	for i in to_scan:
		with open(i, "r") as fl:
			data = fl.read()
			for vid in re.findall("v=([a-zA-Z0-9_-]{11})", data):
				vids.add(vid)
			for vid in re.findall("/v/([a-zA-Z0-9_-]{11})", data):
				vids.add(vid)
			for vid in re.findall("youtu\.be/([a-zA-Z0-9_-]{11})", data):
				vids.add(vid)
			for playlist in re.findall("[&?]list=([a-zA-Z0-9_-]{18,34})", data):
				playlists.add(playlist)
			#TODO: search for channels
	
	#Scan metadata files
	to_scan = pony_rewatch.search_for_extension(args.input_dir, ".info.json")
	for i in to_scan:
		with open(i, "r") as fl:
			try:
				fl_json = json.loads(fl.read())
				if fl_json.get("comments"):
					for comment in fl_json["comments"]:
						channel_ids.add(comment["author_id"])
				if fl_json.get("channel_id"):
					channel_ids.add(fl_json["channel_id"])
				if fl_json.get("id"):
					vids.add(fl_json["id"])
			except Exception:
				pass

	with open(args.output_fl, "w") as fl:
		for i in vids:
			fl.write("https://youtube.com/watch?v=")
			fl.write(i)
			fl.write("\n")
		for i in playlists:
			fl.write("https://youtube.com/playlist?list=")
			fl.write(i)
			fl.write("\n")
		for i in channel_ids:
			fl.write("https://youtube.com/channel/")
			fl.write(i)
			fl.write("\n")

if(__name__ == "__main__"):
	try:
		pony_rewatch.set_echo(0)
		main()
	except (KeyboardInterrupt, SystemExit, GeneratorExit):
		pass
	except:
		pony_rewatch.log("ERROR", "error")
		traceback.print_exc()
	pony_rewatch.set_echo(1)
