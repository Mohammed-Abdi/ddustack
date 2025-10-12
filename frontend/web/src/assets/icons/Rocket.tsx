import type { SVGProps } from 'react';

export function Rocket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 16 16"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      >
        <path d="m4.25 9.75-2-.5s0-1.5.5-3 4-1.5 4-1.5m-.50 7l.5 2s1.5 0 3-.5 1.5-4 1.5-4m-7 .5 2 2s5-2 6.5-4.5 1.5-5.5 1.5-5.5-3 0-5.5 1.5-4.5 6.5-4.5 6.5z"></path>
        <path fill="currentColor" d="m1.75 14.25 2-1-1-1z"></path>
        <circle cx={10.25} cy={5.75} r={0.5} fill="currentColor"></circle>
      </g>
    </svg>
  );
}
