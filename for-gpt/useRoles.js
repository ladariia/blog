import React, { useState, useEffect } from "react";

import { useProfile } from "./UserProfileProvider";
import { apiCall } from "lib/api/vms";

const checkAccess = (serverRoles, roles) => {
    let result = false;
    for (let i = 0; i < serverRoles.length; i++) {
        const sR = serverRoles[i];
        if (roles.indexOf(sR.name) !== -1) {
            result = true;
            break;
        }
    }
    return result;
};

/*
 * rolesList - массив строк, каждая строка содержит одну или несколько ролей, разделенных |
 * Результат работы хука - массив булевых значений, соответствующих массиву переданных ролей
 * Например есть роли 'Администратор', 'Менеджер', 'Обычный'
 * Пользователю присвоены роли 'Менеджер', 'Обычный'
 * rootService - микросервис с которого получать роли
 * const [isAdmin, isManager, isUsual] = useRoles(['Администратор', 'Менеджер', 'Обычный'], 'constructor');
 * результатом будет isAdmin = false, isManager = true, isUsual = true
 *
 * const [isAdmin, isUsual] = useRoles(['Администратор|Менеджер', 'Обычный']);
 * вернет isAdmin = true, isUsual  = true
 */

const useRoles = (rolesList, rootService) => {
    const profile = useProfile();
    const [serverRoles, setServerRoles] = useState(null);

    useEffect(() => {
        if (profile && rootService) {
            apiCall(
                {
                    rootService,
                    service: "SecurityWS",
                    method: "getRolesOfUser",
                },
                { uniqueKey: profile.user.uniqueKey }
            ).then((res) => setServerRoles(res));
        }
    }, [profile, rootService]);

    if (!rootService) {
        return rolesList.map((r) => true);
    }

    if (!serverRoles) {
        return [];
    }

    return rolesList.map((it) => {
        const roles = it.split("|");
        return checkAccess(serverRoles, roles);
    });
};

export default useRoles;
