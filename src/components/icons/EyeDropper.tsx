interface EyeDropperProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function EyeDropper({
  className = "eyedropper-icon",
  ...props
}: EyeDropperProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10.5 6.5L17.5 13.5M2 22C2 22 6.5 21.5 9 19L21 7C22.1046 5.89543 22.1046 4.10456 21 3C19.8954 1.89543 18.1046 1.89542 17 3L5 15C2.5 17.5 2 22 2 22Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
