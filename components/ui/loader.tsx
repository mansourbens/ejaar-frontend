import React from 'react';
import './loader.css';

interface LoaderProps {
    size?: number;
    color?: string;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
                                           size = 40,
                                           color = '#53769b',
                                           className = ''
                                       }) => {
    const scale = size / 11.769205; // Original SVG width

    return (
        <div className={`loader-container ${className}`}>
            <svg
                className="loader"
                width={size}
                height={size * (10.610624 / 11.769205)}
                viewBox="0 0 11.769205 10.610624"
                style={{ '--loader-color': color } as React.CSSProperties}
            >
                <g transform="translate(-108.99107,-10.684379)">
                    <path
                        d="m 112.07935,10.78784 c 0.24142,0.396213 2.57902,4.939657 2.19426,4.963964 -0.45177,0.02854 -4.65633,0.01741 -5.28026,0.01027"
                        className="loader-path"
                    />
                    <path
                        d="m 117.60084,10.850816 c -0.24142,0.396213 -2.58337,4.91635 -2.21596,4.915455 0.57621,-0.0013 4.73096,0.04706 5.36591,0.01672"
                        className="loader-path"
                    />
                    <path
                        d="m 117.83611,21.057017 c -0.21735,-0.409913 -2.75093,-4.427394 -3.09442,-4.415507 -0.4524,0.01566 -2.59291,4.022294 -2.84953,4.569008"
                        className="loader-path"
                    />
                </g>
            </svg>
        </div>
    );
};

export default Loader;
