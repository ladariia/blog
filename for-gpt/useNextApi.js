import useSWR from "swr";
import fetch from "unfetch";

const fetcher = (url, parameters) => {
    return fetch(url, parameters).then((r) => r.json());
};

const useNextApi = (args) => {
    const { url, parameters } = args;
    return useSWR([url, parameters], fetcher);
};

export default useNextApi;
