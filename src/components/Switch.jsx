export const Switch = ({ checked, children, ...props }) => {
  return (
    <button type="button" role="switch" aria-checked={checked} {...props}>
      {children}
    </button>
  );
};
