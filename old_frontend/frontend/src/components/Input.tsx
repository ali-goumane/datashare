type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
export function Input({ label, error, id, ...props }: Props) { return <label className="field" htmlFor={id}><span>{label}</span><input id={id} {...props} />{error && <small className="field-error">{error}</small>}</label> }
