import { FormEvent, useState } from "react";
import { API_BASE_URL } from "../config";
import AppHeader from "./header";
import Questions from "./questions";

type Status = "idle" | "loading" | "success" | "error";
type Page = "login" | "questions";

const Main = () => {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState<string>("");
    const [page, setPage] = useState<Page>("login");
    const [examinerId, setExaminerId] = useState<string>("");
    const [round, setRound] = useState<number>(1);
    const [loginTime, setLoginTime] = useState<string>("");

    const canSubmit = username.trim().length > 0 && status !== "loading";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedName = username.trim();
        if (!trimmedName) {
            setStatus("error");
            setMessage("Please enter your name.");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const params = new URLSearchParams({ username: trimmedName });
            const url = `${API_BASE_URL}/examiner/login?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET"
            });

            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(body.message ?? "Login failed");
            }

            setStatus("success");
            setMessage(body.message ?? "Login allowed");
            setExaminerId(body.examiner_id ?? "");
            setRound(body.round ?? 1);
            setLoginTime(body.login_time ?? "");
            setPage("questions");
        } catch (error) {
            const fallback = error instanceof Error ? error.message : "Login failed";
            setStatus("error");
            setMessage(fallback);
        }
    };

    return (
        <>
            <AppHeader />
            <div className="page">
                {page === "login" ? (
                    <div className="card">
                        <header>
                            <h1>Examiner Login</h1>
                            <p>Enter your name to access the evaluation platform.</p>
                        </header>

                        <form className="login-form" onSubmit={handleSubmit}>
                            <label className="label" htmlFor="username">
                                Name <span className="hint">Required</span>
                            </label>
                            <input
                                id="username"
                                className="input"
                                type="text"
                                autoComplete="name"
                                placeholder="e.g. Name"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />

                            <button className="submit-btn" type="submit" disabled={!canSubmit}>
                                {status === "loading" ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        {status === "success" && <div className="status success">{message}</div>}
                        {status === "error" && <div className="status error">{message}</div>}

                        <div className="info">
                            <div><strong>Login window:</strong> 8:00am–12:00pm Eastern</div>
                            {loginTime && <div><strong>Login time:</strong> {new Date(loginTime).toLocaleString()}</div>}
                        </div>
                    </div>
                ) : (
                    <Questions
                        username={username}
                        examinerId={examinerId}
                        round={round}
                    />
                )}
            </div>
        </>
    );
};

export default Main;
