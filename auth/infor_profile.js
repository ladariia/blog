import jwt_decode from "jwt-decode";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

// const endpoint = "https://infor.trans-monitor.ru:8143/sso-ws/rest/SecurityWS/getUser";
const endpoint = publicRuntimeConfig.ssoUri + "/rest/SecurityWS/getUser";

const profile = async (req, res) => {
    const [_, token] = req.headers["authorization"].split(" ");
    const data = jwt_decode(token);
    const request = {
        method: "POST",
        headers: {
            Authorization: req.headers["authorization"],
            "Content-Type": "application/json",
        },
        body: JSON.stringify([{}]),
    };

    const syncResponse = await fetch(endpoint, request);
    const json = await syncResponse.json();
    res.json(json);
};

export default profile;
