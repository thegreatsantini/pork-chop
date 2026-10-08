"""Lesson 3 stretch goal: inheritance.

An ArmMotor IS a Motor, plus joint limits.
"""

from motor import Motor


class ArmMotor(Motor):
    def __init__(self, can_id, joint_name, max_speed=0.5):
        super().__init__(can_id)  # build the normal Motor parts first
        self.joint_name = joint_name
        self.max_speed = max_speed

    def set_speed(self, speed):
        # Override: arms are dangerous, cap them harder than a plain motor
        capped = max(-self.max_speed, min(self.max_speed, speed))
        super().set_speed(capped)

    def __str__(self):
        return f"{self.joint_name}: " + super().__str__()


if __name__ == "__main__":
    shoulder = ArmMotor(3, "shoulder", max_speed=0.4)
    wrist = ArmMotor(5, "wrist", max_speed=0.8)

    shoulder.set_speed(1.0)
    wrist.set_speed(1.0)
    print(shoulder)  # capped at 0.4
    print(wrist)     # capped at 0.8

    # Still a Motor: inherited methods work
    shoulder.stop()
    print(shoulder)
    print("Is shoulder a Motor?", isinstance(shoulder, Motor))
