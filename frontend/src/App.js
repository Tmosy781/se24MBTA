import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import MbtaAlertsPage from "./components/pages/mbtaAlerts";
//import MbtaVehiclePage from "./components/pages/apiVehicles";
import MbtaLiveMapPage from "./components/pages/LiveMap";
import MbtaStopPage from "./components/pages/Stop";
import EditUserPage from "./components/pages/editUserPage";


export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/home" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route exact path="/mbtaAlerts" element={<MbtaAlertsPage />} />
          <Route exact path="/editUserPage" element={<EditUserPage />} />
          
          <Route exact path="/LiveMap" element={<MbtaLiveMapPage />} />
          <Route exact path="/Stop" element={<MbtaStopPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
