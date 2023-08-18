import setUserName from "../App"
import { signInWithPopup, getAuth } from "firebase/auth";

function Login(props) {
    return(
    <>
        <h1>
            TradeTrain
        </h1>
        {props.children}
    </>
    )
}

export default Login