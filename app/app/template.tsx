// Re-mounts on every navigation so .page-transition replays the fade per page.
export default function Template({ children }: { children: React.ReactNode }) {
	return <div className="page-transition">{children}</div>;
}
