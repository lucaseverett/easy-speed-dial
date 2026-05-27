interface DialFolderProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  topOpacity?: number;
  bottomOpacity?: number;
}

export function DialFolder({
  className = "folder",
  topOpacity,
  bottomOpacity,
  ...props
}: DialFolderProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M10 4H4c-1.1 0-2 .9-2 2v2h20V8c0-1.1-.9-2-2-2h-8l-2-2z"
        opacity={topOpacity}
      />
      <path
        d="M2 8h20v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z"
        opacity={bottomOpacity}
      />
    </svg>
  );
}
