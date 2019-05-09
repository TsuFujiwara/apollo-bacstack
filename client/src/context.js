import { createContext } from "react";

// contextのインスタンス作成(主にstateのプロパティの初期状態を記述)
const Context = createContext({
  // 初期状態はcurrentUserをnullにする
  currentUser: null,
  isAuth: false,
  draft: null,
  targets: [],
  currentTarget: null,
  objects: [],
  currentObject: null,
  currentTimeSeries: []
});

export default Context;
