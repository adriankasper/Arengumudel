import {BrowserRouter as Router} from "react-router-dom";

const Main = (props) => {
    return(
        <main className="content-container">
            <Router>
                {props.children}
            </Router>
        </main>
    );
};

export default Main;