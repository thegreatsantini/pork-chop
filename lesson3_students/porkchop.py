"""Pork Chop driver - DON'T EDIT. (Like WPILib's low-level hardware layer.)

Your Motor class calls porkchop.send(...). This file just delivers it.
Nothing is sent until porkchop.connect() is called, so the checks
never move the arm.
"""

import json

SERVER_URL = "ws://localhost:3001"

# "keys" = works with the server as-is (fixed power, 'stop' stops ALL joints)
# "json" = needs the server patch (real speeds, per-joint stop)
MODE = "keys"

SAFE_MAX = 0.5  # arm safety cap (json mode)
JOINTS = {1: "base", 2: "shoulder", 3: "elbow", 4: "pincher"}  # CAN id -> joint

# Server's keyboard commands: joint -> (forward key, reverse key)
KEYS = {
    "base": ("q", "e"),
    "shoulder": ("w", "s"),
    "elbow": ("r", "f"),
    "pincher": ("a", "d"),
}

_ws = None


def connect(url=SERVER_URL):
    global _ws
    from websocket import create_connection  # pip install websocket-client
    _ws = create_connection(url, timeout=3)
    print(f"Connected to Pork Chop at {url} ({MODE} mode)")


def _raw(text):
    _ws.send(text)


def send(can_id, speed):
    if _ws is None:
        return  # not connected: do nothing
    if can_id not in JOINTS:
        print(f"  (no joint for CAN id {can_id}, ignored)")
        return
    joint = JOINTS[can_id]

    if MODE == "json":
        value = max(-SAFE_MAX, min(SAFE_MAX, speed))
        _raw(json.dumps({"type": "motor", "port": joint, "value": value}))
        print(f"  -> {joint}: {value:+.2f}")
        return

    # keys mode
    if speed > 0:
        _raw(KEYS[joint][0])
        print(f"  -> {joint}: forward")
    elif speed < 0:
        _raw(KEYS[joint][1])
        print(f"  -> {joint}: reverse")
    else:
        _raw("stop")
        print(f"  -> {joint}: stop (stops ALL joints)")


def stop_all():
    global _ws
    if _ws is None:
        return
    if MODE == "json":
        for can_id in JOINTS:
            send(can_id, 0.0)
    else:
        _raw("stop")
    _ws.close()  # hang up cleanly
    _ws = None
