import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => (
    <div>
        <h1>logged In</h1>
        <button onClick={() => isLoggedInVar(false)}>Logout</button>
    </div>
)