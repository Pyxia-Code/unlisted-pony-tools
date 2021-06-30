#!/usr/bin/env python3
import sys, re
with open(sys.argv[1], "r") as fl:
	data = fl.read().splitlines()
output = []
for line in data:
	vid_id = line[:line.find(" ")]
	output.append(vid_id)
for vid in set(output):
	print(vid)
