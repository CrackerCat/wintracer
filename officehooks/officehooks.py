import os
import sys
import frida
import process

class Monitor:
    def __init__(self, process_name = '', process_id = 0, script_folder = 'scripts', wait = True):
        if process_name:
            proc = process.Process(process_name, suspended = True)
            if not proc.create():
                return
            process_id = proc.get_id()
        else:
            proc = None

        self._device = frida.get_local_device()
        self._device.on("child-added", self._on_child_added)
        self._device.on("child-removed", self._on_child_removed)
        self._device.on("output", self._on_output)

        self.script_folder = script_folder
        self._instrument(process_id)

        if proc:
            proc.resume()

        if wait:
            print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
            sys.stdin.read()
            self.session.detach()

    def _instrument(self, process_id):
        session = frida.attach(process_id)
        session.enable_child_gating()

        script_text = ''
        for filename in os.listdir(self.script_folder):
            if not filename.endswith('.js'):
                continue            
            pathname = os.path.join(self.script_folder, filename)
            with open(pathname, 'r') as fd:
                script_text += fd.read()

        with open('script.js', 'w') as fd:
            fd.write(script_text)

        self.script = session.create_script(script_text)
        self.script.on('message', self.on_message)
        self.script.load()

    def on_message(self, message, data):
        print("[%s] => %s" % (message, data))

        print(message)

        if message and 'payload' in message:
            process_id = int(message['payload'])
            monitor = Monitor(process_id = process_id, wait = False)

        print("Sending back input reply")
        # self.script.post({'type': 'input', 'payload': ''})

    def _on_child_added(self, child):
        print("⚡ child_added: {}".format(child))
        self._instrument(child.pid)

    def _on_child_removed(self, child):
        print("⚡ child_removed: {}".format(child))

    def _on_output(self, pid, fd, data):
        print("⚡ output: pid={}, fd={}, data={}".format(pid, fd, repr(data)))

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: %s <process name or PID>" % __file__)
        sys.exit(1)

    process_id = None
    process_name = ''
    try:
        process_id = int(sys.argv[1])
    except ValueError:
        process_name = sys.argv[1]

    monitor = Monitor(process_name = process_name, process_id = process_id)
