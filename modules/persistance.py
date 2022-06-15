# persistance.py module
#
# The purpose of this is to persist the IDs of messages
# that this bot creates. If the bot shuts down or crashes
# it will still have access to all of the messages
# that it posted in the past.
# ==========================================================

import json

# location of message IDs json file
fileName = 'json/msg_ids.json'

# cache
items: dict = {}

# tries opening and reading the JSON file into items
try:
    with open(fileName, "r") as file:
        items: dict = json.load(file)
except json.JSONDecodeError:
    items: dict = {}

# functions ================================================

# saves the ID under the specified key ---------------------
def save(key, value):
    if key in items:
        items[key].append(value)
    else:
        items[key] = []
        items[key].append(value)

    with open(fileName, "w") as file:
        json.dump(items, file, indent=4)

# checks if the ID is persisted. If it is ------------------
# returns its key, if not, returns None
def has(value):
    for key in items:
        if value in items[key]:
            return key
    return None