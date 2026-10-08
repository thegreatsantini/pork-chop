"""Lesson 3 homework - ANSWER KEY (don't hand this out).

A subsystem OWNS motors. Objects inside objects.
"""

from motor import Motor


class DriveSubsystem:
    def __init__(self, left_id, right_id):
        self.left = Motor(left_id)
        self.right = Motor(right_id)

    def tank_drive(self, left_speed, right_speed):
        self.left.set_speed(left_speed)
        self.right.set_speed(right_speed)

    def stop(self):
        self.left.stop()
        self.right.stop()

    def __str__(self):
        return f"Drive | L: {self.left} | R: {self.right}"


if __name__ == "__main__":
    drive = DriveSubsystem(1, 2)

    drive.tank_drive(0.5, 0.5)
    print("Forward:   ", drive)

    drive.tank_drive(0.5, -0.5)
    print("Spin right:", drive)

    drive.stop()
    print("Stopped:   ", drive)
