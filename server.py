# keyboard_drive.py
from pynput import keyboard

print("Keyboard controller:")
print("W = forward | S = backward")
print("A = slow forward | D = slow backward")
print("Q = stop | ESC = quit")
print("\nMake sure hub is connected in code.pybricks.com")
print("Type commands in the terminal window there, or...")
print("Keep this window focused and press keys\n")

def on_press(key):
    try:
        k = key.char
        if k in ['w', 'a', 's', 'd', 'q']:
            print(k, end='', flush=True)
    except AttributeError:
        if key == keyboard.Key.esc:
            print("\nExiting...")
            return False

with keyboard.Listener(on_press=on_press) as listener:
    listener.join()