import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useWebSocket — manages a WebSocket connection lifecycle
 * @param {string} url - WebSocket server URL
 * @returns {{ connect, disconnect, sendCommand, connected, loading, error, reset }}
 */
export function useWebSocket(url: string) {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const ws = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        setLoading(true);
        setError(null);

        const socket = new WebSocket(url);

        socket.onopen = () => {
            setConnected(true);
            setLoading(false);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Server says:', data);
            } catch (err) {
                setError(new Error('Failed to parse message'));
            }
        };

        socket.onerror = () => {
            setError(new Error('WebSocket error'));
            setLoading(false);
        };

        socket.onclose = () => {
            setConnected(false);
            setLoading(false);
        };

        ws.current = socket;
    }, [url]);

    const disconnect = useCallback(() => {
        ws.current?.close();
        ws.current = null;
    }, []);

    const sendCommand = useCallback((cmd: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(cmd);
        } else {
            console.warn('WebSocket not open');
        }
    }, []);

    const reset = useCallback(() => {
        disconnect();
        setError(null);
    }, [disconnect]);

    useEffect(() => {
        return () => { ws.current?.close(); };
    }, []);

    return { connect, disconnect, sendCommand, connected, loading, error, reset };
}

export default useWebSocket;