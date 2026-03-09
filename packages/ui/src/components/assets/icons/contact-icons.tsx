/**
 * Contact Icons
 * SVG icons for footer contact information
 */

interface IconProps {
  className?: string;
  size?: number;
}

export function PhoneIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_phone)">
        <path
          d="M18.3332 14.0994V16.5994C18.3341 16.8315 18.2866 17.0612 18.1936 17.2739C18.1006 17.4865 17.9643 17.6774 17.7933 17.8343C17.6222 17.9912 17.4203 18.1107 17.2005 18.185C16.9806 18.2594 16.7477 18.287 16.5165 18.2661C13.9522 17.9875 11.489 17.1112 9.32486 15.7078C7.31139 14.4283 5.60431 12.7212 4.32486 10.7078C2.91651 8.53377 2.04007 6.05859 1.76653 3.48276C1.7457 3.25232 1.77309 3.02006 1.84695 2.80078C1.9208 2.5815 2.03951 2.38 2.1955 2.20911C2.3515 2.03822 2.54137 1.90169 2.75302 1.8082C2.96468 1.71471 3.19348 1.66631 3.42486 1.6661H5.92486C6.32928 1.66212 6.72136 1.80533 7.028 2.06904C7.33464 2.33275 7.53493 2.69897 7.59153 3.09943C7.69705 3.89949 7.89274 4.68504 8.17486 5.4411C8.28698 5.73937 8.31125 6.06353 8.24478 6.37516C8.17832 6.6868 8.02392 6.97286 7.79986 7.19943L6.74153 8.25776C7.92783 10.3441 9.65524 12.0715 11.7415 13.2578L12.7999 12.1994C13.0264 11.9754 13.3125 11.821 13.6241 11.7545C13.9358 11.688 14.2599 11.7123 14.5582 11.8244C15.3143 12.1066 16.0998 12.3022 16.8999 12.4078C17.3047 12.4649 17.6744 12.6688 17.9386 12.9807C18.2029 13.2926 18.3433 13.6907 18.3332 14.0994Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_phone">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function EmailIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16.667 3.33398H3.33366C2.41318 3.33398 1.66699 4.08018 1.66699 5.00065V15.0007C1.66699 15.9211 2.41318 16.6673 3.33366 16.6673H16.667C17.5875 16.6673 18.3337 15.9211 18.3337 15.0007V5.00065C18.3337 4.08018 17.5875 3.33398 16.667 3.33398Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 5.83398L10.8587 10.584C10.6014 10.7452 10.3039 10.8307 10.0003 10.8307C9.69673 10.8307 9.39927 10.7452 9.14199 10.584L1.66699 5.83398"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocationIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_location)">
        <path
          d="M16.6663 8.33268C16.6663 12.4935 12.0505 16.8268 10.5005 18.1652C10.3561 18.2738 10.1803 18.3325 9.99967 18.3325C9.81901 18.3325 9.64324 18.2738 9.49884 18.1652C7.94884 16.8268 3.33301 12.4935 3.33301 8.33268C3.33301 6.56457 4.03539 4.86888 5.28563 3.61864C6.53587 2.36839 8.23156 1.66602 9.99967 1.66602C11.7678 1.66602 13.4635 2.36839 14.7137 3.61864C15.964 4.86888 16.6663 6.56457 16.6663 8.33268Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 10.834C11.3807 10.834 12.5 9.7147 12.5 8.33398C12.5 6.95327 11.3807 5.83398 10 5.83398C8.61929 5.83398 7.5 6.95327 7.5 8.33398C7.5 9.7147 8.61929 10.834 10 10.834Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_location">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
