from pybricks.hubs import TechnicHub
from pybricks.parameters import Port, Color
from pybricks.pupdevices import Motor
from pybricks.tools import wait
from usys import stdin
from uselect import poll

hub = TechnicHub()
motor_a = Motor(Port.A)  

hub.light.on(Color.BLUE)
print("Hub ready!")

# Set up polling for incoming data
keyboard = poll()
keyboard.register(stdin)

while True:
    # Check if data available
    if keyboard.poll(0):
        cmd = stdin.read(1)
        
        if cmd == 'w':
            motor_a.run(500)
            hub.light.on(Color.GREEN)
            print("Forward")
        elif cmd == 's':
            motor_a.run(-500)
            hub.light.on(Color.RED)
            print("Backward")
        elif cmd == 'a':
            motor_a.run(200)
            hub.light.on(Color.YELLOW)
            print("Slow forward")
        elif cmd == 'd':
            motor_a.run(-200)
            hub.light.on(Color.ORANGE)
            print("Slow backward")
        elif cmd == 'q':
            motor_a.stop()
            hub.light.on(Color.BLUE)
            print("Stop")
    
    wait(10)