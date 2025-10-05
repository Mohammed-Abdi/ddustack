import type { SVGProps } from 'react';

export function Clock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <mask id="iconify-Czbmcdnl" fill="#fff">
        <path d="M12 6.5c0-.24 0-.359.08-.433c.082-.074.194-.065.42-.046a6 6 0 1 1-5.428 9.401c-.13-.186-.194-.279-.17-.386s.128-.166.335-.286l4.513-2.606c.122-.07.183-.105.216-.163c.034-.058.034-.129.034-.27z"></path>
      </mask>
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <path
          fill="currentColor"
          fillOpacity={0.5}
          strokeWidth={2.4}
          d="M12 6.5c0-.24 0-.359.08-.433c.082-.074.194-.065.42-.046a6 6 0 1 1-5.428 9.401c-.13-.186-.194-.279-.17-.386s.128-.166.335-.286l4.513-2.606c.122-.07.183-.105.216-.163c.034-.058.034-.129.034-.27z"
          mask="url(#iconify-Czbmcdnl)"
        ></path>
        <circle cx={12} cy={12} r={8.4} strokeWidth={1.2}></circle>
      </g>
    </svg>
  );
}
