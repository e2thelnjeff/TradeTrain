import setUserName from "../App"
import { signInWithPopup, getAuth } from "firebase/auth";

function Login(props) {
    return(
    <>
        <h1>
            TradeTrain
        </h1>
        <p>
            Please login below...
        </p>
        {props.children}
    </>
    )
}

export default Login