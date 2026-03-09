interface IconProps {
  size?: number;
  className?: string;
  fill?: string;
}

export function StarIcon({ size = 16, className = "", fill = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 0L10.2451 5.52786L16 6.40983L12 10.2918L12.9443 16L8 13.5279L3.05573 16L4 10.2918L0 6.40983L5.75486 5.52786L8 0Z" />
    </svg>
  );
}
