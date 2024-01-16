interface Props extends JSX.HtmlAnchorTag {
  hxHeaders?: Record<string, string>;
}

export const Link = ({ href, children, hxHeaders, preload, ...p }: Props) => {
  return (
    <a
      {...p}
      hx-get={href}
      hx-replace-url="true"
      hx-headers={hxHeaders ? JSON.stringify(hxHeaders) : undefined}
      preload={preload ?? undefined}
    >
      {children}
    </a>
  );
};
