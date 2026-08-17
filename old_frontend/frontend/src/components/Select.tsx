type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
export function Select({ label, id, children, ...props }: Props) { return <label className="field" htmlFor={id}><span>{label}</span><select id={id} {...props}>{children}</select></label> }
