interface IconProps {
  size?: number;
  className?: string;
}

export function ArrowCircleIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 0C12.8355 0 9.74207 0.938383 7.11088 2.69649C4.4797 4.45459 2.42894 6.95344 1.21793 9.87706C0.00693255 12.8007 -0.309921 16.0177 0.307443 19.1214C0.924806 22.2251 2.44866 25.0761 4.6863 27.3137C6.92394 29.5513 9.77486 31.0752 12.8786 31.6926C15.9823 32.3099 19.1993 31.9931 22.1229 30.7821C25.0466 29.5711 27.5454 27.5203 29.3035 24.8891C31.0616 22.2579 32 19.1645 32 16C31.9955 11.7579 30.3084 7.69085 27.3088 4.69124C24.3092 1.69163 20.2421 0.00447972 16 0ZM16 29.5385C13.3223 29.5385 10.7048 28.7444 8.47844 27.2568C6.25205 25.7692 4.51679 23.6548 3.4921 21.1809C2.4674 18.7071 2.1993 15.985 2.72168 13.3588C3.24407 10.7326 4.53348 8.32025 6.42687 6.42686C8.32026 4.53347 10.7326 3.24406 13.3588 2.72168C15.985 2.19929 18.7071 2.4674 21.1809 3.49209C23.6548 4.51679 25.7692 6.25204 27.2568 8.47843C28.7444 10.7048 29.5385 13.3223 29.5385 16C29.5344 19.5894 28.1067 23.0306 25.5686 25.5686C23.0306 28.1067 19.5894 29.5344 16 29.5385ZM23.0246 15.1292C23.139 15.2435 23.2298 15.3793 23.2918 15.5287C23.3537 15.6781 23.3856 15.8383 23.3856 16C23.3856 16.1617 23.3537 16.3219 23.2918 16.4713C23.2298 16.6207 23.139 16.7565 23.0246 16.8708L18.1015 21.7938C17.8706 22.0248 17.5574 22.1545 17.2308 22.1545C16.9042 22.1545 16.5909 22.0248 16.36 21.7938C16.1291 21.5629 15.9993 21.2497 15.9993 20.9231C15.9993 20.5965 16.1291 20.2832 16.36 20.0523L19.1831 17.2308H9.84616C9.51974 17.2308 9.20669 17.1011 8.97587 16.8703C8.74506 16.6395 8.61539 16.3264 8.61539 16C8.61539 15.6736 8.74506 15.3605 8.97587 15.1297C9.20669 14.8989 9.51974 14.7692 9.84616 14.7692H19.1831L16.36 11.9477C16.1291 11.7167 15.9993 11.4035 15.9993 11.0769C15.9993 10.7503 16.1291 10.4371 16.36 10.2062C16.5909 9.97521 16.9042 9.84547 17.2308 9.84547C17.5574 9.84547 17.8706 9.97521 18.1015 10.2062L23.0246 15.1292Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CertifiedDocumentIcon({ size = 31, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * 38) / 31)}
      viewBox="0 0 31 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.5665 2.17773H5.36453C4.46858 2.17773 3.60932 2.53222 2.97578 3.1632C2.34225 3.79418 1.98633 4.64997 1.98633 5.54232V32.459C1.98633 33.3513 2.34225 34.2071 2.97578 34.8381C3.60932 35.4691 4.46858 35.8236 5.36453 35.8236H25.6338C26.5297 35.8236 27.389 35.4691 28.0225 34.8381C28.6561 34.2071 29.012 33.3513 29.012 32.459V10.5892L20.5665 2.17773Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8789 2.17773V8.9069C18.8789 9.79924 19.2348 10.655 19.8684 11.286C20.5019 11.917 21.3612 12.2715 22.2571 12.2715H29.0135"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4326 24.0462L13.8108 27.4108L20.5672 20.6816"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedBadgeIcon({ size = 38, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * 37) / 38)}
      viewBox="0 0 38 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19.0003 33.9173C27.7448 33.9173 34.8337 27.015 34.8337 18.5007C34.8337 9.98626 27.7448 3.08398 19.0003 3.08398C10.2558 3.08398 3.16699 9.98626 3.16699 18.5007C3.16699 27.015 10.2558 33.9173 19.0003 33.9173Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 18.5013L17.4167 21.5846L23.75 15.418"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuaranteeIcon({ size = 36, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M31.5 18C31.5 14.4196 30.0777 10.9858 27.5459 8.45406C25.0142 5.92232 21.5804 4.5 18 4.5C14.2259 4.5142 10.6035 5.98684 7.89 8.61L4.5 12"
        stroke="currentColor"
        strokeWidth="1.99942"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 4.5V12H12"
        stroke="currentColor"
        strokeWidth="1.99942"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18C4.5 21.5804 5.92232 25.0142 8.45406 27.5459C10.9858 30.0777 14.4196 31.5 18 31.5C21.7741 31.4858 25.3965 30.0132 28.11 27.39L31.5 24"
        stroke="currentColor"
        strokeWidth="1.99942"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24H31.5V31.5"
        stroke="currentColor"
        strokeWidth="1.99942"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
