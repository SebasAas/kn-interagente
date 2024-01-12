import { toast } from "react-toastify";

export const BASE_URL = "https://kn-workers-emachzhqzq-uc.a.run.app/";

export const fetchRanking = async (month: string, year: string, shift: string) => {
    const response = await fetch(`${BASE_URL}/ranking?month=${month}&year=${year}&shift=${shift}`);
    const data = await response.json();
    return data;
};

export const fetchWorker = async (code: string, month: string, year: string, shift: string) => {
    const response = await fetch(`${BASE_URL}worker/${code}?month=${month}&year=${year}&shift=${shift}`);
    const data = await response.json();
    return data;
};