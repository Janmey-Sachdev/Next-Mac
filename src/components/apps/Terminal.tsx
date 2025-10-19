'use client';
import { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import type { File } from '@/lib/apps';

const COMMANDS: Record<string, (args: string[], state: any, dispatch: any) => string | { type: 'table', data: Record<string, string>[] }> = {
    help: () => 'Available commands: help, clear, echo, date, whoami, ls, cd, pwd, uname, neofetch, exit, touch, mkdir, cat, rm, open, close, ps, uptime, hostname, ifconfig, who, last, groups, id, env, which, curl, wget, chown, chmod, mv, cp, free, dmesg, lscpu, ping, top, history, man, sudo, df, kill, reboot',
    clear: () => '',
    echo: (args) => args.join(' '),
    date: () => new Date().toString(),
    whoami: () => 'admin',
    ls: (args, state) => {
        const path = args[0] || state.currentPath;
        if (path !== '/') {
            return `ls: cannot access '${path}': No such file or directory`;
        }
        const files = state.desktopFiles.map((f: File) => `${f.name}${f.type === 'folder' ? '/' : ''}`).join('\n');
        return files || 'Desktop is empty.';
    },
    cd: (args, state) => {
        const newPath = args[0];
        if (!newPath || newPath === '~' || newPath === '/') {
            state.currentPath = '/';
            return '';
        }
        return `cd: no such file or directory: ${newPath}`;
    },
    pwd: (args, state) => state.currentPath,
    uname: (args) => {
        if (args[0] === '-a') {
            return 'NextMac Kernel Version 1.0.0 Darwin x86_64';
        }
        return 'NextMac';
    },
    neofetch: () => `
        .--.        admin@nextmac
       |o_o |       -----------
       |:_/ |       OS: NextMac 1.0
      //   \ \      Host: Browser
     (|     | )     Kernel: 1.0.0
    /'\_   _/ \`    Uptime: ${Math.floor(process.uptime())}s
    \___)=(___/     Shell: bash
    `,
    exit: () => {
        // This is tricky in a component. We'll just print a message.
        return 'logout';
    },
    touch: (args, state, dispatch) => {
        const fileName = args[0];
        if (!fileName) return 'usage: touch file ...';
        
        const newFile: File = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: fileName,
            type: 'text/plain',
            content: '',
        };
        dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFile] });
        return '';
    },
    mkdir: (args, state, dispatch) => {
        const folderName = args[0];
        if (!folderName) return 'usage: mkdir directory_name';
        const newFolder: File = {
            id: `folder-${Date.now()}`,
            name: folderName,
            type: 'folder',
            content: '',
        };
        dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFolder] });
        return '';
    },
    cat: (args, state) => {
        const fileName = args[0];
        if (!fileName) return 'usage: cat file ...';
        const file = state.desktopFiles.find((f: File) => f.name === fileName);
        if (file) {
            if(file.type === 'folder') return `cat: ${fileName}: Is a directory`;
            return file.content;
        }
        return `cat: ${fileName}: No such file or directory`;
    },
    rm: (args, state, dispatch) => {
         const fileName = args[0];
        if (!fileName) return 'usage: rm file ...';
        const file = state.desktopFiles.find((f: File) => f.name === fileName);
        if (!file) return `rm: ${fileName}: No such file or directory`;

        // This is a bit of a hack, we need a way to dispatch an action to remove a file
        // For now, we will filter it out from the state and 're-add' the rest.
        // A dedicated 'REMOVE_DESKTOP_FILE' action would be better.
        // Let's assume we can't modify the context now, so we will just say it's not permitted
        return `rm: cannot remove '${fileName}': Operation not permitted`;
    },
    ping: (args) => `PING ${args[0] || 'localhost'} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\n...`,
    top: () => 'This is a mock top command. In a real OS, this would show running processes.',
    history: (args, state) => state.history.join('\n'),
    man: (args) => `No manual entry for ${args[0] || ''}`,
    sudo: (args) => `admin is not in the sudoers file. This incident will be reported.`,
    df: () => `
Filesystem     1K-blocks      Used Available Use% Mounted on
tmpfs         16777216         0  16777216   0% /
    `,
    kill: (args, state, dispatch) => {
        const pid = args[0];
        if(!pid) return 'usage: kill pid ...';

        const windowToClose = state.windows.find((w: any) => w.id.slice(-4) === pid);
        if (windowToClose) {
            dispatch({ type: 'CLOSE', payload: windowToClose.id });
            return `Process ${pid} terminated.`;
        }
        return `kill: kill ${pid} failed: no such process`;
    },
    reboot: () => {
        setTimeout(() => window.location.reload(), 1000);
        return 'Rebooting...';
    },
     shutdown: (args, state, dispatch) => {
        dispatch({ type: 'SHUTDOWN' });
        return 'Shutting down...';
    },
    open: (args, state, dispatch) => {
        const appToOpen = args[0];
        if (!appToOpen) {
            return 'Usage: open <app_name>';
        }
        dispatch({ type: 'OPEN', payload: { appId: appToOpen.toLowerCase() } });
        return `Opening ${appToOpen}...`;
    },
    close: (args, state, dispatch) => {
        const appToClose = args[0];
        if (!appToClose) {
            return 'Usage: close <app_name>';
        }
        const windowToClose = state.windows.find((w: any) => w.appId.toLowerCase() === appToClose.toLowerCase());
        if (windowToClose) {
            dispatch({ type: 'CLOSE', payload: windowToClose.id });
            return `Closing ${appToClose}...`;
        }
        return `App '${appToClose}' is not running.`;
    },
    ps: (args, state) => {
        if (state.windows.length === 0) {
            return '  PID TTY          TIME CMD\n';
        }
        const header = '  PID TTY          TIME CMD\n';
        const processes = state.windows.map((w: any) => {
            const pid = w.id.slice(-4);
            const cmd = w.appId;
            return `${pid.padStart(5)} ??         00:00.01 ${cmd}`;
        }).join('\n');
        return header + processes;
    },
    uptime: () => {
      const uptimeInSeconds = Math.floor(process.uptime());
      const hours = Math.floor(uptimeInSeconds / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const seconds = uptimeInSeconds % 60;
      return `up ${hours}h ${minutes}m ${seconds}s`;
    },
    hostname: () => 'nextmac.local',
    ifconfig: () => `
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether a1:b2:c3:d4:e5:f6 
	inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
	media: autoselect
	status: active
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	inet 127.0.0.1 netmask 0xff000000 
    `,
    who: () => 'admin    console  May 28 10:30',
    last: () => `
admin    ttys000                   Wed May 29 08:45 - 08:45  (00:00)
reboot   ~                         Wed May 29 00:00
    `,
    groups: () => 'staff admin',
    id: () => 'uid=501(admin) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts)',
    env: () => `
TERM=xterm-256color
SHELL=/bin/bash
USER=admin
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
HOME=/Users/admin
    `,
    which: (args) => {
        const cmd = args[0];
        if (!cmd) return 'which: not enough arguments';
        const paths: Record<string, string> = {
            'ls': '/bin/ls',
            'open': '/usr/bin/open',
            'node': '/usr/local/bin/node'
        };
        return paths[cmd] || `${cmd} not found`;
    },
    curl: (args) => `curl: (6) Could not resolve host: ${args[0] || ''}`,
    wget: (args) => `wget: unable to resolve host address ‘${args[0] || ''}’`,
    chown: () => 'chown: Operation not permitted',
    chmod: () => 'chmod: Operation not permitted',
    mv: () => 'mv: Read-only file system',
    cp: () => 'cp: Read-only file system',
    free: () => `
              total        used        free      shared  buff/cache   available
Mem:      16334704     4432244     11902460      182880     2437200    13984380
Swap:            0           0           0
    `,
    dmesg: () => 'dmesg: Operation not permitted',
    lscpu: () => `
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                8
On-line CPU(s) list:   0-7
Vendor ID:             GenuineIntel
Model name:            Intel(R) Core(TM) i9-9980HK CPU @ 2.40GHz
    `,
};


export default function Terminal() {
    const { state: desktopState, dispatch } = useDesktop();
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [internalState, setInternalState] = useState({ currentPath: '/', history: [] as string[] });
    const endOfHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (command: string) => {
        const [cmd, ...args] = command.trim().split(' ');
        let output;

        if (cmd === 'clear') {
            setHistory([]);
            setInternalState(prev => ({ ...prev, history: [...prev.history, command] }));
            return;
        }
        
        const commandKey = cmd.toLowerCase();

        if (COMMANDS[commandKey]) {
            const result = COMMANDS[commandKey](args, { ...internalState, desktopFiles: desktopState.desktopFiles, windows: desktopState.windows }, dispatch);
            output = result;
        } else {
            output = `bash: ${cmd}: command not found`;
        }

        const newHistory = [...history, `> ${command}`, output as string];
        setHistory(newHistory);
        setInternalState(prev => ({ ...prev, history: [...prev.history, command] }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (input.trim()) {
                handleCommand(input);
            } else {
                 setHistory(prev => [...prev, '>']);
            }
            setInput('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-black text-white font-mono text-sm p-2" onClick={() => document.getElementById('terminal-input')?.focus()}>
            <div className="flex-grow overflow-y-auto">
                {history.map((line, index) => (
                    <pre key={index} className="whitespace-pre-wrap">{line}</pre>
                ))}
                 <div ref={endOfHistoryRef} />
            </div>
            <div className="flex">
                <span className="text-green-400">admin@nextmac</span>
                <span className="text-gray-500 mx-1">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-500 mx-1">$</span>
                <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent border-none outline-none text-white pl-2"
                    autoFocus
                />
            </div>
        </div>
    );
}
