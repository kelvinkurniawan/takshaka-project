// template.tsx re-mounts on every navigation (unlike layout.tsx), so the
// CSS fade in .page-transition replays each time the page changes.
export default function Template({ children }: { children: React.ReactNode }) {
	return <div className="page-transition">{children}</div>;
}
