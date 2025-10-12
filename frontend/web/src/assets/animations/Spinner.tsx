import type { SVGProps } from 'react';

export function Spinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity={0.25}
      ></path>
      <path
        fill="currentColor"
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
      >
        <animateTransform
          attributeName="transform"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        ></animateTransform>
      </path>
    </svg>
  );
}

export function SpinnersBarsRotateFade(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.14}
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.29}
          transform="rotate(30 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.43}
          transform="rotate(60 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.57}
          transform="rotate(90 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.71}
          transform="rotate(120 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.86}
          transform="rotate(150 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          transform="rotate(180 12 12)"
        ></rect>
        <animateTransform
          attributeName="transform"
          calcMode="discrete"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        ></animateTransform>
      </g>
    </svg>
  );
}
