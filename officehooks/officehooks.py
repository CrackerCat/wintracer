import os
import sys
import frida

class Monitor:
    def __init__(self, target_process, script_folder = 'scripts'):
        self.session = frida.attach(target_process)

        script_text = ''
        for filename in os.listdir(script_folder):
            if not filename.endswith('.js'):
                continue            
            pathname = os.path.join(script_folder, filename)
            with open(pathname, 'r') as fd:
                script_text += fd.read()
        script = self.session.create_script(script_text)
        script.on('message', self.on_message)
        script.load()
        print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
        sys.stdin.read()
        self.session.detach()

    def on_message(self, message, data):
        print("[%s] => %s" % (message, data))

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: %s <process name or PID>" % __file__)
        sys.exit(1)

    try:
        target_process = int(sys.argv[1])
    except ValueError:
        target_process = sys.argv[1]

    monitor = Monitor(target_process)
