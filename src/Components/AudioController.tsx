// components/AudioController.js
"use client"

import React, { useState, useEffect, MouseEventHandler } from 'react';
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { useAudioURL } from '@/zustand/state';

interface propType {
    onPlay: MouseEventHandler<SVGElement>;
    onPause: MouseEventHandler<SVGElement>;
    isPlaying: boolean;
    onVolumeChange: Function;
    onSeek: Function;
    currentTime: number;
    duration: number;
}

const AudioController = ({ onPlay, onPause, isPlaying, onVolumeChange, onSeek, currentTime, duration }: propType) => {
    const [volume, setVolume] = useState(100);
    const [isSeeking, setIsSeeking] = useState(false);

    const {audioInfo} = useAudioURL((state:any) => state)

    useEffect(() => {
        setVolume(100); // Reset volume when audio changes
    }, [isPlaying]);

    const handleVolumeChange = (e: any) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        onVolumeChange(newVolume / 100); // Normalize volume between 0 and 1
    };

    const handleSeek = (e: any) => {
        const newTime = e.target.value;
        onSeek(newTime);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex flex-row gap-2 items-center justify-between w-full min-h-[56px] bg-black md:justify-between">
            <div className='w-[35ch]'>
                <p>{audioInfo.audioName}</p>
            </div>
            <div className='flex flex-col items-center md:gap-2'>
                <CiPlay1 onClick={onPlay} className={`${isPlaying ? "hidden" : "block"} cursor-pointer`} />
                <CiPause1 onClick={onPause} className={`${isPlaying ? "block" : "hidden"} cursor-pointer`} />
                <div className='flex flex-row items-center gap-3'>
                    <span className='md:hidden'>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={isSeeking ? currentTime : currentTime}
                        onMouseDown={() => setIsSeeking(true)}
                        onMouseUp={(e) => { setIsSeeking(false); handleSeek(e); }}
                        onChange={handleSeek}
                        className="h-[2px] accent-purple-600 w-72 md:w-auto"
                    />
                    <span className='md:hidden'>{formatTime(duration)}</span>
                </div>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="h-[2px] accent-purple-600 lg:hidden"
            />
        </div>
    );
};

export default AudioController;