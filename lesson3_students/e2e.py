"""Pork Chop smoke test. Put this in the same folder as porkchop.py.

Run:  python3 smoke_test.py
Press Enter to move each joint. Ctrl+C anytime = everything stops.
"""

import time
import porkchop

print(f"Connecting to {porkchop.SERVER_URL} ...")
try:
    porkchop.connect()
except Exception as e:
    print(f"\nCOULDN'T CONNECT: {type(e).__name__}: {e}")
    print("-> Is the server running? Is it on port 3001?")
    raise SystemExit(1)

try:
    for can_id, joint in porkchop.JOINTS.items():
        input(f"\n[{can_id}] {joint}: press Enter to twitch it...")
        porkchop.send(can_id, 0.5)
        time.sleep(0.4)
        porkchop.send(can_id, 0.0)
        ok = input(f"    Did the {joint.upper()} move? (y/n): ").strip().lower()
        if ok != "y":
            print(f"    !! {joint} FAILED - check the server log for 'Command:' lines")
    print("\nDone.")
finally:
    porkchop.stop_all()
    print("All stopped, connection closed.")