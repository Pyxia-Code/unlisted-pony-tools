#!/usr/bin/env python3
import sys, re
with open(sys.argv[1], "r") as fl:
	data = fl.read()
channels = re.findall("theponyarchive\.com/archive/youtube/[^/]*_([^/]{24})/", data)
for channel in set(channels):
	print(channel)
