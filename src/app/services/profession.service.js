import httpService from "./http.service";

const professionEndpoint = "profession/";

const professionService = {
    fetchAll: async () => {
        const { data } = await httpService.get(professionEndpoint);
        return data;
    }
};
export default professionService;
