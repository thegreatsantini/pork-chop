"""Self-check for the Motor class. Don't edit this file."""


def _check(name, fn):
    try:
        ok = bool(fn())
    except Exception as e:
        print(f"  FAIL  {name}  ({type(e).__name__}: {e})")
        return False
    print(f"  {'PASS' if ok else 'FAIL'}  {name}")
    return ok


def run_checks(Motor):
    print("Checking your Motor class...\n")

    def set_works():
        m = Motor(3); m.set_speed(0.5); return m.get_speed() == 0.5

    def stop_works():
        m = Motor(3); m.set_speed(0.7); m.stop(); return m.get_speed() == 0.0

    def running():
        m = Motor(3)
        if m.is_running():
            return False
        m.set_speed(0.3)
        return m.is_running()

    def separate():
        a, b = Motor(3), Motor(4); a.set_speed(0.5)
        return b.get_speed() == 0.0

    core = [
        _check("Motor(3) remembers its CAN id", lambda: Motor(3).can_id == 3),
        _check("new motor starts at speed 0", lambda: Motor(3).get_speed() == 0.0),
        _check("set_speed(0.5) then get_speed() gives 0.5", set_works),
        _check("stop() sets speed back to 0", stop_works),
        _check("is_running() is False when stopped, True when moving", running),
        _check("two motors don't share speed (they're separate objects!)", separate),
    ]
    passed = sum(core)
    print(f"\n{passed}/{len(core)} passed")

    if passed < len(core):
        print("Keep going!")
        return

    print("🥓 Core done! Try the STRETCH goal in your file.\n")
    print("STRETCH: clamping")

    def clamp_hi():
        m = Motor(3); m.set_speed(5); return m.get_speed() == 1.0

    def clamp_lo():
        m = Motor(3); m.set_speed(-9); return m.get_speed() == -1.0

    stretch = [
        _check("set_speed(5) gets clamped to 1.0", clamp_hi),
        _check("set_speed(-9) gets clamped to -1.0", clamp_lo),
    ]
    if all(stretch):
        print("\n⭐ Stretch complete!")
