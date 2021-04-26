import React, { ReactElement } from "react";
import cx from "classnames";
import { Mode } from "../../actions/action-types";
import styles from './menu.module.css'

type Menu = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

const Menu = ({ mode, onChange }: Menu): ReactElement => {
  return (
    <div className={styles.menu}>
      <button
        className={cx(styles.line, { [styles[`line--drawing`]]: mode === "line" })}
        onClick={() => onChange("line")}
      >
        line
      </button>
      <button
        className={cx(styles.rect, { [styles[`rect--drawing`]]: mode === "rect" })}
        onClick={() => onChange("rect")}
      >
        rect
      </button>
      <div>{mode && `drawing ${mode} ...`}</div>
    </div>
  );
};

export default Menu;
