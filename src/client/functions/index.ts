declare interface Window {
  setParam: typeof setParam;
}

const setParam = (param: string, value: string) => {
  let params = new URLSearchParams(window.location.search);

  if (value === "") {
    params.delete(param);
  } else {
    params.set(param, value);
  }

  if (window.history.replaceState) {
    const url =
      window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

    window.history.replaceState(
      {
        path: url,
      },
      "",
      url,
    );
  }
};

window.setParam = setParam;
