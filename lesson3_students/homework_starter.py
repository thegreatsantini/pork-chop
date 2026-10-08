"""Lesson 3 homework: build a DriveSubsystem.

Requirements:
  - Holds a LEFT Motor and a RIGHT Motor (use the Motor class from class)
  - tank_drive(left_speed, right_speed) sets each side
  - stop() stops both sides
  Bonus: add arcade_drive(forward, turn)
"""

# Use YOUR Motor class from tonight - pick the line for the file you used:
from motor_guided import Motor
# from motor_challenge import Motor


class DriveSubsystem:
    def __init__(self, left_id, right_id):
        pass  # TODO: create two Motor objects

    def tank_drive(self, left_speed, right_speed):
        pass  # TODO

    def stop(self):
        pass  # TODO


if __name__ == "__main__":
    drive = DriveSubsystem(1, 2)
    drive.tank_drive(0.5, -0.5)
    print(drive.left.get_speed(), drive.right.get_speed())  # expect 0.5 -0.5
