import type { SVGProps } from 'react';

export function LogoColored(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 28 28"
      {...props}
    >
      <g fill="none">
        <path
          fill="url(#SVGiYwdPljc)"
          d="M7.99 5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h1.99a2 2 0 0 0 2-2z"
        ></path>
        <path
          fill="url(#SVGiYwdPljc)"
          d="m22.07 6.543l3.86 15.483a2 2 0 0 1-1.457 2.425l-1.963.489a2 2 0 0 1-2.424-1.457L16.226 8a2 2 0 0 1 1.456-2.425l1.963-.489a2 2 0 0 1 2.425 1.457"
        ></path>
        <path
          fill="url(#SVGiYwdPljc)"
          d="M12.99 3a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        ></path>
        <path fill="url(#SVG0zwIkb4H)" d="M2 7h6v2H2z"></path>
        <path fill="url(#SVG0zwIkb4H)" d="M9 7h6v2H9z"></path>
        <path
          fill="url(#SVG0zwIkb4H)"
          d="m16.866 10.567l5.815-1.575l.486 1.953l-5.817 1.565z"
        ></path>
        <defs>
          <linearGradient
            id="SVGiYwdPljc"
            x1={4.509}
            x2={10.051}
            y1={3}
            y2={31.672}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#43e5ca"></stop>
            <stop offset={1} stopColor="#2764e7"></stop>
          </linearGradient>
          <linearGradient
            id="SVG0zwIkb4H"
            x1={16.866}
            x2={24.873}
            y1={2.27}
            y2={4.431}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9ff0f9"></stop>
            <stop offset={1} stopColor="#6ce0ff"></stop>
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 28 28"
      fill="currentColor"
      {...props}
    >
      <g fill="currentColor">
        <path d="M7.99 5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h1.99a2 2 0 0 0 2-2z" />
        <path d="m22.07 6.543 3.86 15.483a2 2 0 0 1-1.457 2.425l-1.963.489a2 2 0 0 1-2.424-1.457L16.226 8a2 2 0 0 1 1.456-2.425l1.963-.489a2 2 0 0 1 2.425 1.457" />
        <path d="M12.99 3a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M2 7h6v2H2z" />
        <path d="M9 7h6v2H9z" />
        <path d="m16.866 10.567 5.815-1.575.486 1.953-5.817 1.565z" />
      </g>
    </svg>
  );
}
