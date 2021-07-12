import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:8000');
console.log(socket);

const ContextConfig = createContext();

const ContextProvider = ({ children }) => {
    const [videoCheck, setVideoCheck] = useState(false);
    const [audioCheck, setAudioCheck] = useState(false);
    const [acceptCall, setAcceptCall] = useState(false);
    const [endCall, setendCall] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const myVideo = useRef();
    const peerVideo = useRef();
    const connRef = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });

        socket.on('me', (id) => setMe(id));

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });
    }, []);

    const answerCall = () => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            peerVideo.current.srcObject = currentStream;
        });

        setAcceptCall(true);
        peer.signal(call.signal);

        connRef.current = peer;
    };

    const hangUpCall = () => {
        setAcceptCall(false);
        window.location.reload();
    }

    const callUser = (id) => {
        console.log("name: "+name);
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on('stream', (currentStream) => {
            peerVideo.current.srcObject = currentStream;
        });

        socket.on('callAccepted', (signal) => {
            peer.signal(signal);
            setAcceptCall(true);
        });

        connRef.current = peer;
    };

    const leaveCall = () => {
        connRef.current.destroy();
        setendCall(true);
        window.location.reload();
    };

    const toggleVideo = (e) => {
        e.preventDefault();
        if (myVideo.current) {
            setVideoCheck(!videoCheck);
            myVideo.current.srcObject
                .getVideoTracks()
                .forEach((track) => (track.enabled = !track.enabled));
        }
    };

    const toggleAudio = (e) => {
        e.preventDefault();
        setAudioCheck(!audioCheck);
        if (myVideo.current) {
            myVideo.current.srcObject
                .getAudioTracks()
                .forEach((track) => (track.enabled = !track.enabled));
        }
    };

    return (
        <ContextConfig.Provider
            value={{
                call,
                acceptCall,
                myVideo,
                peerVideo,
                stream,
                name,
                setName,
                endCall,
                me,
                callUser,
                leaveCall,
                answerCall,
                toggleVideo,
                toggleAudio,
                videoCheck,
                audioCheck,
                hangUpCall,
            }}
        >
            {children}
        </ContextConfig.Provider>
    );
};

export { ContextProvider, ContextConfig };
