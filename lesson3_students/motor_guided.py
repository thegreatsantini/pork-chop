"""LESSON 3 - MOTOR CLASS - GUIDED TIER

Pair up: one DRIVER (types), one NAVIGATOR (reads + spots bugs).
Swap after every method.

Fill in each TODO. Then run this file and see how many PASS.
The first method is done for you - use it as your pattern!
"""


class Motor:

    def __init__(self, can_id):
        # DONE FOR YOU - this runs when we write Motor(3)
        # "self" means "this specific motor"
        self.can_id = can_id
        self._speed = 0.0

    def get_speed(self):
        # TODO: give back (return) this motor's speed
        pass

    def set_speed(self, speed):
        # TODO: save speed into this motor's _speed
        pass

    def stop(self):
        # TODO: set this motor's _speed to 0
        pass

    def is_running(self):
        # TODO: return True if speed is NOT 0, otherwise False
        pass


# STRETCH GOAL (only after all core checks PASS):
#   Real motors only go from -1.0 (full reverse) to 1.0 (full forward).
#   Change set_speed so that:
#     if speed is bigger than 1.0, it becomes 1.0
#     if speed is smaller than -1.0, it becomes -1.0

# LEVEL 3: WIRE IT TO PORK CHOP (after the stretch)
#   1. At the very top of this file, add:   import porkchop
#   2. At the END of set_speed, tell porkchop this motor's id and speed:
#          porkchop.send(self.can_id, self._speed)
#   3. At the END of stop, do the same thing.
#   4. Run your checks again - they should still pass!
#   5. Then open porkchop_routine.py and make the arm move.


# ---------- don't edit below this line ----------
if __name__ == "__main__":
    from _checks import run_checks
    run_checks(Motor)
