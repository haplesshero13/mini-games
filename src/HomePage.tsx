import React from "react";
import { NavLink } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-0">
        {[5, 6, 7].map((n) => (
          <NavLink
            key={n}
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold border button text-white ${isActive ? "active disabled" : ""} bg-blue-500`
            }
            to={`/word-up-${n}`}
          >
            WordUp {n}-Letter
          </NavLink>
        ))}
        <NavLink
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold border button text-white bg-orange-400 ${isActive ? "active disabled" : ""}`
          }
          to="/word-up-gacha"
        >
          WordUp With Gacha
        </NavLink>
      </div>
      <p className="p-4">
        These are some simple games that may or may not be trying to make a
        point. This is a personal side project, and we don't like ads, so
        donations are appreciated.
      </p>
      <a href="https://ko-fi.com/X8X2PD3JW" target="_blank" className="p-4">
        <img
          height="36"
          style={{ border: 0, height: 36 }}
          src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
          alt="Buy Me a Coffee at ko-fi.com"
        />
      </a>
    </>
  );
};

export default HomePage;
