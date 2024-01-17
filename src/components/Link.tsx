interface Props extends JSX.HtmlAnchorTag {
  hxHeaders?: Record<string, string>;
}

export const Link = ({ href, children, hxHeaders, ...p }: Props) => {
  return (
    <a
      {...p}
      hx-get={href}
      hx-replace-url="true"
      hx-push-url="true"
      hx-headers={hxHeaders ? JSON.stringify(hxHeaders) : undefined}
    >
      {children}
    </a>
  );
};
