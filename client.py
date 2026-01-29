from pybricks.hubs import TechnicHub
from pybricks.parameters import Color
from pybricks.tools import wait
from usys import stdin
from uselect import poll

hub = TechnicHub()

hub.light.on(Color.BLUE)
print("Hub ready!")

keyboard = poll()
keyboard.register(stdin)

while True:
    if keyboard.poll(0):
        cmd = stdin.read(1)
        
        if cmd == 'w':
            hub.light.on(Color.GREEN)
            print("GREEN")
        elif cmd == 's':
            hub.light.on(Color.RED)
            print("RED")
        elif cmd == 'q':
            hub.light.on(Color.BLUE)
            print("BLUE")
    
    wait(10)