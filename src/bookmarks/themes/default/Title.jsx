import { memo } from "react";

export const Title = memo(function Title({ showTitle, title }) {
  return (
    showTitle && (
      <div className="Title">
        <div className="title">{title}</div>
      </div>
    )
  );
});
