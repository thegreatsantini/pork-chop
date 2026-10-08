"""Lesson 3: OOP - the core exercise.

One blueprint (class), many motors (objects).
"""


class Motor:
    def __init__(self, can_id):
        # Constructor: runs once when we do Motor(3).
        # self = "this specific motor"
        self.can_id = can_id
        self._speed = 0.0  # underscore = "please don't touch directly"

    def set_speed(self, speed):
        # Methods can protect their data: clamp to -1.0 .. 1.0
        self._speed = max(-1.0, min(1.0, speed))

    def stop(self):
        self._speed = 0.0

    def get_speed(self):
        return self._speed

    def is_running(self):
        return self._speed != 0.0

    def __str__(self):
        # Lets print(motor) show something readable
        return f"Motor(CAN {self.can_id}) speed={self._speed:+.2f} running={self.is_running()}"


if __name__ == "__main__":
    # Pork Chop's joints, one object each
    shoulder = Motor(3)
    elbow = Motor(4)

    shoulder.set_speed(0.5)
    elbow.set_speed(-0.25)
    print(shoulder)
    print(elbow)

    # Ask the class first: what SHOULD this do?
    shoulder.set_speed(5)
    print("After set_speed(5):", shoulder)

    elbow.stop()
    print("After stop():", elbow)
