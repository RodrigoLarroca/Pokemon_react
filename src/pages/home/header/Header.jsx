import React from "react";
import css from "./header.module.scss";
import logo from "../../../assets/pokemon-23.svg";

const Header = () => {
  return (
    <nav className={css.header}>
      <div className={css.div_header}>
        <div className={css.div_logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={css.navbar}>
          <ul className={css.navbar}>
            <li className={css.navItem}>
              <a className={css.navItem} href="#">Inicio</a>
            </li>
            <li className={css.navItem}>
              <a className={css.navItem} href="#">Equipo</a>
            </li>
            <li className={css.navItem}>
              <a className={css.navItem} href="#">Contacto</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
