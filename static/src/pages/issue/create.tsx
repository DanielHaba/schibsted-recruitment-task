import React from "react";
import { NewIssue } from "../../component/issue/new";
import { Link } from "react-router-dom";


export function IssueCreatePage() {
    return (
        <section>
            <h3>New issue</h3>
            <main>
                <NewIssue />
            </main>
            <Link to="/">Back to issue list</Link>
        </section>
    );
}
