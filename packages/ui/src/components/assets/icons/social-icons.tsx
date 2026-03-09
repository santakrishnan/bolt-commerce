/**
 * Social Media Icons
 * SVG icons for footer social links
 */

interface IconProps {
  className?: string;
  size?: number;
}

export function FacebookIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_facebook)">
        <path
          d="M11.9986 1.33398H9.99877C9.11481 1.33398 8.26706 1.68514 7.642 2.31019C7.01695 2.93524 6.6658 3.783 6.6658 4.66696V6.66674H4.66602V9.33312H6.6658V14.6659H9.33218V9.33312H11.332L11.9986 6.66674H9.33218V4.66696C9.33218 4.49016 9.40241 4.32061 9.52742 4.1956C9.65243 4.07059 9.82198 4.00036 9.99877 4.00036H11.9986V1.33398Z"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_facebook">
          <rect width="15.9983" height="15.9983" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function TwitterIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M15.3333 2.00004C14.6945 2.51669 13.9751 2.92679 13.2053 3.21337C12.7924 2.73682 12.242 2.40261 11.6338 2.25266C11.0256 2.10272 10.3877 2.14424 9.80237 2.37177C9.21704 2.59929 8.71501 2.9999 8.36184 3.51923C8.00867 4.03856 7.8211 4.65326 7.82667 5.28004V6.01337C6.57798 6.04622 5.33838 5.76839 4.22061 5.20316C3.10283 4.63793 2.13827 3.80126 1.41333 2.76671C1.41333 2.76671 -1.25333 8.76671 4.74667 11.4334C3.40473 12.376 1.78658 12.8481 0.146667 12.7834C6.14667 16.1167 13.48 12.7834 13.48 5.26004C13.4793 5.07219 13.4612 4.88483 13.426 4.70004C14.1036 3.99914 14.5924 3.13118 14.8413 2.18004L15.3333 2.00004Z"
        stroke="currentColor"
        strokeWidth="1.46667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_instagram)">
        <path
          d="M11.3327 1.33398H4.66602C2.82505 1.33398 1.33268 2.82636 1.33268 4.66732V11.334C1.33268 13.1749 2.82505 14.6673 4.66602 14.6673H11.3327C13.1737 14.6673 14.666 13.1749 14.666 11.334V4.66732C14.666 2.82636 13.1737 1.33398 11.3327 1.33398Z"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.6654 7.58065C10.7464 8.13493 10.6576 8.70131 10.4104 9.20354C10.1633 9.70577 9.76896 10.1214 9.28056 10.3932C8.79216 10.665 8.22991 10.7799 7.67232 10.7231C7.11474 10.6662 6.58767 10.4404 6.16771 10.0763C5.74775 9.71226 5.45478 9.22699 5.32952 8.68823C5.20426 8.14946 5.25283 7.58402 5.46884 7.07415C5.68484 6.56428 6.05841 6.13624 6.53614 5.85183C7.01387 5.56742 7.57165 5.44061 8.12898 5.48732C8.69741 5.53493 9.23566 5.75403 9.66014 6.11265C10.0846 6.47127 10.3742 6.95201 10.4864 7.48398"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.666 4.33398H11.6727"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_instagram">
          <rect width="15.9983" height="15.9983" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function YouTubeIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_youtube)">
        <path
          d="M15.1533 4.24004C15.0533 3.85337 14.8467 3.50004 14.56 3.22671C14.2667 2.94671 13.9067 2.74671 13.5133 2.65337C12.3733 2.33337 8 2.33337 8 2.33337C8 2.33337 3.62667 2.33337 2.48667 2.65337C2.09333 2.74671 1.73333 2.94671 1.44 3.22671C1.15333 3.50004 0.946667 3.85337 0.846667 4.24004C0.626667 5.38004 0.52 6.54004 0.526667 7.70004C0.52 8.86004 0.626667 10.02 0.846667 11.16C0.946667 11.5467 1.15333 11.9 1.44 12.1734C1.73333 12.4534 2.09333 12.6534 2.48667 12.7467C3.62667 13.0667 8 13.0667 8 13.0667C8 13.0667 12.3733 13.0667 13.5133 12.7467C13.9067 12.6534 14.2667 12.4534 14.56 12.1734C14.8467 11.9 15.0533 11.5467 15.1533 11.16C15.3733 10.02 15.48 8.86004 15.4733 7.70004C15.48 6.54004 15.3733 5.38004 15.1533 4.24004Z"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 10.0667L10.3333 7.70004L6.5 5.33337V10.0667Z"
          stroke="currentColor"
          strokeWidth="1.33319"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_youtube">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
