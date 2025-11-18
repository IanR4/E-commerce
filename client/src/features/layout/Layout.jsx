import { Outlet } from "react-router";
import Navbar from "../../components/headers/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import {useCarritoContext} from '../../store/CarritoContext.jsx'

const Layout = () => {

    return(
        <>
          <Navbar></Navbar>
          <Outlet className = "main" />
          <Footer></Footer>
        </>
    )
}

export default Layout;