import {create} from "zustand";

const useStore = create((set, get) => ({
    user: null,
    token: "",
    users: [],
    setGrid: val => set({grid: val}),
    setToken: val => set({token: val}),
    setUser: val => set({user: val}),
    setUsers: val => set({users: val}),
}))

export default useStore