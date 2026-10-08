"""Live demo: break it on purpose, then decode the error together.

Run it, read the TypeError, then fix it by adding `self`.
"""


class BrokenMotor:
    def __init__(self, can_id):
        self.can_id = can_id
        self._speed = 0.0

    def set_speed(speed):  # BUG: forgot self
        self._speed = speed


m = BrokenMotor(3)
m.set_speed(0.5)
# TypeError: BrokenMotor.set_speed() takes 1 positional argument but 2 were given
# Why 2? Python secretly passes the motor itself as the first argument.
# m.set_speed(0.5) is really BrokenMotor.set_speed(m, 0.5)
