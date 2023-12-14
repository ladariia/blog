import React, { useState, useEffect } from "react";
import { apiCall } from "lib/api/vms";

/*
 * useCRUDRights(rootService, service)
 * Проверка прав на методы save и delete сервиса
 * Параметры:
 * rootService - микросервис, строка
 * service - сервис, строка
 * Возвращает массив из двух элементов
 * [true усли есть права на метод save для этого сервиса, true если есть права на delete этого сервиса]
 * Пример использования:
 * const [isCreateEditRigths, isDeleteRights] = useCRUDRights('constructor', 'TechnologySchemeWS')
 */

const useCRUDRights = (rootService, service) => {
    const [rights, setRights] = useState([]);
    useEffect(() => {
        const serviceMethods = [
            {
                serviceName: service,
                methodName: "save",
            },
            {
                serviceName: service,
                methodName: "delete",
            },
        ];

        apiCall(
            { rootService, service: "SecurityWS", method: "checkMethodListInvocationAvaliable" },
            [serviceMethods]
        ).then((res) => setRights(res));
    }, [rootService, service]);

    return rights;
};

export default useCRUDRights;
