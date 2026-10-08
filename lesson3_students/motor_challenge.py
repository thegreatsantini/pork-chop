"""LESSON 3 - MOTOR CLASS - CHALLENGE TIER

Pair up: one DRIVER (types), one NAVIGATOR (reads + spots bugs).
Swap after every method.

Build the whole class from this spec. Then run the file.

PSEUDOCODE SPEC
---------------
CLASS Motor

    WHEN a new Motor is made with a can_id:
        remember the can_id
        speed starts at 0

    get_speed:
        give back the current speed

    set_speed(speed):
        save the speed

    stop:
        speed becomes 0

    is_running:
        give back whether speed is anything other than 0

STRETCH 1 (after all core checks PASS)
--------------------------------------
    set_speed(speed):
        keep speed between -1.0 and 1.0 before saving it

STRETCH 2: WIRE IT TO PORK CHOP
-------------------------------
    import the porkchop module
    whenever the speed changes (set_speed AND stop):
        call porkchop.send with this motor's can_id and speed
    re-run checks, then open porkchop_routine.py

STRETCH 3
---------
CLASS ArmMotor IS A Motor
    WHEN made with can_id, joint_name, max_speed:
        set up the normal Motor parts first (hint: super())
        remember joint_name and max_speed
    set_speed(speed):
        keep speed between -max_speed and max_speed
        then let the normal Motor set_speed handle the rest
"""


# Write your Motor class here




# ---------- don't edit below this line ----------
if __name__ == "__main__":
    from _checks import run_checks
    run_checks(Motor)
