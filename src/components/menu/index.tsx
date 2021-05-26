import React, { ReactElement } from "react";
import cx from "classnames";
import { Mode } from "../../types";
import { ModeEnums } from "../../constants";
import styles from "./menu.module.css";

const { SELECT, LINE, RECT } = ModeEnums;
interface Menu {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const Menu = ({ mode, onChange }: Menu): ReactElement => {
  return (
    <div className={styles.menu}>
      <button
        className={cx(styles.select, {
          [styles[`select--selecting`]]: mode === SELECT,
        })}
        onClick={() => onChange(SELECT)}
      >
        select
      </button>
      <button
        className={cx(styles.line, {
          [styles[`line--drawing`]]: mode === LINE,
        })}
        onClick={() => onChange(LINE)}
      >
        line
      </button>
      <button
        className={cx(styles.rect, {
          [styles[`rect--drawing`]]: mode === RECT,
        })}
        onClick={() => onChange(RECT)}
      >
        rect
      </button>
      <div>
        {mode && mode !== SELECT && `drawing ${mode} ...`}
        {mode === SELECT && "selecting"}
      </div>
    </div>
  );
};

export default Menu;
