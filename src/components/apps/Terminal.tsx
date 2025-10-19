'use client';
import { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import type { File } from '@/lib/apps';

const COMMANDS: Record<string, (args: string[], state: any) => string | { type: 'table', data: Record<string, string>[] }> = {
    help: () => 'Available commands: help, clear, echo, date, whoami, ls, cd, pwd, uname, neofetch, exit, touch, mkdir, cat, rm',
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
    touch: (args) => `touch: cannot touch '${args[0] || ''}': Read-only file system`,
    mkdir: (args) => `mkdir: cannot create directory ‘${args[0] || ''}’: Read-only file system`,
    cat: (args) => `cat: ${args[0] || ''}: No such file or directory`,
    rm: (args) => `rm: cannot remove '${args[0] || ''}': Read-only file system`,
    ping: (args) => `PING ${args[0] || 'localhost'} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\n...`,
    top: () => 'This is a mock top command. In a real OS, this would show running processes.',
    history: (args, state) => state.history.join('\n'),
    man: (args) => `No manual entry for ${args[0] || ''}`,
    sudo: (args) => `admin is not in the sudoers file. This incident will be reported.`,
    df: () => `
Filesystem     1K-blocks      Used Available Use% Mounted on
tmpfs         16777216         0  16777216   0% /
    `,
    kill: () => 'kill: operation not permitted',
    reboot: () => 'reboot: Operation not permitted',
};


export default function Terminal() {
    const { state: desktopState } = useDesktop();
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [internalState, setInternalState] = useState({ currentPath: '/', history: [] as string[] });
    const endOfHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (command: string) => {
        const [cmd, ...args] = command.split(' ');
        let output;

        if (cmd === 'clear') {
            setHistory([]);
            setInternalState(prev => ({ ...prev, history: [...prev.history, command] }));
            return;
        }

        if (COMMANDS[cmd]) {
            const result = COMMANDS[cmd](args, { ...internalState, desktopFiles: desktopState.desktopFiles });
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
            handleCommand(input);
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
                <span>&gt;</span>
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
