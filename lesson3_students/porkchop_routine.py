"""Make Pork Chop move - with YOUR Motor class.

Unlock: core checks pass AND your set_speed/stop call porkchop.send.

ids:  1 = base   2 = shoulder   3 = elbow   4 = pincher
Rules: keep moves short (under 1 second). Pincher: even shorter - it strains
when it closes on nothing. Predict out loud before you run!
"""

import time
import porkchop

# Pick the line for the file YOU wrote:
from motor_guided import Motor
# from motor_challenge import Motor

porkchop.connect()

try:
    # ===== YOUR CODE HERE =====
    # 1. Make a Motor for one joint
    # 2. Set its speed
    # 3. Wait a little (time.sleep)
    # 4. Stop it
    # Then try: two joints, reverse, print is_running()...
    pass
    # ==========================
finally:
    porkchop.stop_all()  # always stop everything, even on a crash
    print("All stopped.")
