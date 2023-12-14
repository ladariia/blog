import React, { useState, useEffect, useRef } from "react";
import { apiCall } from "lib/api/vms";
import useSWR from "swr";

const fetcher = (rootService, service, method, parameters) => {
    return parameters
        ? apiCall(
              {
                  rootService,
                  service,
                  method,
              },
              parameters
          )
        : apiCall({
              rootService,
              service,
              method,
          });
};

/*
     const { data, error } = useApi({
        rootService: "catalogproduct",
        service: "ProductTypeWS",
        method: "getCurrentObject",
        parameters: Number(id),
    });
*/
const useApi = (args) => {
    const {
        rootService,
        service,
        method,
        parameters = {},
        options = { dedupingInterval: 600000 },
        depends = [],
    } = args;
    const dp = true;
    for (let i = 0; i < depends.length; i++) {
        if (depends[i] === null || depends[i] === undefined) {
            dp = false;
            break;
        }
    }
    return useSWR(dp ? [rootService, service, method, parameters] : null, fetcher, options);
};

export default useApi;
