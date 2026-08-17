type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }
export function Button({ variant = 'primary', children, ...props }: Props) { return <button className={`button button-${variant}`} {...props}>{children}</button> }
