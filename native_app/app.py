import sys
import json
import hashlib
import os

HASH_STORE = os.path.expanduser("~/.known_hashes.json")
LOG_FILE = os.path.expanduser("~/.duplicate_download_log.txt")
CONFIG_FILE = os.path.expanduser("~/.duplicate_config.json")

def get_mode():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            config = json.load(f)
            return config.get("mode", "warn-only")
    return "warn-only"

def sha256sum(filename):
    h = hashlib.sha256()
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def load_hashes():
    if os.path.exists(HASH_STORE):
        with open(HASH_STORE, 'r') as f:
            return json.load(f)
    return {}

def save_hashes(hashes):
    with open(HASH_STORE, 'w') as f:
        json.dump(hashes, f)

def read_input():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = int.from_bytes(raw_length, byteorder='little')
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def write_output(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(len(encoded).to_bytes(4, byteorder='little'))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def process_file(path):
    hashes = load_hashes()
    file_hash = sha256sum(path)

    if file_hash in hashes:
        with open(LOG_FILE, "a") as log:
            log.write(f"[DUPLICATE] {path} matches {hashes[file_hash]}\n")
        return {
            "isDuplicate": True,
            "match": hashes[file_hash],
            "mode": get_mode(),
            "path": path
        }
    else:
        hashes[file_hash] = os.path.basename(path)
        save_hashes(hashes)
        return {
            "isDuplicate": False,
            "mode": get_mode(),
            "path": path
        }


if __name__ == "__main__":
    while True:
        try:
            message = read_input()

            # Handle mode update
            if message.get("action") == "updateMode":
                new_mode = message.get("mode")
                with open(CONFIG_FILE, "w") as f:
                    json.dump({"mode": new_mode}, f)
                write_output({"status": "mode updated"})

            # Handle file check
            elif "path" in message:
                path = message.get("path")
                if os.path.exists(path):
                    result = process_file(path)
                    write_output(result)
                else:
                    write_output({"isDuplicate": False, "error": "File not found"})

        except Exception as e:
            write_output({"isDuplicate": False, "error": str(e)})
