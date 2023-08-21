import setUserName from "../App"
import { signInWithPopup, getAuth } from "firebase/auth";

function Login(props) {
    return(
    <>
        <h1>
            TradeTrain
        </h1>
        <h2>
            by Hindsight
        </h2>
        <br/>
        <br/>
        <br/>
        <h2>
            A fast-paced game to help traders and managers improve trading outcomes by SIMULATING on curated historical market data.
        </h2>
        <br/>
        {props.children}
    </>
    )
}

export default Login