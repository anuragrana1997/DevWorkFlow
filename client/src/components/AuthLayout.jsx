import "../styles/Auth.css";

export const AuthLayout = ({ eyebrow, title, description, children }) => (
    <main className="auth-page">
        <section className="auth-intro" aria-label="DevWorkflow">
            <div className="auth-brand">
                <span className="auth-brand-mark" aria-hidden="true">DW</span>
                <span>DevWorkflow</span>
            </div>

            <div className="auth-intro-copy">
                <p className="auth-kicker">YOUR WORKSPACE, IN ONE PLACE</p>
                <h1>Keep every project moving.</h1>
                <p>See the tasks that need you, follow progress, and keep conversations close to the work.</p>
            </div>

            <p className="auth-intro-footer">A clearer view of what comes next.</p>
        </section>

        <section className="auth-content">
            <div className="auth-card">
                <p className="auth-eyebrow">{eyebrow}</p>
                <h2>{title}</h2>
                <p className="auth-description">{description}</p>
                {children}
            </div>
        </section>
    </main>
);
