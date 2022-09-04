export const Title = ({ showTitle, title }) => {
  return (
    showTitle && (
      <div className="Title">
        <div className="title" title={title}>
          {title}
        </div>
      </div>
    )
  );
};
