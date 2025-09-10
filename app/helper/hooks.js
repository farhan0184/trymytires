'use client'
import { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

export const useFetch = (func, query = {}, load = true) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(load);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")
  const [params, setParams] = useState(query);
  useEffect(() => {
    if (load) {
      getData(params);
    }
  }, []);

  const getData = (query) => {
    setLoading(true);
    setError("");
    setParams(query);        // replace params instead of merging stale
    func(query)              // send fresh query to API
      .then(({ success, data, message }) => {
        setLoading(false);
        if (success === true) {
          setData(data);
          setMessage(message)
        } else {
          setData(undefined);
          setError(message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setError(e.message);
      });
  };
  const clear = () => setData(undefined);
  return [data, getData, { query: params, loading, error, clear, message }];
};

export const performAction = async (func, data, reload, alert = true, successMsg) => {
  const { success, message, data: d } = await func({ ...data });
  if (success === true) {
    if (reload) {
      reload(d);
    }
    if (alert) {
      toast.success(message || successMsg || "Success");
    }
  } else {
    toast.error(message || "Something went wrong");
  }
};

export const performActionConfirm = async (
  func,
  data,
  reload,
  message,
  mode,
  alert = true
) => {
  // const i18n = useI18n()
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
  });
  if (isConfirmed) {
    await performAction(func, data, reload, alert);
  }
};

export const useOutsideClick = (ref, func) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        func && func();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

// useTitle.js

export function useTitle(title, prevailOnUnmount = false) {
  const defaultTitle = useRef(
    typeof document !== "undefined" ? document.title : ""
  );

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount && typeof document !== "undefined") {
        document.title = defaultTitle.current;
      }
    },
    []
  );
}



export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}