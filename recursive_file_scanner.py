#!/usr/bin/env python3
import pony_rewatch
import traceback
import argparse
import json
import re

def main():
	parser = argparse.ArgumentParser(description="Recursively find text files and scan them for youtube links")
	parser.add_argument("--in", "-i", dest="input_dir", help="This directory is recursively searched for *.info.json files (other files are omitted)", required=True)
	parser.add_argument("--out", "-o", dest="output_fl", help="Output metadata file", required=True)
	args = parser.parse_args()

	metadata = pony_rewatch.search_for_extension(args.input_dir, (".txt", ".phtml", ".html", ".htm", ".php", ".js", ".css", ".description"))
	link_list = []
	playlist_list = []
	for i in metadata:
		with open(i, "r") as fl:
			data = fl.read()
			link_list += re.findall("v=([a-zA-Z0-9_-]{11})", data)
			link_list += re.findall("youtu\.be([a-zA-Z0-9_-]{11})", data)
			playlist_list += re.findall("\?list=([a-zA-Z0-9_-]{18,34})", data)
		#print(metadata)
	link_list_dedupe = []
	playlist_list_dedupe = []
	with open(args.output_fl, "w") as fl:
		for i in link_list:
			if not i in link_list_dedupe:
				link_list_dedupe.append(i)
				fl.write("https://youtube.com/watch?v=")
				fl.write(i)
				fl.write("\n")
		for i in playlist_list:
			if not i in playlist_list_dedupe:
				playlist_list_dedupe.append(i)
				fl.write("https://youtube.com/playlist?list=")
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
