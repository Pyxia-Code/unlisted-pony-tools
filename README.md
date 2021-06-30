# unlisted-pony-tools
Tools for finding and filtering unlisted youtube videos

# id_adder.py
A tool for adding, removing (blacklisting) and removing duplicate youtube ids. Useful for combining multiple lists and filtering out videos that are already archived. This tool also preserves comments put before links/ids that start with #. If you want to remove comments/don't have any in the first place then use the --no-comments argument.
```
usage: id_adder.py [-h] [--plus FILE [FILE ...]] [--minus FILE [FILE ...]] [--no-comments]

Add/remove video ids and print them

optional arguments:
  -h, --help            show this help message and exit
  --plus FILE [FILE ...]
                        Files with ids to add
  --minus FILE [FILE ...]
                        Files with ids to remove
  --no-comments         Files with ids to remove
```

# browser_history.py
A tool used for getting youtube links from browser history.
Big thanks to the anon who improved this tool a lot and added support for more browsers.
```
usage: browser_history.py [-h] [-db DATABASE] [-bu] [-p] [-s]

optional arguments:
  -h, --help            show this help message and exit
  -db DATABASE, --database DATABASE
                        Points to the database that will be used. Default assumes you have places.sqlite placed next to the script
  -bu, --build_urls     If passed, build complete YouTube urls
  -p, --print           If passed, print the results
  -s, --save            If passed, save the results
```

# recursive_file_scanner.py
Recursively scans files for youtube links. Works for both links and playlists. Only checks .txt, .phtml, .html, .htm, .php, .js, .css and .description files.
```
usage: recursive_file_scanner.py [-h] --in INPUT_DIR --out OUTPUT_FL

Recursively find text files and scan them for youtube links

optional arguments:
  -h, --help            show this help message and exit
  --in INPUT_DIR, -i INPUT_DIR
                        This directory is recursively searched for *.info.json files (other files are omitted)
  --out OUTPUT_FL, -o OUTPUT_FL
                        Output metadata file
```

# pony_rewatch_userscript.js
A userscript for quickly adding videos from youtube playlists and search results to a list. In case of playlists it adds a button to the right of the video and otherwise it adds a transparent add button on top of the thumbnail. Added videos are stored in the ponyrewatchlist localstorage variable. If you have a list of videos you have already checked you can put them in the vids const array.

# TPA/
All of the tools related to The Pony Archive

# TPA/TPA_lookup_gen.py
Tool used to generate a lookup table from TPA. Do NOT use this unless you need the most up to date version of the table. Instead download this one:
https://u.smutty.horse/mbvzdlqtore.gz (2021-04-15)
and decompress it using gunzip. If you end up generating a new one please make a pull request to update the above link. I don't want this tool to needlessly put load on the TPA servers.
```
usage: TPA_lookup_gen.py [-h] --out OUT_FILE

Generate The Pony Archive video lookup table. Format: VIDEO_ID VIDEO_URL\nVIDEO_ID VIDEO_URL ...

optional arguments:
  -h, --help            show this help message and exit
  --out OUT_FILE, -o OUT_FILE
                        Output file
```

# TPA/get_tpa_channels.py
Tool used to get a list of channels from a TPA lookup table.
```
Usage:
  python3 get_tpa_channels.py LOOKUP_TABLE
```

# TPA/get_tpa_ids.py
The same as above but for video ids. Can be used with id_adder.py to filter videos that are already archived.
```
Usage:
  python3 get_tpa_ids.py LOOKUP_TABLE
```

# video_browser/
Browser for videos which allows to mark them as either pony or not pony related. The info about the videos is stored in metadata.json which is generated by youtube_to_browser.py. To get more info about this run it and click on the ? tab in the top left corner.

# youtube_to_browser.py
Convert youtube metadata to metadata.json which is used by video_browser/.
```
usage: youtube_to_browser.py [-h] --in INPUT_DIR --out OUTPUT [--tpa TABLE] [--unavailable LIST] [--blacklists FILE [FILE ...]]

Convert metadata downloaded by Youtube-DL and save it in a format readable by the video browser

optional arguments:
  -h, --help            show this help message and exit
  --in INPUT_DIR, -i INPUT_DIR
                        This directory is recursively searched for *.info.json files (other files are omitted)
  --out OUTPUT, -o OUTPUT
                        Output file
  --tpa TABLE           The Pony Archive lookup table
  --unavailable LIST    List of unavailable videos
  --blacklists FILE [FILE ...]
                        Youtube id blacklists
```
using the tpa argument adds links to the archived TPA versions of the videos but it's not currently used by the browser in this repo.

# Other tools
There are a lot of other useful tools for getting unlisted youtube videos here:
https://github.com/itallreturnstonothing/panicpony
