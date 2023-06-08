
//Sellega merge
//import React from 'react';
import Main from './Main';
//import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';
import './css/style.css';
import Routes from "./Routes";
import {UserProvider} from './userContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const userIdContext = React.createContext();

function App() {
  return (
    <React.Fragment>
      <UserProvider>
        <Main>
          <Routes />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Main>
      </UserProvider>
    </React.Fragment>
  );
}

// export const useUserIdContext = () => {
//   return useContext(userIdContext);
// }




export default App;
